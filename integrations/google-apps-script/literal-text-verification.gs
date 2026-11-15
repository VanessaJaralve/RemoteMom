/**
 * Manual, isolated verification for issue #23. Add this file beside the reviewed
 * validation-webhook.gs candidate and run verifyLiteralTextInIsolatedSpreadsheet
 * from the Apps Script editor. Production never invokes this function.
 *
 * Each run creates a new QA-only workbook in the executing account and never
 * shares it, opens an existing workbook, calls the production entry point, sends
 * network requests, or deletes data. Retain the workbook as verification evidence.
 * Only the QA workbook identity and aggregate results are logged or returned.
 */
function verifyLiteralTextInIsolatedSpreadsheet() {
  const workbook = SpreadsheetApp.create(
    'QA ONLY - RemoteMom issue23 literal text - ' + new Date().toISOString()
  );
  const summary = {
    status: 'running',
    workbookId: workbook.getId(),
    workbookUrl: workbook.getUrl(),
    rowChecks: 0,
    cellChecks: 0,
    stringCellsChecked: 0,
    formulaCellsChecked: 0,
    routeChecks: 0,
    rejectedValueCases: 0
  };
  let currentCheck = 'initialization';

  function assert(condition) {
    if (!condition) {
      throw new Error('Isolated verification assertion failed');
    }
  }

  function verifyRow(sheet, rowNumber, expected, label, receivedWindow) {
    currentCheck = label;
    SpreadsheetApp.flush();
    const range = sheet.getRange(rowNumber, 1, 1, expected.length);
    const observed = range.getValues()[0];
    const formulas = range.getFormulas()[0];
    assert(observed.length === expected.length && formulas.length === expected.length);

    expected.forEach(function (value, index) {
      const actual = observed[index];
      if (index === 0 && receivedWindow) {
        // Route functions generate their own timestamp. Check its native type and
        // bounded creation time; the direct/helper fixture checks an exact Date.
        assert(actual instanceof Date && isFinite(actual.getTime()));
        assert(actual.getTime() >= receivedWindow[0] - 1000);
        assert(actual.getTime() <= receivedWindow[1] + 1000);
      } else if (value instanceof Date) {
        assert(actual instanceof Date && actual.getTime() === value.getTime());
      } else {
        assert(typeof actual === typeof value && actual === value);
      }

      assert(formulas[index] === '');
      summary.cellChecks += 1;
      summary.formulaCellsChecked += 1;
      if (typeof value === 'string') {
        summary.stringCellsChecked += 1;
      }
    });
    summary.rowChecks += 1;
  }

  function verifyRoute(append, sheetName, payload, fields, source, label) {
    currentCheck = label;
    const before = Date.now();
    const response = append(workbook, payload);
    SpreadsheetApp.flush();
    const after = Date.now();
    assert(response.getContent() === JSON.stringify({ ok: true }));
    const sheet = workbook.getSheetByName(sheetName);
    assert(sheet !== null);
    const expected = [null].concat(fields.map(function (field) {
      return payload[field] || '';
    }), [source, JSON.stringify(payload)]);
    verifyRow(sheet, sheet.getLastRow(), expected, label, [before, after]);
    summary.routeChecks += 1;
  }

  try {
    const literalStrings = [
      '=1+1', '=SUM(1,2)', '+123', '-123', '@sample', '00123', '2026-11-14',
      "'Vanessa", "''Vanessa", '  =1+1', '\t=1+1', '\n=1+1',
      'José — 妈妈 👩‍💻', 'ordinary text', '', '  ordinary text  ', "'", "''"
    ];
    // Zero milliseconds avoids spreadsheet date-serial rounding ambiguity.
    const fixedDate = new Date('2026-11-14T00:00:00.000Z');
    const helperValues = [fixedDate].concat(literalStrings, [23.5, 0, -7, true, false]);
    const helperSheet = workbook.getSheets()[0].setName('Literal round trips');
    helperSheet.getRange(1, 1, 1, helperValues.length).setValues([
      helperValues.map(function (_, index) { return 'Synthetic cell ' + (index + 1); })
    ]);
    currentCheck = 'direct helper round trip';
    appendLiteralRow(helperSheet, helperValues);
    verifyRow(helperSheet, 2, helperValues, currentCheck);

    [{ synthetic: '=1+1' }, ['=1+1']].forEach(function (unsupported, index) {
      currentCheck = 'unsupported cell rejection ' + (index + 1);
      SpreadsheetApp.flush();
      const beforeRows = helperSheet.getLastRow();
      let rejected = false;
      try {
        appendLiteralRow(helperSheet, [fixedDate, 'synthetic prefix', unsupported]);
      } catch (error) {
        rejected = error.message === 'Unsupported spreadsheet cell value';
      }
      SpreadsheetApp.flush();
      assert(rejected && helperSheet.getLastRow() === beforeRows);
      summary.rejectedValueCases += 1;
    });
    verifyRow(helperSheet, 2, helperValues, 'helper row preserved after rejection');

    const routes = [
      {
        append: appendValidationResponse, sheet: SHEET_NAME,
        type: 'validation', source: 'landing-validation-form',
        fields: ['submittedAt', 'childrenCount', 'hardestArea', 'premiumFeature',
          'priceComfort', 'interviewPermission']
      },
      {
        append: appendBetaFeedback, sheet: BETA_FEEDBACK_SHEET_NAME,
        type: 'beta-feedback', source: 'beta-feedback-form',
        fields: ['submittedAt', 'name', 'email', 'installedAndOpened', 'understoodPurpose',
          'firstScreen', 'todayHelped', 'mostUsefulFeature', 'confusingOrTooMuch',
          'oneChildEnough', 'nextPriority', 'useAgainTomorrow', 'worthPayingFor', 'bugsOrIssues']
      },
      {
        append: appendWaitlistSignup, sheet: WAITLIST_SHEET_NAME,
        type: 'waitlist', source: 'landing-waitlist-form',
        fields: ['submittedAt', 'name', 'email']
      },
      {
        append: appendBlackFridayEarlyAccess, sheet: BLACK_FRIDAY_SHEET_NAME,
        type: 'black-friday-early-access', source: 'black-friday-early-access-form',
        fields: ['submittedAt', 'name', 'email', 'androidPhone', 'childrenCount',
          'biggestStruggle', 'betaInterest']
      }
    ];
    routes.forEach(function (route, routeIndex) {
      const payload = { submissionType: route.type };
      route.fields.forEach(function (field, fieldIndex) {
        payload[field] = literalStrings[(fieldIndex + routeIndex) % literalStrings.length];
      });
      verifyRoute(route.append, route.sheet, payload, route.fields, route.source,
        'isolated route ' + (routeIndex + 1));
    });

    const legacyHeaders = [
      'Received At', 'Submitted At', 'Name', 'Email', 'Biggest Challenge',
      'UTM Source', 'UTM Medium', 'UTM Campaign', 'Source', 'Raw Payload'
    ];
    const historicalRow = [
      fixedDate, '2026-11-01T00:00:00.000Z', 'Synthetic historical record',
      'qa+historical@example.com', 'returning-after-career-gap', 'qa', 'isolated',
      'issue23-historical-fixture', 'launchpad-starter-kit-form', '{"synthetic":true}'
    ];
    const launchpadSheet = workbook.insertSheet(LAUNCHPAD_LEADS_SHEET_NAME);
    // Trusted synthetic setup, before invoking the actual legacy migration path.
    launchpadSheet.getRange(1, 1, 2, legacyHeaders.length)
      .setValues([legacyHeaders, historicalRow]);
    SpreadsheetApp.flush();
    const originalColumnCount = launchpadSheet.getMaxColumns();
    verifyRow(launchpadSheet, 2, historicalRow, 'initial historical fixture');

    const currentHeaders = legacyHeaders.slice(0, 4)
      .concat(['Current Stage'], legacyHeaders.slice(4));
    const migratedHistoricalRow = historicalRow.slice(0, 4).concat([''], historicalRow.slice(4));
    const fields = ['submittedAt', 'name', 'email', 'currentStage', 'biggestChallenge',
      'utmSource', 'utmMedium', 'utmCampaign'];
    const challenges = [
      'choosing-the-right-role', 'finding-legitimate-opportunities', 'resume-or-portfolio',
      'family-compatible-schedule', 'returning-after-career-gap', 'work-family-boundaries',
      'managing-interruptions', 'planning-workload', 'switching-between-tasks'
    ];
    const stages = ['looking-for-remote-work', 'returning-after-career-break',
      'already-working-remotely', 'exploring-both'];

    challenges.forEach(function (challenge, index) {
      const payload = {
        submissionType: 'launchpad-lead', submittedAt: '2026-11-14T00:00:00.000Z',
        name: '=1+1', email: 'qa+literal@example.com',
        currentStage: stages[index % stages.length], biggestChallenge: challenge,
        utmSource: '  =SUM(1,2)', utmMedium: "'qa", utmCampaign: '00123'
      };
      verifyRoute(appendLaunchpadLead, LAUNCHPAD_LEADS_SHEET_NAME, payload, fields,
        'launchpad-starter-kit-form', 'Launchpad challenge ' + (index + 1));
      currentCheck = 'single legacy column insertion';
      assert(launchpadSheet.getMaxColumns() === originalColumnCount + 1);
      assert(launchpadSheet.getLastRow() === index + 3);
      assert(launchpadSheet.getLastColumn() === currentHeaders.length);
      if (index === 0) {
        verifyRow(launchpadSheet, 1, currentHeaders, 'migrated headers');
        verifyRow(launchpadSheet, 2, migratedHistoricalRow, 'migrated historical fixture');
      }
    });

    const legacyPayload = {
      submissionType: 'launchpad-lead', submittedAt: '2026-11-14T00:00:00.000Z',
      name: "''Synthetic legacy", email: 'qa+legacy@example.com',
      biggestChallenge: 'family-compatible-schedule', utmSource: '=1+1',
      utmMedium: 'isolated', utmCampaign: 'issue23-legacy-fixture'
    };
    verifyRoute(appendLaunchpadLead, LAUNCHPAD_LEADS_SHEET_NAME, legacyPayload, fields,
      'launchpad-starter-kit-form', 'legacy payload without stage');
    currentCheck = 'final legacy layout';
    assert(launchpadSheet.getMaxColumns() === originalColumnCount + 1);
    assert(launchpadSheet.getLastRow() === challenges.length + 3);
    assert(launchpadSheet.getLastColumn() === currentHeaders.length);
    verifyRow(launchpadSheet, 1, currentHeaders, 'preserved final headers');
    verifyRow(launchpadSheet, 2, migratedHistoricalRow, 'preserved historical fixture');

    summary.status = 'passed';
    Logger.log(JSON.stringify(summary));
    return summary;
  } catch (error) {
    summary.status = 'failed';
    summary.failedCheck = currentCheck;
    Logger.log(JSON.stringify(summary));
    // Do not echo service exceptions or cell values into execution logs.
    throw new Error('Isolated literal-text verification failed; inspect the retained QA workbook.');
  }
}
