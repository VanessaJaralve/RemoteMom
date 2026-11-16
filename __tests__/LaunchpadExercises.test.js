/** @jest-environment jsdom */

const { readFileSync } = require('fs');
const { join } = require('path');

const html = readFileSync(join(__dirname, '..', 'landing', 'launchpad', 'index.html'), 'utf8');
const exerciseScript = readFileSync(join(__dirname, '..', 'landing', 'launchpad', 'design.js'), 'utf8');

function mountExercises(options = {}) {
  // Execute the shipped script against the real page markup. Only browser boundaries
  // that jsdom does not implement (clipboard, scrolling and media queries) are substituted.
  document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
  const field = document.querySelector('#reflection');
  const status = document.querySelector('#note-status');
  const copy = document.querySelector('#copy-note');
  const scroll = jest.fn();
  document.querySelector('#next-step').scrollIntoView = scroll;
  const clipboard = Object.prototype.hasOwnProperty.call(options, 'clipboard')
    ? options.clipboard : { writeText: jest.fn().mockResolvedValue(undefined) };
  const browserWindow = {
    matchMedia: jest.fn().mockReturnValue({ matches: Boolean(options.reducedMotion) })
  };

  let lastCopy;
  const addEventListener = copy.addEventListener.bind(copy);
  copy.addEventListener = (type, listener, eventOptions) => {
    addEventListener(type, (event) => {
      lastCopy = listener(event);
    }, eventOptions);
  };
  new Function('document', 'window', 'navigator', exerciseScript)(
    document, browserWindow, { clipboard }
  );

  return {
    field, status, clipboard, scroll, browserWindow,
    choose: (lane) => document.querySelector(`.switch button[data-lane="${lane}"]`).click(),
    openCard: (lane) => document.querySelector(`.text-button[data-lane="${lane}"]`).click(),
    copy: () => { copy.click(); return lastCopy; },
    selectedLanes: () => Array.from(document.querySelectorAll('.switch button'))
      .filter((button) => button.getAttribute('aria-pressed') === 'true')
      .map((button) => button.dataset.lane)
  };
}

afterEach(() => {
  jest.restoreAllMocks();
  document.body.innerHTML = '';
  window.localStorage.clear();
});

describe('Launchpad exercise journey', () => {
  it('keeps independent notes while switching both audience paths and restores the matching guidance', () => {
    const fixture = mountExercises();
    fixture.field.value = 'Explore project coordination';
    fixture.status.textContent = 'A previous copy result';

    fixture.choose('life');

    expect(fixture.field.value).toBe('');
    expect(fixture.selectedLanes()).toEqual(['life']);
    expect(document.querySelector('#exercise-title').textContent).toBe('Leave yourself a next-action note.');
    expect(fixture.field.labels[0].textContent).toBe('When I return, my next action will be:');
    expect(document.querySelector('#exercise-continuation').textContent).toContain('page 8');
    expect(document.querySelector('#exercise-next-link').getAttribute('href')).toBe('#starter-kit');
    expect(document.querySelector('#exercise-kit-link').hidden).toBe(true);
    expect(fixture.status.textContent).toBe('');
    fixture.field.value = 'Draft the project update';

    fixture.choose('work');

    expect(fixture.field.value).toBe('Explore project coordination');
    expect(fixture.selectedLanes()).toEqual(['work']);
    expect(document.querySelector('#exercise-title').textContent).toBe('Choose one role to explore this week.');
    expect(fixture.field.labels[0].textContent).toBe('One role I want to understand better:');
    expect(document.querySelector('#exercise-continuation').textContent).toContain('page 3');
    expect(document.querySelector('#exercise-continuation').textContent).toContain('page 4');
    expect(document.querySelector('#exercise-next-link').getAttribute('href')).toBe('#where-to-look');
    expect(document.querySelector('#exercise-kit-link').hidden).toBe(false);

    fixture.choose('life');

    expect(fixture.field.value).toBe('Draft the project update');
    expect(fixture.selectedLanes()).toEqual(['life']);
  });

  it.each([
    ['work', false, 'smooth'],
    ['life', true, 'instant']
  ])('opens the %s card exercise and respects reduced motion=%s', (lane, reducedMotion, behavior) => {
    const fixture = mountExercises({ reducedMotion });

    fixture.openCard(lane);

    expect(fixture.selectedLanes()).toEqual([lane]);
    expect(fixture.browserWindow.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(fixture.scroll).toHaveBeenCalledWith({ behavior });
  });

  it('focuses the empty note with useful feedback instead of copying whitespace', async () => {
    const fixture = mountExercises();
    fixture.field.value = ' \n ';

    await fixture.copy();

    expect(fixture.clipboard.writeText).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(fixture.field);
    expect(fixture.status.textContent).toBe('Write a note to copy, or use the next-step links below.');
  });

  it.each([
    ['work', 'One role I want to understand better:', 'project coordinator'],
    ['life', 'When I return, my next action will be:', 'draft the update']
  ])('copies the %s prompt and current note without changing the typed content', async (lane, prompt, note) => {
    const fixture = mountExercises();
    fixture.choose(lane);
    fixture.field.value = `  ${note}  `;

    await fixture.copy();

    expect(fixture.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(fixture.clipboard.writeText).toHaveBeenCalledWith(`${prompt} ${note}`);
    expect(fixture.field.value).toBe(`  ${note}  `);
    expect(fixture.status.textContent).toBe('Copied. Paste it into your notes app, then use the next-step links below.');
    expect(document.querySelector('#note-storage').textContent).toBe('Your note stays on this page and clears when you refresh.');
    expect(fixture.scroll).not.toHaveBeenCalled();
  });

  it.each(['unavailable', 'denied'])('retains and selects the note for manual copying when clipboard access is %s', async (failure) => {
    const clipboard = failure === 'unavailable' ? undefined : {
      writeText: jest.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError'))
    };
    const fixture = mountExercises({ clipboard });
    fixture.choose('life');
    const note = 'Draft the update\nCheck tomorrow’s calendar';
    fixture.field.value = note;

    await fixture.copy();

    expect(fixture.field.value).toBe(note);
    expect(document.activeElement).toBe(fixture.field);
    expect(fixture.field.selectionStart).toBe(0);
    expect(fixture.field.selectionEnd).toBe(note.length);
    expect(fixture.status.textContent).toBe('Use your device’s copy command, or continue with the next-step links below.');
  });

  it('clears transient notes on a fresh page without changing unrelated persisted data', () => {
    window.localStorage.setItem('remotemom:launchpad-leads', '[{"legacy":"preserve"}]');
    const storageBefore = window.localStorage.getItem('remotemom:launchpad-leads');
    const fixture = mountExercises();
    fixture.field.value = 'First note';
    fixture.choose('life');
    fixture.field.value = 'Second note';

    const freshPage = mountExercises();

    expect(freshPage.field.value).toBe('');
    freshPage.choose('life');
    expect(freshPage.field.value).toBe('');
    expect(window.localStorage.getItem('remotemom:launchpad-leads')).toBe(storageBefore);
  });
});
