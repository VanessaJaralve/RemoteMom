declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/validation.js');

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

describe('validation collection endpoint', () => {
  const validBody = {
    childrenCount: 'one',
    hardestArea: 'child',
    premiumFeature: 'reminders',
    priceComfort: '39-year',
    interviewPermission: 'yes'
  };

  it('rejects validation submissions with missing required fields', async () => {
    const response = createResponse();

    await handler({ method: 'POST', body: { childrenCount: 'one' } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Please complete every validation question before submitting.'
    });
  });

  it('requires a configured webhook before accepting real submissions', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Validation collection is not configured yet.'
    });
  });

  it('accepts complete validation submissions when webhook collection is configured', async () => {
    const response = createResponse();
    const originalFetch = global.fetch;
    process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL = 'https://example.com/validation-webhook';
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/validation-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"childrenCount":"one"'),
        method: 'POST'
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
