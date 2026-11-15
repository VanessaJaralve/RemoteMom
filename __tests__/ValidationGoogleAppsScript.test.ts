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

const launchpadHeaders = [
  'Received At', 'Submitted At', 'Name', 'Email', 'Current Stage', 'Biggest Challenge',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'Source', 'Raw Payload'
];
const validLead = {
  submissionType: 'launchpad-lead', submittedAt: '2026-11-14T00:00:00.000Z',
  name: 'QA challenge mapping', email: 'qa+mapping@example.com',
  currentStage: 'already-working-remotely', biggestChallenge: 'family-compatible-schedule',
  utmSource: 'qa', utmMedium: 'test', utmCampaign: 'challenge-mapping'
};
const collectionRoutes = [
  {
    submissionType: 'validation',
    sheetName: 'Responses',
    source: 'landing-validation-form',
    fields: [
      'submittedAt', 'childrenCount', 'hardestArea', 'premiumFeature', 'priceComfort',
      'interviewPermission'
    ],
    headers: [
      'Received At', 'Submitted At', 'Children Count', 'Hardest Area', 'Premium Feature',
      'Price Comfort', 'Interview Permission', 'Source', 'Raw Payload'
    ]
  },
  {
    submissionType: 'waitlist',
    sheetName: 'Waitlist',
    source: 'landing-waitlist-form',
    fields: ['submittedAt', 'name', 'email'],
    headers: ['Received At', 'Submitted At', 'Name', 'Email', 'Source', 'Raw Payload']
  },
  {
    submissionType: 'beta-feedback',
    sheetName: 'Beta Feedback',
    source: 'beta-feedback-form',
    fields: [
      'submittedAt', 'name', 'email', 'installedAndOpened', 'understoodPurpose', 'firstScreen',
      'todayHelped', 'mostUsefulFeature', 'confusingOrTooMuch', 'oneChildEnough', 'nextPriority',
      'useAgainTomorrow', 'worthPayingFor', 'bugsOrIssues'
    ],
    headers: [
      'Received At', 'Submitted At', 'Name', 'Email', 'Installed And Opened', 'Understood Purpose',
      'First Screen', 'Today Helped', 'Most Useful Feature', 'Confusing Or Too Much',
      'One Child Enough', 'Next Priority', 'Use Again Tomorrow', 'Worth Paying For',
      'Bugs Or Issues', 'Source', 'Raw Payload'
    ]
  },
  {
    submissionType: 'black-friday-early-access',
    sheetName: 'Black Friday Early Access',
    source: 'black-friday-early-access-form',
    fields: [
      'submittedAt', 'name', 'email', 'androidPhone', 'childrenCount', 'biggestStruggle',
      'betaInterest'
    ],
    headers: [
      'Received At', 'Submitted At', 'Name', 'Email', 'Android Phone', 'Children Count',
      'Biggest Struggle', 'Beta Interest', 'Source', 'Raw Payload'
    ]
  },
  {
    submissionType: 'launchpad-lead',
    sheetName: 'Launchpad Leads',
    source: 'launchpad-starter-kit-form',
    fields: [
      'submittedAt', 'name', 'email', 'currentStage', 'biggestChallenge',
      'utmSource', 'utmMedium', 'utmCampaign'
    ],
    headers: launchpadHeaders
  }
];

function mountWebhook(
  initialRows: unknown[][] = [launchpadHeaders],
  sheetName = 'Launchpad Leads'
) {
  // Execute the repository Apps Script with Google's storage/output services substituted.
  // Appended rows deliberately retain the exact service-boundary arguments. This fixture
  // does not parse apostrophes, evaluate formulas, or prove Google Sheets' stored/displayed
  // values; those require an isolated real-sheet check and deployment evidence.
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
    getSheetByName: jest.fn((name: string) => name === sheetName ? sheet : null),
    insertSheet: jest.fn(() => sheet)
  };
  const createTextOutput = jest.fn((body: string) => {
    const output = {
      body, mimeType: '',
      setMimeType(mimeType: string): any { output.mimeType = mimeType; return output; }
    };
    return output;
  });
  const context: any = {
    Date,
    SpreadsheetApp: { openById: jest.fn(() => spreadsheet) },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput
    }
  };
  runInNewContext(readFileSync(scriptPath, 'utf8'), context);
  return {
    rows, sheet, spreadsheet, setValues, createTextOutput,
    appendLiteralRow: (values: unknown[]) => context.appendLiteralRow(sheet, values),
    submit: (payload: Record<string, unknown>) => context.doPost({
      postData: { contents: JSON.stringify(payload) }
    })
  };
}

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
  const headers = launchpadHeaders;
  const historicalChallenges = [
    'choosing-the-right-role', 'finding-legitimate-opportunities', 'resume-or-portfolio',
    'family-compatible-schedule', 'returning-after-career-gap'
  ];
  const newChallenges = [
    'work-family-boundaries', 'managing-interruptions', 'planning-workload', 'switching-between-tasks'
  ];
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
        expect.any(Date), "'" + payload.submittedAt, "'" + payload.name, "'" + payload.email,
        "'" + payload.currentStage, "'" + biggestChallenge, "'" + payload.utmSource,
        "'" + payload.utmMedium, "'" + payload.utmCampaign,
        "'launchpad-starter-kit-form", "'" + JSON.stringify(payload)
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
      expect.any(Date), "'" + payload.submittedAt, "'" + payload.name, "'" + payload.email,
      '', "'" + payload.biggestChallenge, "'" + payload.utmSource, "'" + payload.utmMedium,
      "'" + payload.utmCampaign, "'launchpad-starter-kit-form", "'" + JSON.stringify(payload)
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
    expect(fixture.rows[2][5]).toBe("'switching-between-tasks");
    expect(fixture.rows[3][5]).toBe("'planning-workload");
    expect(fixture.rows.every((row) => row.length === 11)).toBe(true);
  });
});

describe('literal-text arguments at the spreadsheet service boundary', () => {
  it.each(collectionRoutes)(
    'quotes all submitted text and raw JSON in the $submissionType route without altering older rows',
    (route) => {
      const historicalRow = route.headers.map((header) => 'historical ' + header);
      const fixture = mountWebhook([route.headers, historicalRow], route.sheetName);
      const payload: Record<string, unknown> = { submissionType: route.submissionType };
      route.fields.forEach((field, index) => { payload[field] = '=1+' + (index + 1); });

      const output = fixture.submit(payload);

      expect(JSON.parse(output.body)).toEqual({ ok: true });
      expect(output.mimeType).toBe('application/json');
      expect(fixture.spreadsheet.getSheetByName).toHaveBeenCalledWith(route.sheetName);
      expect(fixture.spreadsheet.insertSheet).not.toHaveBeenCalled();
      expect(fixture.setValues).not.toHaveBeenCalled();
      expect(fixture.sheet.insertColumnAfter).not.toHaveBeenCalled();
      expect(fixture.rows.slice(0, 2)).toEqual([route.headers, historicalRow]);
      expect(fixture.sheet.appendRow).toHaveBeenCalledTimes(1);
      expect(fixture.sheet.appendRow).toHaveBeenCalledWith([
        expect.any(Date),
        ...route.fields.map((field) => "'" + payload[field]),
        "'" + route.source,
        "'" + JSON.stringify(payload)
      ]);
      expect(fixture.rows[2]).toHaveLength(route.headers.length);
    }
  );

  it.each([
    ['formula-like text', '=1+1', "'=1+1"],
    ['leading spaces', '  =1+1', "'  =1+1"],
    ['leading tab', '\t=1+1', "'\t=1+1"],
    ['leading line break', '\n=1+1', "'\n=1+1"],
    ['leading zeroes', '00123', "'00123"],
    ['scientific notation text', '1e3', "'1e3"],
    ['date-like text', '2026-11-14', "'2026-11-14"],
    ['existing quote before formula', "'=1+1", "''=1+1"],
    ['multiple apostrophes', "''note", "'''note"],
    ['apostrophe only', "'", "''"],
    ['ordinary text', 'Vanessa', "'Vanessa"],
    ['Unicode and emoji', 'José — 母 👩🏽‍💻', "'José — 母 👩🏽‍💻"],
    ['empty text', '', ''],
    ['space-only text', '  ', "'  "],
    ['leading plus', '+123', "'+123"],
    ['leading minus', '-42', "'-42"],
    ['leading at sign', '@reader', "'@reader"]
  ])('retains %s exactly after the quote marker in name and attribution arguments', (_, input, expected) => {
    const fixture = mountWebhook();
    const payload = {
      ...validLead, name: input, utmSource: input, utmMedium: input, utmCampaign: input
    };

    const output = fixture.submit(payload);

    expect(JSON.parse(output.body)).toEqual({ ok: true });
    expect(fixture.sheet.appendRow).toHaveBeenCalledTimes(1);
    const row = fixture.sheet.appendRow.mock.calls[0][0];
    expect(row).toEqual([
      expect.any(Date), "'" + payload.submittedAt, expected, "'" + payload.email,
      "'" + payload.currentStage, "'" + payload.biggestChallenge,
      expected, expected, expected, "'launchpad-starter-kit-form", "'" + JSON.stringify(payload)
    ]);
    // Inspect the encoded JSON argument, not an emulated stored/displayed spreadsheet value.
    expect(JSON.parse((row[10] as string).slice(1))).toEqual(payload);
  });

  it('preserves native dates, numbers, booleans, and empty cells in one append', () => {
    const fixture = mountWebhook();
    const receivedAt = new Date('2026-11-14T10:00:00.000Z');
    const values = [receivedAt, 0, 42, -12.5, true, false, '', '00123'];

    fixture.appendLiteralRow(values);

    expect(fixture.sheet.appendRow).toHaveBeenCalledTimes(1);
    expect(fixture.sheet.appendRow).toHaveBeenCalledWith([
      receivedAt, 0, 42, -12.5, true, false, '', "'00123"
    ]);
    expect(fixture.sheet.appendRow.mock.calls[0][0][0]).toBe(receivedAt);
    expect(values).toEqual([receivedAt, 0, 42, -12.5, true, false, '', '00123']);
  });

  it.each(collectionRoutes)(
    'keeps the existing missing and falsy-field defaults in the $submissionType route',
    (route) => {
      const fixture = mountWebhook([route.headers], route.sheetName);
      const payload: Record<string, unknown> = {
        submissionType: route.submissionType,
        [route.fields[0]]: 0,
        [route.fields[1]]: false,
        [route.fields[2]]: null
      };

      const output = fixture.submit(payload);

      expect(JSON.parse(output.body)).toEqual({ ok: true });
      expect(fixture.sheet.appendRow).toHaveBeenCalledWith([
        expect.any(Date),
        ...route.fields.map(() => ''),
        "'" + route.source,
        "'" + JSON.stringify(payload)
      ]);
    }
  );

  describe.each(collectionRoutes)('$submissionType failure behavior', (route) => {
    it.each([
      ['object', { privateValue: 'PRIVATE TEST VALUE =1+1' }],
      ['array', ['PRIVATE TEST VALUE =1+1']]
    ])('rejects a late %s field before appending any submission row', (_, invalidValue) => {
      const fixture = mountWebhook([route.headers], route.sheetName);
      const payload: Record<string, unknown> = { submissionType: route.submissionType };
      route.fields.forEach((field) => { payload[field] = 'valid preceding text'; });
      payload[route.fields[route.fields.length - 1]] = invalidValue;
      let failure: unknown;

      try {
        fixture.submit(payload);
      } catch (error) {
        failure = error;
      }

      expect(failure).toBeDefined();
      expect(String(failure)).not.toContain('PRIVATE TEST VALUE');
      expect(fixture.sheet.appendRow).not.toHaveBeenCalled();
      expect(fixture.createTextOutput).not.toHaveBeenCalled();
      expect(fixture.rows).toEqual([route.headers]);
    });

    it('propagates an append failure instead of confirming collection', () => {
      const fixture = mountWebhook([route.headers], route.sheetName);
      const storageError = new Error('Spreadsheet temporarily unavailable');
      fixture.sheet.appendRow.mockImplementation(() => { throw storageError; });

      expect(() => fixture.submit({ submissionType: route.submissionType })).toThrow(storageError);

      expect(fixture.sheet.appendRow).toHaveBeenCalledTimes(1);
      expect(fixture.createTextOutput).not.toHaveBeenCalled();
      expect(fixture.rows).toEqual([route.headers]);
    });
  });
});
