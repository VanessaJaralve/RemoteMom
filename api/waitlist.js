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

function normalizeSignup(body) {
  const signup = parseBody(body);

  return {
    email: String(signup.email || '').trim(),
    name: String(signup.name || '').trim(),
    submissionType: 'waitlist',
    submittedAt: new Date().toISOString()
  };
}

function isValidSignup(signup) {
  return Boolean(signup.name && signup.email && signup.email.includes('@'));
}

async function forwardToWebhook(signup) {
  const webhookUrl = process.env.VALIDATION_SUBMISSIONS_WEBHOOK_URL;

  if (!webhookUrl) {
    return { configured: false };
  }

  const response = await fetch(webhookUrl, {
    body: JSON.stringify(signup),
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
    return res.status(405).json({ error: 'Only POST waitlist submissions are supported.' });
  }

  const signup = normalizeSignup(req.body);

  if (!isValidSignup(signup)) {
    return res.status(400).json({
      error: 'Please add your name and email before joining the waitlist.'
    });
  }

  try {
    const delivery = await forwardToWebhook(signup);

    if (!delivery.configured) {
      return res.status(503).json({ error: 'Waitlist collection is not configured yet.' });
    }

    if (!delivery.ok) {
      return res.status(502).json({ error: 'Waitlist collection destination rejected the request.' });
    }

    if (!delivery.body || delivery.body.ok !== true) {
      return res
        .status(502)
        .json({ error: 'Waitlist collection destination did not confirm the sheet write.' });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Waitlist collection destination is unavailable.' });
  }
};
