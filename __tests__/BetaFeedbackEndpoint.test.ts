declare function require(moduleName: string): any;
declare const global: any;
declare const process: {
  env: Record<string, string | undefined>;
};

const handler = require('../api/beta-feedback.js');

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

describe('beta feedback collection endpoint', () => {
  const validBody = {
    bugsOrIssues: 'No bugs found.',
    confusingOrTooMuch: 'The medicine section needed a second look.',
    email: 'tester@example.com',
    firstScreen: 'Today',
    installedAndOpened: 'yes',
    mostUsefulFeature: 'today',
    name: 'Beta Tester',
    nextPriority: 'sharing',
    oneChildEnough: 'no',
    todayHelped: 'yes',
    understoodPurpose: 'A daily view for remote working moms.',
    useAgainTomorrow: 'yes',
    worthPayingFor: 'Sharing with my partner.'
  };

  it('rejects incomplete beta feedback submissions', async () => {
    const response = createResponse();

    await handler({ method: 'POST', body: { name: 'Beta Tester' } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: 'Please complete the required beta feedback questions before submitting.'
    });
  });

  it('requires a configured webhook before accepting beta feedback', async () => {
    const response = createResponse();
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

    await handler({ method: 'POST', body: validBody }, response);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({
      error: 'Beta feedback collection is not configured yet.'
    });
  });

  it('forwards complete beta feedback with a beta-feedback submission type', async () => {
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
        body: expect.stringContaining('"submissionType":"beta-feedback"'),
        method: 'POST'
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/remotemom-webhook',
      expect.objectContaining({
        body: expect.stringContaining('"todayHelped":"yes"')
      })
    );

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });

  it('rejects webhook responses that do not confirm the beta feedback sheet write', async () => {
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
      error: 'Beta feedback collection destination did not confirm the sheet write.'
    });

    global.fetch = originalFetch;
    delete process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;
  });
});
