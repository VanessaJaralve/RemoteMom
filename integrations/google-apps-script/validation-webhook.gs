const SPREADSHEET_ID = '1RRs0PUdYNxtc0WRLbHmmVTc5PMXDxLueT0TWPk-V9PM';
const SHEET_NAME = 'Responses';

function doPost(event) {
  const payload = parsePayload(event);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  if (!sheet) {
    return jsonResponse({ ok: false, error: 'Responses sheet was not found.' });
  }

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
