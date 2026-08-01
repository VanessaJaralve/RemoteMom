const allowedValues = {
  childrenCount: ['one', 'two', 'three-plus', 'expecting'],
  hardestArea: ['work', 'child', 'groceries', 'health', 'all'],
  premiumFeature: ['multiple-children', 'sharing', 'reminders', 'calendar-sync', 'cloud-backup'],
  priceComfort: ['free-only', '4.99-month', '39-year', '6.99-month', '59-year', '29-founder'],
  interviewPermission: ['yes', 'maybe', 'no']
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

function normalizeSubmission(body) {
  const submission = parseBody(body);

  return {
    childrenCount: String(submission.childrenCount || ''),
    hardestArea: String(submission.hardestArea || ''),
    premiumFeature: String(submission.premiumFeature || ''),
    priceComfort: String(submission.priceComfort || ''),
    interviewPermission: String(submission.interviewPermission || ''),
    submittedAt: new Date().toISOString()
  };
}

function isValidSubmission(submission) {
  return Object.entries(allowedValues).every(([field, values]) => values.includes(submission[field]));
}

async function forwardToWebhook(submission) {
  const webhookUrl = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(submission),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  let body = {};

  try {
    body = await response.json();
  } catch {
    body = {};
  }

  return { body, configured: true, ok: response.ok };
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST validation submissions are supported.' });
  }

  const submission = normalizeSubmission(req.body);

  if (!isValidSubmission(submission)) {
    return res.status(400).json({
      error: 'Please complete every validation question before submitting.'
    });
  }

  try {
    const delivery = await forwardToWebhook(submission);

    if (!delivery.configured) {
      return res.status(503).json({ error: 'Validation collection is not configured yet.' });
    }

    if (!delivery.ok) {
      return res.status(502).json({ error: 'Validation collection destination rejected the request.' });
    }

    if (!delivery.body || delivery.body.ok !== true) {
      return res
        .status(502)
        .json({ error: 'Validation collection destination did not confirm the sheet write.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Validation collection destination is unavailable.' });
  }
};

module.exports.allowedValues = allowedValues;
