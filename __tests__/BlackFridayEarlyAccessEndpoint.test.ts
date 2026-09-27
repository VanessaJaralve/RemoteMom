declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/black-friday.js');

function createResponse() {
  const response: any = {
    body: undefined,
    headers: {} as Record<string, string>,
    statusCode: 200,
    ended: false,
    end() {
      response.ended = true;
      return response;
    },
    json(body: unknown) {
      response.body = body;
      return response;
    },
    setHeader(name: string, value: string) {
      response.headers[name] = value;
      return response;
    },
    status(statusCode: number) {
      response.statusCode = statusCode;
      return response;
    }
  };

  return response;
}

describe('Black Friday early-access endpoint', () => {
  const validBody = {
    androidPhone: 'yes',
    betaInterest: 'yes',
    biggestStruggle: 'keeping-today-clear',
    childrenCount: 'two',
    email: 'vanessa@example.com',
    name: 'Vanessa'
  };

  it('rejects early-access submissions with missing required fields', async () => {
    const response = createResponse();

    await handler({ method: 'POST', body: { name: 'Vanessa' } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Please complete the early-access signup before submitting.'
    });
  });

  it('requires a configured webhook before accepting campaign submissions', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Black Friday early-access collection is not configured yet.'
    });
  });

  it('forwards a campaign-specific submission type when webhook collection is configured', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: true }),
      ok: true
    });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"submissionType":"black-friday-early-access"'),
        method: 'POST'
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"biggestStruggle":"keeping-today-clear"')
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });

  it('rejects webhook responses that did not confirm the campaign sheet write', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: false }),
      ok: true
    });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({
      error: 'Black Friday early-access destination did not confirm the sheet write.'
    });

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
