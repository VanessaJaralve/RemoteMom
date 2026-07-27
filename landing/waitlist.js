(function () {
  const storageKey = 'remotemom:waitlist';
  const forms = document.querySelectorAll('[data-waitlist-form]');

  function getSavedSignups() {
    const savedSignups = window.localStorage.getItem(storageKey);

    if (!savedSignups) {
      return [];
    }

    try {
      return JSON.parse(savedSignups);
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

      const signups = getSavedSignups();
      window.localStorage.setItem(storageKey, JSON.stringify([...signups, signup]));
      form.reset();

      if (status) {
        status.textContent = 'You are on the local preview waitlist. Thank you.';
      }
    });
  });
})();
