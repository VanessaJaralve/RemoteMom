const allowedValues = {
  androidPhone: ['yes', 'no'],
  betaInterest: ['yes', 'maybe', 'no'],
  biggestStruggle: [
    'keeping-today-clear',
    'groceries-meals',
    'child-schedule',
    'medicine-routines',
    'all-of-it'
  ],
  childrenCount: ['one', 'two', 'three-plus', 'expecting']
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

function normalizeSignup(body) {
  const signup = parseBody(body);

  return {
    androidPhone: String(signup.androidPhone || '').trim(),
    betaInterest: String(signup.betaInterest || '').trim(),
    biggestStruggle: String(signup.biggestStruggle || '').trim(),
    childrenCount: String(signup.childrenCount || '').trim(),
    email: String(signup.email || '').trim(),
    name: String(signup.name || '').trim(),
    submissionType: 'black-friday-early-access',
    submittedAt: new Date().toISOString()
  };
}

function isValidSignup(signup) {
  return Boolean(
    signup.name &&
      signup.email &&
      signup.email.includes('@') &&
      Object.entries(allowedValues).every(([field, values]) => values.includes(signup[field]))
  );
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
    return res.status(405).json({
      error: 'Only POST Black Friday early-access submissions are supported.'
    });
  }

  const signup = normalizeSignup(req.body);

  if (!isValidSignup(signup)) {
    return res.status(400).json({
      error: 'Please complete the early-access signup before submitting.'
    });
  }

  try {
    const delivery = await forwardToWebhook(signup);

    if (!delivery.configured) {
      return res.status(503).json({
        error: 'Black Friday early-access collection is not configured yet.'
      });
    }

    if (!delivery.ok) {
      return res.status(502).json({
        error: 'Black Friday early-access destination rejected the request.'
      });
    }

    if (!delivery.body || delivery.body.ok !== true) {
      return res.status(502).json({
        error: 'Black Friday early-access destination did not confirm the sheet write.'
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({
      error: 'Black Friday early-access destination is unavailable.'
    });
  }
};

module.exports.allowedValues = allowedValues;
