document.addEventListener('click', event => {
  const button = event.target.closest('[data-answer]');
  if (!button) return;
  const box = button.closest('.quiz');
  const result = box.querySelector('[data-result]');
  const expected = box.dataset.correct;
  const ok = button.dataset.answer === expected;
  result.textContent = ok ? 'Correct. Now apply it to your real workflow.' : 'Not yet. Re-read the checklist, then try again.';
  result.style.color = ok ? '#0f766e' : '#92400e';
});