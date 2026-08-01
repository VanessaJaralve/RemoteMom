const SPREADSHEET_ID = '1-uWXiAuLlIsGZ5TZ6_SVR11Vwt7CNPbvOMbcmCNAr1s';
const SHEET_NAME = 'Responses';
const WAITLIST_SHEET_NAME = 'Waitlist';

function doPost(event) {
  const payload = parsePayload(event);
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (payload.submissionType === 'waitlist') {
    return appendWaitlistSignup(spreadsheet, payload);
  }

  return appendValidationResponse(spreadsheet, payload);
}

function appendValidationResponse(spreadsheet, payload) {
  const sheet = ensureResponsesSheet(spreadsheet);

  sheet.appendRow([
    new Date(),
    payload.submittedAt || '',
    payload.childrenCount || '',
    payload.hardestArea || '',
    payload.premiumFeature || '',
    payload.priceComfort || '',
    payload.interviewPermission || '',
    'landing-validation-form',
    JSON.stringify(payload)
  ]);

  return jsonResponse({ ok: true });
}

function appendWaitlistSignup(spreadsheet, payload) {
  const sheet = ensureWaitlistSheet(spreadsheet);

  sheet.appendRow([
    new Date(),
    payload.submittedAt || '',
    payload.name || '',
    payload.email || '',
    'landing-waitlist-form',
    JSON.stringify(payload)
  ]);

  return jsonResponse({ ok: true });
}

function ensureResponsesSheet(spreadsheet) {
  const headers = [
    'Received At',
    'Submitted At',
    'Children Count',
    'Hardest Area',
    'Premium Feature',
    'Price Comfort',
    'Interview Permission',
    'Source',
    'Raw Payload'
  ];
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  const currentHeaders = headerRange.getValues()[0];
  const hasExpectedHeaders = headers.every(function (header, index) {
    return currentHeaders[index] === header;
  });

  if (!hasExpectedHeaders) {
    headerRange.setValues([headers]);
  }

  return sheet;
}

function ensureWaitlistSheet(spreadsheet) {
  const headers = ['Received At', 'Submitted At', 'Name', 'Email', 'Source', 'Raw Payload'];
  const sheet =
    spreadsheet.getSheetByName(WAITLIST_SHEET_NAME) || spreadsheet.insertSheet(WAITLIST_SHEET_NAME);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  const currentHeaders = headerRange.getValues()[0];
  const hasExpectedHeaders = headers.every(function (header, index) {
    return currentHeaders[index] === header;
  });

  if (!hasExpectedHeaders) {
    headerRange.setValues([headers]);
  }

  return sheet;
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    return {};
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
