(function () {
  const exercises = {
    work: {
      label: 'FIND REMOTE WORK',
      title: 'Choose one role to explore this week.',
      help: 'Think of one task you’ve done in paid work, volunteering, or a personal project. Which role could use that experience?',
      prompt: 'One role I want to understand better:',
      placeholder: 'For example: project coordinator'
    },
    life: {
      label: 'MANAGE REMOTE LIFE',
      title: 'Leave yourself a next-action note.',
      help: 'Before you switch tasks, write one concrete action to return to. Start with a verb and keep it small enough to begin.',
      prompt: 'When I return, my next action will be:',
      placeholder: 'For example: draft the first paragraph of the project update'
    }
  };
  const notes = { work: '', life: '' };
  let activeLane = 'work';
  const field = document.querySelector('#reflection');
  const status = document.querySelector('#note-status');
  const defaultStatus = 'Your note stays on this page and clears when you refresh.';

  document.querySelectorAll('[data-lane]').forEach((button) => {
    button.addEventListener('click', () => {
      notes[activeLane] = field.value;
      activeLane = button.dataset.lane;
      const exercise = exercises[activeLane];

      document.querySelector('#exercise-label').textContent =
        'YOUR FIRST SMALL STEP · ' + exercise.label;
      document.querySelector('#exercise-title').textContent = exercise.title;
      document.querySelector('#exercise-help').textContent = exercise.help;
      document.querySelector('#reflection-label').textContent = exercise.prompt;
      field.placeholder = exercise.placeholder;
      field.value = notes[activeLane];
      status.textContent = defaultStatus;

      document.querySelectorAll('.switch button').forEach((choice) => {
        choice.setAttribute('aria-pressed', String(choice.dataset.lane === activeLane));
      });

      if (button.classList.contains('text-button')) {
        document.querySelector('#next-step').scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
      }
    });
  });

  document.querySelector('#copy-note').addEventListener('click', async () => {
    if (!field.value.trim()) {
      status.textContent = 'Write one small next step first.';
      field.focus();
      return;
    }

    try {
      await navigator.clipboard.writeText(exercises[activeLane].prompt + ' ' + field.value.trim());
      status.textContent = 'Copied. Paste your note somewhere useful to you.';
    } catch {
      field.focus();
      field.select();
      status.textContent = 'Select and copy your note using your device’s copy command.';
    }
  });
})();
