declare function require(moduleName: string): any;
declare const global: any;
declare const process: { env: Record<string, string | undefined> };
const handler = require('../api/launchpad-lead.js');

function createResponse() {
  const response: any = {
    body: undefined, headers: {} as Record<string, string>, statusCode: 200, ended: false,
    end() { response.ended = true; return response; },
    json(body: unknown) { response.body = body; return response; },
    setHeader(name: string, value: string) { response.headers[name] = value; return response; },
    status(statusCode: number) { response.statusCode = statusCode; return response; }
  };
  return response;
}

describe('Launchpad lead endpoint', () => {
  const validBody = {
    email: 'maria@example.com',
    biggestChallenge: 'finding-legitimate-opportunities',
    currentStage: 'looking-for-remote-work',
    name: 'Maria',
    utmCampaign: 'starter-kit-launch',
    utmMedium: 'organic-social',
    utmSource: 'instagram'
  };
  let originalFetch: any;
  let originalWebhook: string | undefined;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalWebhook = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ ok: true }), ok: true });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalWebhook === undefined) {
      delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
    } else {
      process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = originalWebhook;
    }
    jest.restoreAllMocks();
  });

  it.each([
    undefined, null, false, true, 0, 42, [], ['value'],
    '', 'not-json', '{', 'null', '[]', 'false', '42', '"value"'
  ])('rejects malformed or non-object request bodies: %p', async (body) => {
    const response = createResponse();
    await handler({ method: 'POST', body }, response);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ field: null, error: 'Please check your signup details and try again.' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  const invalidFields = ['name', 'email', 'currentStage', 'biggestChallenge'].flatMap((field) =>
    [undefined, null, '', '   ', 42, true, [], ['value'], { value: 'nested' }]
      .map((value) => [field, value])
  );
  it.each(invalidFields)('rejects invalid required field %s: %p', async (field, value) => {
    const response = createResponse();
    await handler({ method: 'POST', body: { ...validBody, [field as string]: value } }, response);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      field, error: 'Please add your name, email, current stage, and biggest challenge.'
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['email', 'maria@@example.com', 'Please enter a valid email address.'],
    ['email', 'maria@example..com', 'Please enter a valid email address.'],
    ['currentStage', 'not-approved', 'Please select your current stage.'],
    ['biggestChallenge', 'anything', 'Please select your biggest remote-work challenge.']
  ])('identifies the invalid selection or address: %s', async (field, value, error) => {
    const response = createResponse();
    await handler({ method: 'POST', body: { ...validBody, [field]: value } }, response);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ field, error });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each(['utmSource', 'utmMedium', 'utmCampaign'])('rejects non-string tracking data: %s', async (field) => {
    for (const value of [null, 3, true, [], { nested: 'value' }]) {
      const response = createResponse();
      await handler({ method: 'POST', body: { ...validBody, [field]: value } }, response);
      expect(response.statusCode).toBe(400);
      expect(response.body.field).toBe(null);
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('rejects nested fields in JSON input instead of forwarding structured values', async () => {
    const response = createResponse();
    await handler({ method: 'POST', body: JSON.stringify({ ...validBody, unexpected: { nested: 'value' } }) }, response);
    expect(response.statusCode).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  const options: Array<[string, string]> = handler.allowedCurrentStages.flatMap((currentStage: string) =>
    handler.allowedChallenges.map((biggestChallenge: string): [string, string] => [currentStage, biggestChallenge])
  );
  it.each(options)('accepts the current stage/challenge pair %s / %s', async (currentStage, biggestChallenge) => {
    const response = createResponse();
    await handler({ method: 'POST', body: { ...validBody, currentStage, biggestChallenge } }, response);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('accepts JSON object text, trims strings, bounds attribution, and generates its own timestamp', async () => {
    const response = createResponse();
    const startedAt = Date.now();
    const body = {
      ...validBody,
      name: '  Maria  ',
      email: '  Maria.Tag+Kit@Careers.Example.CO.UK  ',
      currentStage: ' already-working-remotely ',
      biggestChallenge: ' family-compatible-schedule ',
      utmSource: '  instagram  ',
      utmMedium: '  social  ',
      utmCampaign: '  ' + 'x'.repeat(105) + '  ',
      submittedAt: '1900-01-01T00:00:00.000Z',
      submissionType: 'waitlist'
    };
    await handler({ method: 'POST', body: JSON.stringify(body) }, response);
    const [destination, request] = global.fetch.mock.calls[0];
    const forwarded = JSON.parse(request.body);
    expect(response.statusCode).toBe(200);
    expect(destination).toBe('https://example.com/remotemom-webhook');
    expect(request.method).toBe('POST');
    expect(request.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(forwarded).toEqual({
      name: 'Maria',
      email: 'Maria.Tag+Kit@Careers.Example.CO.UK',
      currentStage: 'already-working-remotely',
      biggestChallenge: 'family-compatible-schedule',
      submissionType: 'launchpad-lead',
      submittedAt: expect.any(String),
      utmSource: 'instagram',
      utmMedium: 'social',
      utmCampaign: 'x'.repeat(100)
    });
    expect(Date.parse(forwarded.submittedAt)).toBeGreaterThanOrEqual(startedAt);
    expect(Date.parse(forwarded.submittedAt)).toBeLessThanOrEqual(Date.now());
  });

  it('accepts omitted tracking values without mutating the input', async () => {
    const response = createResponse();
    const body = {
      name: ' Maria ', email: ' maria@example.com ',
      currentStage: 'looking-for-remote-work', biggestChallenge: 'choosing-the-right-role'
    };
    const originalBody = { ...body };
    await handler({ method: 'POST', body }, response);
    expect(response.statusCode).toBe(200);
    expect(body).toEqual(originalBody);
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual(expect.objectContaining({
      utmSource: '', utmMedium: '', utmCampaign: ''
    }));
  });

  it('requires a configured webhook without attempting collection', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
    await handler({ method: 'POST', body: validBody }, response);
    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({ error: 'Launchpad lead collection is not configured yet.' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it.each([undefined, null, [], true, 'ok', {}, { ok: false }, { ok: 'true' }, { ok: 1 }])(
    'rejects non-confirming webhook JSON: %p', async (webhookBody) => {
      global.fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(webhookBody) });
      const response = createResponse();
      await handler({ method: 'POST', body: validBody }, response);
      expect(response.statusCode).toBe(502);
      expect(response.body).toEqual({ error: 'Launchpad lead destination did not confirm the sheet write.' });
    }
  );

  it('rejects malformed webhook JSON without reporting success', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: jest.fn().mockRejectedValue(new SyntaxError('Invalid JSON')) });
    const response = createResponse();
    await handler({ method: 'POST', body: validBody }, response);
    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: 'Launchpad lead destination did not confirm the sheet write.' });
  });

  it('rejects an HTTP failure even if the webhook body claims success', async () => {
    global.fetch.mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue({ ok: true }) });
    const response = createResponse();
    await handler({ method: 'POST', body: validBody }, response);
    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: 'Launchpad lead destination rejected the request.' });
  });

  it('handles an unavailable webhook without throwing or reporting success', async () => {
    global.fetch.mockRejectedValue(new Error('Connection unavailable'));
    const response = createResponse();
    await handler({ method: 'POST', body: validBody }, response);
    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: 'Launchpad lead destination is unavailable.' });
  });

  it('rejects unsupported methods without collection', async () => {
    const response = createResponse();
    await handler({ method: 'GET', body: validBody }, response);
    expect(response.statusCode).toBe(405);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('allows preflight without validation or collection', async () => {
    const response = createResponse();
    await handler({ method: 'OPTIONS' }, response);
    expect(response.statusCode).toBe(204);
    expect(response.ended).toBe(true);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
