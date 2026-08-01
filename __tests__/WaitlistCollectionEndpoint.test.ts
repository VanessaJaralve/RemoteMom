declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/waitlist.js');

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

describe('waitlist collection endpoint', () => {
  const validBody = {
    email: 'vanessa@example.com',
    name: 'Vanessa'
  };

  it('rejects waitlist submissions with missing required fields', async () => {
    const response = createResponse();

    await handler({ method: 'POST', body: { name: 'Vanessa' } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Please add your name and email before joining the waitlist.'
    });
  });

  it('requires a configured webhook before accepting real waitlist submissions', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Waitlist collection is not configured yet.'
    });
  });

  it('accepts complete waitlist submissions when webhook collection is configured', async () => {
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
        body: expect.stringContaining('"submissionType":"waitlist"'),
        method: 'POST'
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });

  it('rejects webhook responses that did not confirm the waitlist sheet write', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/remotemom-webhook';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ok: false, error: 'Waitlist sheet was not found.' }),
      ok: true
    });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({
      error: 'Waitlist collection destination did not confirm the sheet write.'
    });

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
