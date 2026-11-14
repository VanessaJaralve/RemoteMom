(function () {
  const allowedChallenges = Object.freeze([
    'choosing-the-right-role',
    'finding-legitimate-opportunities',
    'resume-or-portfolio',
    'family-compatible-schedule',
    'returning-after-career-gap'
  ]);

  const allowedCurrentStages = Object.freeze([
    'looking-for-remote-work',
    'returning-after-career-break',
    'already-working-remotely',
    'exploring-both'
  ]);

  const requiredFields = ['name', 'email', 'currentStage', 'biggestChallenge'];
  const trackingFields = ['utmSource', 'utmMedium', 'utmCampaign'];
  const requiredMessage = 'Please add your name, email, current stage, and biggest challenge.';
  const detailsMessage = 'Please check your signup details and try again.';

  function isPublicEmailSyntax(email) {
    // Practical syntax checking only; this does not verify the domain or mailbox.
    if (email.length > 254 || /\s/.test(email)) {
      return false;
    }

    const parts = email.split('@');
    if (parts.length !== 2) {
      return false;
    }

    const [local, domain] = parts;
    if (
      !local ||
      local.length > 64 ||
      !/^[A-Za-z0-9!#$%&'*+/=?^_\x60{|}~.-]+$/.test(local) ||
      local.startsWith('.') ||
      local.endsWith('.') ||
      local.includes('..')
    ) {
      return false;
    }

    const labels = domain.split('.');
    if (
      labels.length < 2 ||
      labels.some((label) => !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))
    ) {
      return false;
    }

    const lastLabel = labels[labels.length - 1];
    return /^[A-Za-z]{2,63}$/.test(lastLabel) || /^xn--[A-Za-z0-9-]+$/i.test(lastLabel);
  }

  function validateLead(lead) {
    if (
      lead === null ||
      typeof lead !== 'object' ||
      Array.isArray(lead) ||
      Object.prototype.toString.call(lead) !== '[object Object]'
    ) {
      return { field: null, error: detailsMessage };
    }

    for (const field of requiredFields) {
      if (
        !Object.prototype.hasOwnProperty.call(lead, field) ||
        typeof lead[field] !== 'string' ||
        !lead[field].trim()
      ) {
        return { field, error: requiredMessage };
      }
    }

    if (!isPublicEmailSyntax(lead.email.trim())) {
      return { field: 'email', error: 'Please enter a valid email address.' };
    }

    if (!allowedCurrentStages.includes(lead.currentStage.trim())) {
      return { field: 'currentStage', error: 'Please select your current stage.' };
    }

    if (!allowedChallenges.includes(lead.biggestChallenge.trim())) {
      return {
        field: 'biggestChallenge',
        error: 'Please select your biggest remote-work challenge.'
      };
    }

    for (const field of trackingFields) {
      if (Object.prototype.hasOwnProperty.call(lead, field) && typeof lead[field] !== 'string') {
        return { field: null, error: detailsMessage };
      }
    }

    // Do not coerce nested values into strings or pass structured input to collection.
    if (Object.values(lead).some((value) => value !== null && typeof value === 'object')) {
      return { field: null, error: detailsMessage };
    }

    return null;
  }

  const validation = { validateLead, allowedChallenges, allowedCurrentStages };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = validation;
  }
  if (typeof window !== 'undefined') {
    window.RemoteMomLaunchpadValidation = validation;
  }
})();
