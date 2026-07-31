# RemoteMom Validation Collection Setup

The landing page validation survey now submits to `/api/validation`.

## Required Environment Variable

Set this variable on the hosting platform before sharing the landing page publicly:

```text
VALIDATION_SUBMISSIONS_WEBHOOK_URL=<your secure webhook URL>
```

The endpoint forwards each completed validation survey as JSON to that webhook. A Google Apps
Script web app is a good first destination because it can append rows directly to a Google Sheet.

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
