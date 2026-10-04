(function () {
  const storageKey = 'remotemom:waitlist';
  const validationStorageKey = 'remotemom:validation-survey';
  const betaFeedbackStorageKey = 'remotemom:beta-feedback';
  const blackFridayStorageKey = 'remotemom:black-friday-early-access';
  const launchpadStorageKey = 'remotemom:launchpad-leads';
  const forms = document.querySelectorAll('[data-waitlist-form]');
  const validationForm = document.querySelector('[data-validation-form]');
  const betaFeedbackForm = document.querySelector('[data-beta-feedback-form]');
  const blackFridayForm = document.querySelector('[data-black-friday-form]');
  const launchpadForm = document.querySelector('[data-launchpad-form]');

  function getSavedEntries(key) {
    const savedEntries = window.localStorage.getItem(key);

    if (!savedEntries) {
      return [];
    }

    try {
      const parsedEntries = JSON.parse(savedEntries);
      return Array.isArray(parsedEntries) ? parsedEntries : [];
    } catch {
      return [];
    }
  }

  function saveLocalBackup(key, entry) {
    const entries = getSavedEntries(key);
    window.localStorage.setItem(key, JSON.stringify([...entries, entry]));
  }

  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const signup = {
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        createdAt: new Date().toISOString()
      };
      const status = form.querySelector('.form-status');
      const submitButton = form.querySelector('button[type="submit"]');
      const waitlistEndpoint = form.dataset.endpoint || '/api/waitlist';

      if (!signup.name || !signup.email) {
        if (status) {
          status.textContent = 'Please add your name and email.';
        }

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const result = await fetch(waitlistEndpoint, {
          body: JSON.stringify(signup),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!result.ok) {
          throw new Error('Waitlist collection request failed.');
        }

        form.reset();

        if (status) {
          status.textContent = 'You are on the RemoteMom waitlist. Thank you.';
        }
      } catch {
        saveLocalBackup(storageKey, signup);

        if (status) {
          status.textContent =
            'Could not reach the waitlist endpoint. Saved as a backup on this device.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });

  if (validationForm) {
    validationForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(validationForm);
      const response = {
        childrenCount: String(formData.get('childrenCount') ?? ''),
        hardestArea: String(formData.get('hardestArea') ?? ''),
        premiumFeature: String(formData.get('premiumFeature') ?? ''),
        priceComfort: String(formData.get('priceComfort') ?? ''),
        interviewPermission: String(formData.get('interviewPermission') ?? ''),
        createdAt: new Date().toISOString()
      };
      const status = validationForm.querySelector('.form-status');
      const submitButton = validationForm.querySelector('button[type="submit"]');
      const validationEndpoint = validationForm.dataset.endpoint || '/api/validation';

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const result = await fetch(validationEndpoint, {
          body: JSON.stringify(response),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!result.ok) {
          throw new Error('Validation collection request failed.');
        }

        validationForm.reset();

        if (status) {
          status.textContent = 'Validation answers sent. Thank you for helping shape RemoteMom.';
        }
      } catch {
        saveLocalBackup(validationStorageKey, response);

        if (status) {
          status.textContent =
            'Could not reach the collection endpoint. Saved as a backup on this device.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  if (betaFeedbackForm) {
    betaFeedbackForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(betaFeedbackForm);
      const feedback = {
        bugsOrIssues: String(formData.get('bugsOrIssues') ?? '').trim(),
        confusingOrTooMuch: String(formData.get('confusingOrTooMuch') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        firstScreen: String(formData.get('firstScreen') ?? '').trim(),
        installedAndOpened: String(formData.get('installedAndOpened') ?? '').trim(),
        mostUsefulFeature: String(formData.get('mostUsefulFeature') ?? '').trim(),
        name: String(formData.get('name') ?? '').trim(),
        nextPriority: String(formData.get('nextPriority') ?? '').trim(),
        oneChildEnough: String(formData.get('oneChildEnough') ?? '').trim(),
        todayHelped: String(formData.get('todayHelped') ?? '').trim(),
        understoodPurpose: String(formData.get('understoodPurpose') ?? '').trim(),
        useAgainTomorrow: String(formData.get('useAgainTomorrow') ?? '').trim(),
        worthPayingFor: String(formData.get('worthPayingFor') ?? '').trim(),
        createdAt: new Date().toISOString()
      };
      const status = betaFeedbackForm.querySelector('.form-status');
      const submitButton = betaFeedbackForm.querySelector('button[type="submit"]');
      const betaFeedbackEndpoint = betaFeedbackForm.dataset.endpoint || '/api/beta-feedback';

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const result = await fetch(betaFeedbackEndpoint, {
          body: JSON.stringify(feedback),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!result.ok) {
          throw new Error('Beta feedback collection request failed.');
        }

        betaFeedbackForm.reset();

        if (status) {
          status.textContent = 'Feedback sent. Thank you for helping shape RemoteMom.';
        }
      } catch {
        saveLocalBackup(betaFeedbackStorageKey, feedback);

        if (status) {
          status.textContent =
            'Could not reach the feedback endpoint. Saved as a backup on this device.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  if (blackFridayForm) {
    blackFridayForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(blackFridayForm);
      const signup = {
        androidPhone: String(formData.get('androidPhone') ?? '').trim(),
        betaInterest: String(formData.get('betaInterest') ?? '').trim(),
        biggestStruggle: String(formData.get('biggestStruggle') ?? '').trim(),
        childrenCount: String(formData.get('childrenCount') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        name: String(formData.get('name') ?? '').trim(),
        createdAt: new Date().toISOString()
      };
      const status = blackFridayForm.querySelector('.form-status');
      const submitButton = blackFridayForm.querySelector('button[type="submit"]');
      const blackFridayEndpoint = blackFridayForm.dataset.endpoint || '/api/black-friday';

      if (
        !signup.name ||
        !signup.email ||
        !signup.androidPhone ||
        !signup.betaInterest ||
        !signup.biggestStruggle ||
        !signup.childrenCount
      ) {
        if (status) {
          status.textContent = 'Please complete the early-access signup.';
        }

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const result = await fetch(blackFridayEndpoint, {
          body: JSON.stringify(signup),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!result.ok) {
          throw new Error('Black Friday early-access collection request failed.');
        }

        blackFridayForm.reset();

        if (status) {
          status.textContent =
            'You are on the RemoteMom early-access list. Thank you for helping shape it.';
        }
      } catch {
        saveLocalBackup(blackFridayStorageKey, signup);

        if (status) {
          status.textContent =
            'Could not reach the early-access endpoint. Saved as a backup on this device.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  if (launchpadForm) {
    launchpadForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(launchpadForm);
      const searchParams = new URLSearchParams(window.location.search);
      const lead = {
        biggestChallenge: String(formData.get('biggestChallenge') ?? '').trim(),
        currentStage: String(formData.get('currentStage') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        name: String(formData.get('name') ?? '').trim(),
        utmCampaign: String(searchParams.get('utm_campaign') ?? '').trim().slice(0, 100),
        utmMedium: String(searchParams.get('utm_medium') ?? '').trim().slice(0, 100),
        utmSource: String(searchParams.get('utm_source') ?? '').trim().slice(0, 100),
        createdAt: new Date().toISOString()
      };
      const status = launchpadForm.querySelector('.form-status');
      const submitButton = launchpadForm.querySelector('button[type="submit"]');
      const launchpadEndpoint = launchpadForm.dataset.endpoint || '/api/launchpad-lead';

      if (!lead.name || !lead.email || !lead.currentStage || !lead.biggestChallenge) {
        if (status) {
          status.textContent =
            'Please add your name, email, current stage, and biggest challenge.';
        }

        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      if (status) {
        status.textContent = 'Sending your starter kit...';
      }

      try {
        const result = await fetch(launchpadEndpoint, {
          body: JSON.stringify(lead),
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST'
        });

        if (!result.ok) {
          throw new Error('Launchpad lead collection request failed.');
        }

        launchpadForm.reset();

        if (status) {
          status.textContent = 'Your starter kit is ready.';
        }

        window.location.assign('./download/');
      } catch {
        saveLocalBackup(launchpadStorageKey, lead);

        if (status) {
          status.textContent =
            'Could not reach the signup endpoint. Your entry was saved as a backup on this device.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }
})();
