declare function require(moduleName: 'fs'): {
  readFileSync: (path: string, encoding: string) => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};
declare function require(moduleName: 'vm'): {
  runInNewContext: (source: string, context: Record<string, unknown>) => unknown;
};
declare const __dirname: string;

const { readFileSync } = require('fs');
const { join } = require('path');
const { runInNewContext } = require('vm');

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
    expect(script).toContain("BLACK_FRIDAY_SHEET_NAME = 'Black Friday Early Access'");
    expect(script).toContain("LAUNCHPAD_LEADS_SHEET_NAME = 'Launchpad Leads'");
    expect(script).toContain("payload.submissionType === 'beta-feedback'");
    expect(script).toContain("payload.submissionType === 'black-friday-early-access'");
    expect(script).toContain("payload.submissionType === 'launchpad-lead'");
    expect(script).toContain('appendBetaFeedback');
    expect(script).toContain('appendBlackFridayEarlyAccess');
    expect(script).toContain('appendLaunchpadLead');
    expect(script).toContain('ensureBetaFeedbackSheet');
    expect(script).toContain('ensureBlackFridaySheet');
    expect(script).toContain('ensureLaunchpadLeadsSheet');
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
    expect(script).toContain('androidPhone');
    expect(script).toContain('biggestStruggle');
    expect(script).toContain('betaInterest');
    expect(script).toContain('biggestChallenge');
    expect(script).toContain("'Current Stage'");
    expect(script).toContain("payload.currentStage || ''");
    expect(script).toContain('legacyLaunchpadHeaders');
    expect(script).toContain('sheet.insertColumnAfter(4)');
    expect(script).toContain('utmSource');
    expect(script).toContain('utmMedium');
    expect(script).toContain('utmCampaign');
  });
});

describe('Launchpad Google Sheet routing behavior', () => {
  const headers = [
    'Received At', 'Submitted At', 'Name', 'Email', 'Current Stage', 'Biggest Challenge',
    'UTM Source', 'UTM Medium', 'UTM Campaign', 'Source', 'Raw Payload'
  ];
  const historicalChallenges = [
    'choosing-the-right-role', 'finding-legitimate-opportunities', 'resume-or-portfolio',
    'family-compatible-schedule', 'returning-after-career-gap'
  ];
  const newChallenges = [
    'work-family-boundaries', 'managing-interruptions', 'planning-workload', 'switching-between-tasks'
  ];
  const validLead = {
    submissionType: 'launchpad-lead', submittedAt: '2026-11-14T00:00:00.000Z',
    name: 'QA challenge mapping', email: 'qa+mapping@example.com',
    currentStage: 'already-working-remotely', biggestChallenge: 'family-compatible-schedule',
    utmSource: 'qa', utmMedium: 'test', utmCampaign: 'challenge-mapping'
  };

  function mountWebhook(initialRows: unknown[][] = [headers]) {
    // Execute the repository Apps Script. Only Google's storage/output services are substituted;
    // no network call or live spreadsheet access is made by this fixture.
    const rows = initialRows.map((row) => row.slice());
    const setValues = jest.fn((row: number, column: number, values: unknown[][]) => {
      values.forEach((cells, rowOffset) => {
        rows[row - 1 + rowOffset] = rows[row - 1 + rowOffset] || [];
        cells.forEach((value, columnOffset) => {
          rows[row - 1 + rowOffset][column - 1 + columnOffset] = value;
        });
      });
    });
    const sheet = {
      appendRow: jest.fn((row: unknown[]) => { rows.push(row.slice()); }),
      insertColumnAfter: jest.fn((column: number) => {
        rows.forEach((row) => row.splice(column, 0, ''));
      }),
      getRange: jest.fn((row: number, column: number, rowCount: number, columnCount: number) => ({
        getValues: () => Array.from({ length: rowCount }, (_, rowOffset) =>
          Array.from({ length: columnCount }, (_, columnOffset) =>
            rows[row - 1 + rowOffset]?.[column - 1 + columnOffset] ?? ''
          )
        ),
        setValues: (values: unknown[][]) => setValues(row, column, values)
      }))
    };
    const spreadsheet = {
      getSheetByName: jest.fn((name: string) => name === 'Launchpad Leads' ? sheet : null),
      insertSheet: jest.fn(() => sheet)
    };
    const context: any = {
      Date,
      SpreadsheetApp: { openById: jest.fn(() => spreadsheet) },
      ContentService: {
        MimeType: { JSON: 'application/json' },
        createTextOutput: (body: string) => {
          const output = {
            body, mimeType: '',
            setMimeType(mimeType: string): any { output.mimeType = mimeType; return output; }
          };
          return output;
        }
      }
    };
    runInNewContext(readFileSync(scriptPath, 'utf8'), context);
    return {
      rows, sheet, spreadsheet, setValues,
      submit: (payload: Record<string, unknown>) => context.doPost({
        postData: { contents: JSON.stringify(payload) }
      })
    };
  }

  it.each([...historicalChallenges, ...newChallenges])(
    'writes challenge %s to the existing column without changing historical rows', (biggestChallenge) => {
      const historicalRow = [
        'old received time', 'old submitted time', 'Old QA record', 'old-qa@example.com',
        'exploring-both', 'family-compatible-schedule', 'old-source', 'old-medium', 'old-campaign',
        'launchpad-starter-kit-form', '{"historical":"unchanged"}'
      ];
      const fixture = mountWebhook([headers, historicalRow]);
      const payload = { ...validLead, biggestChallenge };

      const output = fixture.submit(payload);

      expect(JSON.parse(output.body)).toEqual({ ok: true });
      expect(output.mimeType).toBe('application/json');
      expect(fixture.spreadsheet.getSheetByName).toHaveBeenCalledWith('Launchpad Leads');
      expect(fixture.spreadsheet.insertSheet).not.toHaveBeenCalled();
      expect(fixture.sheet.insertColumnAfter).not.toHaveBeenCalled();
      expect(fixture.setValues).not.toHaveBeenCalled();
      expect(fixture.rows[0]).toEqual(headers);
      expect(fixture.rows[1]).toEqual(historicalRow);
      expect(fixture.sheet.appendRow).toHaveBeenCalledTimes(1);
      expect(fixture.rows[2]).toEqual([
        expect.any(Date), payload.submittedAt, payload.name, payload.email, payload.currentStage,
        biggestChallenge, payload.utmSource, payload.utmMedium, payload.utmCampaign,
        'launchpad-starter-kit-form', JSON.stringify(payload)
      ]);
      expect(fixture.rows[2]).toHaveLength(11);
    }
  );

  it('accepts a historical payload without currentStage and keeps challenge/UTMs in their columns', () => {
    const { currentStage, ...payload } = validLead;
    const fixture = mountWebhook();

    const output = fixture.submit(payload);

    expect(JSON.parse(output.body)).toEqual({ ok: true });
    expect(fixture.rows[1]).toEqual([
      expect.any(Date), payload.submittedAt, payload.name, payload.email, '', payload.biggestChallenge,
      payload.utmSource, payload.utmMedium, payload.utmCampaign,
      'launchpad-starter-kit-form', JSON.stringify(payload)
    ]);
    expect(fixture.sheet.insertColumnAfter).not.toHaveBeenCalled();
  });

  it('inserts the stage column once for a legacy sheet without shifting historical challenge meaning', () => {
    const legacyHeaders = headers.filter((header) => header !== 'Current Stage');
    const historicalRow = [
      'old received time', 'old submitted time', 'Old QA record', 'old-qa@example.com',
      'returning-after-career-gap', 'old-source', 'old-medium', 'old-campaign',
      'launchpad-starter-kit-form', '{"historical":"unchanged"}'
    ];
    const fixture = mountWebhook([legacyHeaders, historicalRow]);
    const payload = { ...validLead, biggestChallenge: 'switching-between-tasks' };

    fixture.submit(payload);
    fixture.submit({ ...payload, biggestChallenge: 'planning-workload' });

    expect(fixture.sheet.insertColumnAfter).toHaveBeenCalledTimes(1);
    expect(fixture.sheet.insertColumnAfter).toHaveBeenCalledWith(4);
    expect(fixture.setValues).toHaveBeenCalledTimes(1);
    expect(fixture.rows[0]).toEqual(headers);
    expect(fixture.rows[1]).toEqual([...historicalRow.slice(0, 4), '', ...historicalRow.slice(4)]);
    expect(fixture.rows[2][5]).toBe('switching-between-tasks');
    expect(fixture.rows[3][5]).toBe('planning-workload');
    expect(fixture.rows.every((row) => row.length === 11)).toBe(true);
  });
});
