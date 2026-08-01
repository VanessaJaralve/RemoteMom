const SPREADSHEET_ID = '1-uWXiAuLlIsGZ5TZ6_SVR11Vwt7CNPbvOMbcmCNAr1s';
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
