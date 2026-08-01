# RemoteMom Validation Collection Setup

The landing page validation survey now submits to `/api/validation`.

Response sheet:
https://docs.google.com/spreadsheets/d/1RRs0PUdYNxtc0WRLbHmmVTc5PMXDxLueT0TWPk-V9PM/edit

## Required Environment Variable

Set this variable on the hosting platform before sharing the landing page publicly:

```text
VALIDATION_SUBMISSIONS_WEBHOOK_URL=<your secure webhook URL>
```

The endpoint forwards each completed validation survey as JSON to that webhook. Use
`integrations/google-apps-script/validation-webhook.gs` as the first webhook destination.

## Google Apps Script Deployment

1. Open the response sheet above.
2. Go to Extensions > Apps Script.
3. Replace the default script with `integrations/google-apps-script/validation-webhook.gs`.
4. Deploy it as a web app.
5. Set access to anyone with the link.
6. Copy the web app URL into `VALIDATION_SUBMISSIONS_WEBHOOK_URL` on the hosting platform.

## Expected Payload

```json
{
  "childrenCount": "one",
  "hardestArea": "child",
  "premiumFeature": "reminders",
  "priceComfort": "39-year",
  "interviewPermission": "yes",
  "submittedAt": "2026-08-01T00:00:00.000Z"
}
```

## Preview Behavior

If the endpoint is unavailable or the webhook is not configured, the landing page saves a local
backup in the visitor's browser under `remotemom:validation-survey`. That keeps local preview useful,
but public validation requires the webhook variable above.
