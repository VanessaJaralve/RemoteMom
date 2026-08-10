declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: string) => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};
declare const __dirname: string;

const { readFileSync } = require('fs');
const { join } = require('path');

const scriptPath = join(
  __dirname,
  '..',
  'integrations',
  'google-apps-script',
  'validation-webhook.gs'
);

describe('Google Apps Script validation webhook', () => {
  it('targets the RemoteMom validation response spreadsheet', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain("SPREADSHEET_ID = '1-uWXiAuLlIsGZ5TZ6_SVR11Vwt7CNPbvOMbcmCNAr1s'");
    expect(script).toContain("SHEET_NAME = 'Responses'");
  });

  it('accepts POST validation payloads and appends response rows', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('function doPost(event)');
    expect(script).toContain('appendValidationResponse');
    expect(script).toContain('appendWaitlistSignup');
    expect(script).toContain('appendRow');
    expect(script).toContain('ensureResponsesSheet');
    expect(script).toContain('ensureWaitlistSheet');
    expect(script).toContain("WAITLIST_SHEET_NAME = 'Waitlist'");
    expect(script).toContain("BETA_FEEDBACK_SHEET_NAME = 'Beta Feedback'");
    expect(script).toContain("payload.submissionType === 'beta-feedback'");
    expect(script).toContain('appendBetaFeedback');
    expect(script).toContain('ensureBetaFeedbackSheet');
    expect(script).toContain('insertSheet');
    expect(script).toContain('setValues');
    expect(script).toContain('childrenCount');
    expect(script).toContain('email');
    expect(script).toContain('name');
    expect(script).toContain('installedAndOpened');
    expect(script).toContain('todayHelped');
    expect(script).toContain('oneChildEnough');
    expect(script).toContain('nextPriority');
    expect(script).toContain('hardestArea');
    expect(script).toContain('premiumFeature');
    expect(script).toContain('priceComfort');
    expect(script).toContain('interviewPermission');
  });
});
