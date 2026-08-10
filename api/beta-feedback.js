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

function normalizeFeedback(body) {
  const feedback = parseBody(body);

  return {
    bugsOrIssues: String(feedback.bugsOrIssues || '').trim(),
    confusingOrTooMuch: String(feedback.confusingOrTooMuch || '').trim(),
    email: String(feedback.email || '').trim(),
    firstScreen: String(feedback.firstScreen || '').trim(),
    installedAndOpened: String(feedback.installedAndOpened || '').trim(),
    mostUsefulFeature: String(feedback.mostUsefulFeature || '').trim(),
    name: String(feedback.name || '').trim(),
    nextPriority: String(feedback.nextPriority || '').trim(),
    oneChildEnough: String(feedback.oneChildEnough || '').trim(),
    submissionType: 'beta-feedback',
    submittedAt: new Date().toISOString(),
    todayHelped: String(feedback.todayHelped || '').trim(),
    understoodPurpose: String(feedback.understoodPurpose || '').trim(),
    useAgainTomorrow: String(feedback.useAgainTomorrow || '').trim(),
    worthPayingFor: String(feedback.worthPayingFor || '').trim()
  };
}

function isValidFeedback(feedback) {
  return Boolean(
    feedback.name &&
      feedback.email &&
      feedback.email.includes('@') &&
      feedback.installedAndOpened &&
      feedback.todayHelped &&
      feedback.mostUsefulFeature &&
      feedback.oneChildEnough &&
      feedback.nextPriority &&
      feedback.useAgainTomorrow
  );
}

async function forwardToWebhook(feedback) {
  const webhookUrl = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(feedback),
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
    return res.status(405).json({ error: 'Only POST beta feedback submissions are supported.' });
  }

  const feedback = normalizeFeedback(req.body);

  if (!isValidFeedback(feedback)) {
    return res.status(400).json({
      error: 'Please complete the required beta feedback questions before submitting.'
    });
  }

  try {
    const delivery = await forwardToWebhook(feedback);

    if (!delivery.configured) {
      return res.status(503).json({ error: 'Beta feedback collection is not configured yet.' });
    }

    if (!delivery.ok) {
      return res.status(502).json({ error: 'Beta feedback collection destination rejected the request.' });
    }

    if (!delivery.body || delivery.body.ok !== true) {
      return res
        .status(502)
        .json({ error: 'Beta feedback collection destination did not confirm the sheet write.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Beta feedback collection destination is unavailable.' });
  }
};
