(function () {
  const storageKey = 'remotemom:waitlist';
  const validationStorageKey = 'remotemom:validation-survey';
  const forms = document.querySelectorAll('[data-waitlist-form]');
  const validationForm = document.querySelector('[data-validation-form]');

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

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const signup = {
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        createdAt: new Date().toISOString()
      };
      const status = form.querySelector('.form-status');

      if (!signup.name || !signup.email) {
        if (status) {
          status.textContent = 'Please add your name and email.';
        }

        return;
      }

      const signups = getSavedEntries(storageKey);
      window.localStorage.setItem(storageKey, JSON.stringify([...signups, signup]));
      form.reset();

      if (status) {
        status.textContent = 'You are on the local preview waitlist. Thank you.';
      }
    });
  });

  if (validationForm) {
    validationForm.addEventListener('submit', (event) => {
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
      const responses = getSavedEntries(validationStorageKey);

      window.localStorage.setItem(validationStorageKey, JSON.stringify([...responses, response]));
      validationForm.reset();

      if (status) {
        status.textContent = 'Validation answers saved locally for this preview.';
      }
    });
  }
})();
