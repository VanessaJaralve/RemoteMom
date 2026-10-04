const allowedChallenges = [
  'choosing-the-right-role',
  'finding-legitimate-opportunities',
  'resume-or-portfolio',
  'family-compatible-schedule',
  'returning-after-career-gap'
];

const allowedCurrentStages = [
  'looking-for-remote-work',
  'returning-after-career-break',
  'already-working-remotely',
  'exploring-both'
];

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

function cleanTrackingValue(value) {
  return String(value || '')
    .trim()
    .slice(0, 100);
}

function normalizeLead(body) {
  const lead = parseBody(body);

  return {
    biggestChallenge: String(lead.biggestChallenge || '').trim(),
    currentStage: String(lead.currentStage || '').trim(),
    email: String(lead.email || '').trim(),
    name: String(lead.name || '').trim(),
    submissionType: 'launchpad-lead',
    submittedAt: new Date().toISOString(),
    utmCampaign: cleanTrackingValue(lead.utmCampaign),
    utmMedium: cleanTrackingValue(lead.utmMedium),
    utmSource: cleanTrackingValue(lead.utmSource)
  };
}

function isValidLead(lead) {
  return Boolean(
    lead.name &&
      lead.email &&
      lead.email.includes('@') &&
      allowedCurrentStages.includes(lead.currentStage) &&
      allowedChallenges.includes(lead.biggestChallenge)
  );
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

  const lead = normalizeLead(req.body);

  if (!isValidLead(lead)) {
    return res.status(400).json({
      error: 'Please complete the starter-kit signup before submitting.'
    });
  }

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

    if (!delivery.body || delivery.body.ok !== true) {
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
