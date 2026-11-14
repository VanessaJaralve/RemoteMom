/** @jest-environment jsdom */

const { readFileSync } = require('fs');
const { join } = require('path');
const validation = require('../landing/launchpad/lead-validation');

const html = readFileSync(join(__dirname, '..', 'landing', 'launchpad', 'index.html'), 'utf8');
const signupScript = readFileSync(join(__dirname, '..', 'landing', 'waitlist.js'), 'utf8');
const storageKey = 'remotemom:launchpad-leads';
const validValues = {
  name: 'Test Mom',
  email: 'qa+signup@example.com',
  currentStage: 'already-working-remotely',
  biggestChallenge: 'family-compatible-schedule'
};

function response(body = { ok: true }, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body)
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function mountSignup(options = {}) {
  // Use the real form markup and DOM/FormData/event behavior. Only external boundaries
  // (network, navigation, timers, and exceptional storage access) are substituted.
  document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
  const form = document.querySelector('[data-launchpad-form]');
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const fetchMock = options.fetch || jest.fn().mockResolvedValue(response());
  const redirect = jest.fn();
  const browserWindow = {
    location: {
      search: options.search || '',
      assign: redirect
    },
    RemoteMomLaunchpadValidation: options.withoutValidator ? undefined : validation,
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (timer) => clearTimeout(timer)
  };
  Object.defineProperty(browserWindow, 'localStorage', {
    get: () => {
      if (options.blockStorageAccess) {
        throw new DOMException('Storage is unavailable.', 'SecurityError');
      }
      return window.localStorage;
    }
  });

  let lastSubmission;
  const addEventListener = form.addEventListener.bind(form);
  form.addEventListener = (type, listener, eventOptions) => {
    addEventListener(type, (event) => {
      const result = listener(event);
      if (type === 'submit') {
        lastSubmission = result;
      }
    }, eventOptions);
  };
  const run = new Function(
    'window', 'document', 'FormData', 'fetch', 'AbortController', signupScript
  );
  run(browserWindow, document, FormData, fetchMock, AbortController);
  const reset = jest.spyOn(form, 'reset');

  function fill(values = validValues) {
    form.elements.namedItem('name').value = values.name || '';
    form.elements.namedItem('email').value = values.email || '';
    form.querySelectorAll('[name="currentStage"]').forEach((radio) => {
      radio.checked = radio.value === values.currentStage;
    });
    form.elements.namedItem('biggestChallenge').value = values.biggestChallenge || '';
  }

  function submit() {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    return lastSubmission;
  }

  return {
    form, status, button, fetchMock, redirect, reset, fill, submit,
    values: () => Object.fromEntries(new FormData(form).entries())
  };
}

function expectUnconfirmed(fixture, valuesBefore) {
  expect(fixture.redirect).not.toHaveBeenCalled();
  expect(fixture.reset).not.toHaveBeenCalled();
  expect(fixture.values()).toEqual(valuesBefore);
  expect(fixture.button.disabled).toBe(false);
  expect(fixture.form.getAttribute('aria-busy')).toBe('false');
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
  document.body.innerHTML = '';
});

describe('Launchpad signup events', () => {
  it('loads shared validation first and keeps a stable live status and help link', () => {
    const fixture = mountSignup();
    const scripts = Array.from(document.querySelectorAll('script')).map((script) =>
      script.getAttribute('src')
    );

    expect(scripts.indexOf('lead-validation.js')).toBeGreaterThanOrEqual(0);
    expect(scripts.indexOf('lead-validation.js')).toBeLessThan(scripts.indexOf('../waitlist.js'));
    expect(fixture.status.id).toBe('launchpad-status');
    expect(fixture.status.getAttribute('role')).toBe('status');
    expect(fixture.status.getAttribute('aria-live')).toBe('polite');
    expect(fixture.status.getAttribute('aria-atomic')).toBe('true');
    expect(fixture.form.querySelector('.form-help a').getAttribute('href')).toBe('#help');
    expect(document.querySelector('#help')).not.toBeNull();
  });

  it.each([
    ['name', ''],
    ['email', ''],
    ['email', '@'],
    ['email', 'mom@example'],
    ['email', 'mom..name@example.com'],
    ['email', 'mom@example..com'],
    ['email', 'mom name@example.com'],
    ['currentStage', ''],
    ['biggestChallenge', '']
  ])('blocks invalid %s=%s without requesting or storing it', async (field, value) => {
    const fixture = mountSignup();
    fixture.fill({ ...validValues, [field]: value });
    const valuesBefore = fixture.values();

    await fixture.submit();

    expect(fixture.fetchMock).not.toHaveBeenCalled();
    expect(fixture.redirect).not.toHaveBeenCalled();
    expect(fixture.reset).not.toHaveBeenCalled();
    expect(fixture.values()).toEqual(valuesBefore);
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(fixture.status.textContent).toMatch(/Please (add|enter|select)/);
    expect(document.activeElement.getAttribute('name')).toBe(field);
    expect(document.activeElement.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement.getAttribute('aria-describedby')).toContain('launchpad-status');
    expect(fixture.button.disabled).toBe(false);
  });

  it('rejects tampered stage and challenge values before the network boundary', async () => {
    const fixture = mountSignup();
    fixture.fill();
    const radio = fixture.form.querySelector('[name="currentStage"]:checked');
    radio.value = 'unknown-stage';

    await fixture.submit();
    expect(fixture.status.textContent).toBe('Please select your current stage.');
    expect(fixture.fetchMock).not.toHaveBeenCalled();

    radio.value = validValues.currentStage;
    const select = fixture.form.elements.namedItem('biggestChallenge');
    select.appendChild(new Option('Unknown', 'unknown-challenge'));
    select.value = 'unknown-challenge';

    await fixture.submit();
    expect(fixture.status.textContent).toBe('Please select your biggest remote-work challenge.');
    expect(fixture.fetchMock).not.toHaveBeenCalled();
  });

  it('preserves values with an actionable message if shared validation cannot load', async () => {
    const fixture = mountSignup({ withoutValidator: true });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expect(fixture.fetchMock).not.toHaveBeenCalled();
    expect(fixture.values()).toEqual(valuesBefore);
    expect(fixture.status.textContent).toContain('signup check could not load');
    expect(fixture.status.textContent).toContain('Get help');
    expect(fixture.button.disabled).toBe(false);
  });

  it.each([
    'looking-for-remote-work',
    'returning-after-career-break',
    'already-working-remotely',
    'exploring-both'
  ])('accepts confirmed collection for the existing stage %s', async (currentStage) => {
    const fixture = mountSignup();
    fixture.fill({ ...validValues, currentStage });

    await fixture.submit();

    expect(fixture.fetchMock).toHaveBeenCalledTimes(1);
    expect(fixture.fetchMock.mock.calls[0][0]).toBe('/api/launchpad-lead');
    const sent = JSON.parse(fixture.fetchMock.mock.calls[0][1].body);
    expect(sent.currentStage).toBe(currentStage);
    expect(sent.biggestChallenge).toBe(validValues.biggestChallenge);
    expect(fixture.reset).toHaveBeenCalledTimes(1);
    expect(fixture.redirect).toHaveBeenCalledWith('./download/');
    expect(fixture.status.textContent).toBe('Your starter kit is ready.');
    expect(fixture.button.disabled).toBe(false);
    expect(fixture.form.getAttribute('aria-busy')).toBe('false');
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it('preserves the existing payload, bounded UTMs, and unrelated stored data', async () => {
    const legacyBackup = '[{"legacy":"keep this entry"}]';
    window.localStorage.setItem(storageKey, legacyBackup);
    window.localStorage.setItem('remotemom:waitlist', '[{"legacy":"other form"}]');
    const fixture = mountSignup({
      search: '?utm_source=%20facebook%20&utm_medium=%20social%20&utm_campaign=' +
        'c'.repeat(130) + '&utm_content=not-collected'
    });
    fixture.fill({ ...validValues, name: '  Test Mom  ', email: 'QA+tag@Sub.Example.com' });

    await fixture.submit();

    const sent = JSON.parse(fixture.fetchMock.mock.calls[0][1].body);
    expect(sent).toEqual({
      name: 'Test Mom',
      email: 'QA+tag@Sub.Example.com',
      currentStage: validValues.currentStage,
      biggestChallenge: validValues.biggestChallenge,
      utmSource: 'facebook',
      utmMedium: 'social',
      utmCampaign: 'c'.repeat(100),
      createdAt: expect.any(String)
    });
    expect(window.localStorage.getItem(storageKey)).toBe(legacyBackup);
    expect(window.localStorage.getItem('remotemom:waitlist')).toBe('[{"legacy":"other form"}]');
  });

  it('shows a safe 400 field correction without a backup or arbitrary server text', async () => {
    const fixture = mountSignup({
      fetch: jest.fn().mockResolvedValue(response({
        field: 'email',
        error: '<img src=x onerror=alert(1)> internal details'
      }, 400))
    });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toBe('Please enter a valid email address.');
    expect(fixture.status.textContent).not.toContain('backup');
    expect(fixture.status.querySelector('img')).toBeNull();
    expect(document.activeElement).toBe(fixture.form.elements.namedItem('email'));
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it('handles a 400 response with unreadable JSON as validation, not an offline backup', async () => {
    const result = response(null, 400);
    result.json.mockRejectedValue(new SyntaxError('Unreadable response'));
    const fixture = mountSignup({ fetch: jest.fn().mockResolvedValue(result) });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toContain('Please check your signup details');
    expect(fixture.status.textContent).not.toContain('backup');
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it.each([401, 403, 429, 500, 502, 503])(
    'keeps the form and reports uncertainty for HTTP %s, even with ok:true JSON',
    async (status) => {
      const fixture = mountSignup({
        fetch: jest.fn().mockResolvedValue(response({ ok: true }, status))
      });
      fixture.fill();
      const valuesBefore = fixture.values();

      await fixture.submit();

      expectUnconfirmed(fixture, valuesBefore);
      expect(fixture.status.textContent).toContain('could not confirm whether');
      expect(fixture.status.textContent).toContain('saved on this device');
      expect(fixture.status.textContent).toContain('not sent automatically');
      expect(fixture.status.textContent).toContain('Get help');
      expect(fixture.status.textContent).toContain('duplicate signup');
      expect(JSON.parse(window.localStorage.getItem(storageKey))).toHaveLength(1);
    }
  );

  it.each([null, undefined, [], false, 'ok', {}, { ok: false }, { ok: 'true' }])(
    'does not reset or redirect for nonconfirming successful HTTP JSON %j',
    async (body) => {
      const result = response();
      result.json.mockResolvedValue(body);
      const fixture = mountSignup({ fetch: jest.fn().mockResolvedValue(result) });
      fixture.fill();
      const valuesBefore = fixture.values();

      await fixture.submit();

      expectUnconfirmed(fixture, valuesBefore);
      expect(fixture.status.textContent).toContain('could not confirm whether');
      expect(JSON.parse(window.localStorage.getItem(storageKey))).toHaveLength(1);
    }
  );

  it('does not accept an HTTP-200 HTML or malformed-JSON response as confirmation', async () => {
    const result = response();
    result.json.mockRejectedValue(new SyntaxError('Unexpected HTML'));
    const fixture = mountSignup({ fetch: jest.fn().mockResolvedValue(result) });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toContain('could not confirm whether');
    expect(fixture.status.textContent).not.toContain('Unexpected HTML');
  });

  it('preserves values after network rejection and allows a manual confirmed retry', async () => {
    const fetchMock = jest.fn()
      .mockRejectedValueOnce(new Error('Connection lost'))
      .mockResolvedValueOnce(response());
    const fixture = mountSignup({ fetch: fetchMock });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    const backup = window.localStorage.getItem(storageKey);
    expect(JSON.parse(backup)).toHaveLength(1);

    await fixture.submit();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fixture.redirect).toHaveBeenCalledTimes(1);
    expect(fixture.reset).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(storageKey)).toBe(backup);
  });

  it('keeps a blocked-storage failure truthful and leaves the form usable', async () => {
    const fixture = mountSignup({
      blockStorageAccess: true,
      fetch: jest.fn().mockRejectedValue(new Error('Offline'))
    });
    fixture.fill();
    const valuesBefore = fixture.values();

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toContain('could not save a backup');
    expect(fixture.status.textContent).toContain('details are still in the form');
    expect(fixture.status.textContent).not.toContain('is saved on this device');
  });

  it.each(['getItem', 'setItem'])('handles throwing Storage.%s without losing existing data', async (method) => {
    const original = '[{"legacy":"keep"}]';
    window.localStorage.setItem(storageKey, original);
    const fixture = mountSignup({ fetch: jest.fn().mockRejectedValue(new Error('Offline')) });
    fixture.fill();
    const valuesBefore = fixture.values();
    const failingStorage = jest.spyOn(Storage.prototype, method).mockImplementation(() => {
      throw new DOMException('Storage unavailable or full.', 'QuotaExceededError');
    });

    await fixture.submit();

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toContain('could not save a backup');
    failingStorage.mockRestore();
    expect(window.localStorage.getItem(storageKey)).toBe(original);
  });

  it.each(['not json', '', '{}', 'null', '"text"'])(
    'does not overwrite corrupt or non-array local backup %j',
    async (stored) => {
      window.localStorage.setItem(storageKey, stored);
      const writes = jest.spyOn(Storage.prototype, 'setItem');
      const fixture = mountSignup({ fetch: jest.fn().mockRejectedValue(new Error('Offline')) });
      fixture.fill();
      const valuesBefore = fixture.values();

      await fixture.submit();

      expectUnconfirmed(fixture, valuesBefore);
      expect(writes).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(storageKey)).toBe(stored);
      expect(fixture.status.textContent).toContain('could not save a backup');
    }
  );

  it('preserves legacy array entries and does not append the same failed entry on retry', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-14T08:00:00Z'));
    const historical = [{ legacy: 'keep', extra: { untouched: true } }, null, 'old entry'];
    window.localStorage.setItem(storageKey, JSON.stringify(historical));
    const fixture = mountSignup({
      search: '?utm_source=qa&utm_medium=test&utm_campaign=retry-case',
      fetch: jest.fn().mockRejectedValue(new Error('Offline'))
    });
    fixture.fill();

    await fixture.submit();
    const firstBackup = JSON.parse(window.localStorage.getItem(storageKey));
    jest.setSystemTime(new Date('2026-11-14T08:01:00Z'));
    await fixture.submit();
    const secondBackup = JSON.parse(window.localStorage.getItem(storageKey));

    expect(firstBackup).toHaveLength(historical.length + 1);
    expect(firstBackup.slice(0, historical.length)).toEqual(historical);
    expect(secondBackup).toEqual(firstBackup);
    expect(fixture.fetchMock).toHaveBeenCalledTimes(2);
    expect(fixture.status.textContent).toContain('saved on this device');
    expect(fixture.status.textContent).toContain('duplicate signup');
  });

  it('blocks overlapping submit events independently of the disabled button', async () => {
    const pending = deferred();
    const fixture = mountSignup({ fetch: jest.fn().mockReturnValue(pending.promise) });
    fixture.fill();
    const first = fixture.submit();
    expect(fixture.button.disabled).toBe(true);
    expect(fixture.form.getAttribute('aria-busy')).toBe('true');
    fixture.button.disabled = false;

    await fixture.submit();

    expect(fixture.fetchMock).toHaveBeenCalledTimes(1);
    pending.resolve(response());
    await first;
    expect(fixture.redirect).toHaveBeenCalledTimes(1);
    expect(fixture.reset).toHaveBeenCalledTimes(1);
    expect(fixture.form.getAttribute('aria-busy')).toBe('false');
    expect(fixture.button.disabled).toBe(false);
  });

  it('times out an unconfirmed request, ignores its late success, and permits manual retry', async () => {
    jest.useFakeTimers();
    const pending = deferred();
    const fetchMock = jest.fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce(response());
    const fixture = mountSignup({ fetch: fetchMock });
    fixture.fill();
    const valuesBefore = fixture.values();
    const first = fixture.submit();
    const signal = fetchMock.mock.calls[0][1].signal;

    await jest.advanceTimersByTimeAsync(20000);
    await first;

    expectUnconfirmed(fixture, valuesBefore);
    expect(signal.aborted).toBe(true);
    expect(fixture.status.textContent).toContain('confirmation took too long');
    expect(fixture.status.textContent).toContain('could not confirm whether');
    pending.resolve(response());
    await jest.advanceTimersByTimeAsync(0);
    expect(fixture.redirect).not.toHaveBeenCalled();
    expect(fixture.reset).not.toHaveBeenCalled();

    await fixture.submit();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fixture.redirect).toHaveBeenCalledTimes(1);
    expect(fixture.reset).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('also bounds waiting for a JSON body and retains the form if it never completes', async () => {
    jest.useFakeTimers();
    const body = deferred();
    const result = response();
    result.json.mockReturnValue(body.promise);
    const fixture = mountSignup({ fetch: jest.fn().mockResolvedValue(result) });
    fixture.fill();
    const valuesBefore = fixture.values();
    const pending = fixture.submit();

    await jest.advanceTimersByTimeAsync(20000);
    await pending;

    expectUnconfirmed(fixture, valuesBefore);
    expect(fixture.status.textContent).toContain('confirmation took too long');
    body.resolve({ ok: true });
    await jest.advanceTimersByTimeAsync(0);
    expect(fixture.redirect).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });
});
