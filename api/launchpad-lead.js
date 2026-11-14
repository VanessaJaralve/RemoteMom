const {
  validateLead,
  allowedChallenges,
  allowedCurrentStages
} = require('../landing/launchpad/lead-validation.js');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  return body;
}

function cleanTrackingValue(value) {
  return typeof value === 'string' ? value.trim().slice(0, 100) : '';
}

function normalizeLead(lead) {
  return {
    biggestChallenge: lead.biggestChallenge.trim(),
    currentStage: lead.currentStage.trim(),
    email: lead.email.trim(),
    name: lead.name.trim(),
    submissionType: 'launchpad-lead',
    submittedAt: new Date().toISOString(),
    utmCampaign: cleanTrackingValue(lead.utmCampaign),
    utmMedium: cleanTrackingValue(lead.utmMedium),
    utmSource: cleanTrackingValue(lead.utmSource)
  };
}

async function forwardToWebhook(lead) {
  const webhookUrl = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(lead),
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
    return res.status(405).json({ error: 'Only POST Launchpad lead submissions are supported.' });
  }

  const body = parseBody(req.body);
  const validationError = validateLead(body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const lead = normalizeLead(body);
  try {
    const delivery = await forwardToWebhook(lead);

    if (!delivery.configured) {
      return res.status(503).json({
        error: 'Launchpad lead collection is not configured yet.'
      });
    }

    if (!delivery.ok) {
      return res.status(502).json({
        error: 'Launchpad lead destination rejected the request.'
      });
    }

    if (
      !delivery.body ||
      typeof delivery.body !== 'object' ||
      Array.isArray(delivery.body) ||
      delivery.body.ok !== true
    ) {
      return res.status(502).json({
        error: 'Launchpad lead destination did not confirm the sheet write.'
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({
      error: 'Launchpad lead destination is unavailable.'
    });
  }
};

module.exports.allowedChallenges = allowedChallenges;
module.exports.allowedCurrentStages = allowedCurrentStages;
