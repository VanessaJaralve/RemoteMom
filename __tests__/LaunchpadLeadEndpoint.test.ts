declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/launchpad-lead.js');

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

describe('Launchpad lead endpoint', () => {
  const validBody = {
    email: 'maria@example.com',
    biggestChallenge: 'finding-legitimate-opportunities',
    name: 'Maria',
    utmCampaign: 'starter-kit-launch',
    utmMedium: 'organic-social',
    utmSource: 'instagram'
  };

  it('rejects incomplete or unsupported lead submissions', async () => {
    const missingResponse = createResponse();
    const invalidChallengeResponse = createResponse();

    await handler({ method: 'POST', body: { name: 'Maria' } }, missingResponse);
    await handler(
      { method: 'POST', body: { ...validBody, biggestChallenge: 'anything' } },
      invalidChallengeResponse
    );

    expect(missingResponse.statusCode).toBe(400);
    expect(invalidChallengeResponse.statusCode).toBe(400);
    expect(missingResponse.body).toEqual({
      error: 'Please complete the starter-kit signup before submitting.'
    });
  });

  it('requires a configured webhook before accepting leads', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Launchpad lead collection is not configured yet.'
    });
  });

  it('forwards normalized Launchpad leads and tracking fields', async () => {
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
        body: expect.stringContaining('"submissionType":"launchpad-lead"'),
        method: 'POST'
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"utmSource":"instagram"')
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });

  it('rejects webhook responses that do not confirm the sheet write', async () => {
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
      error: 'Launchpad lead destination did not confirm the sheet write.'
    });

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
