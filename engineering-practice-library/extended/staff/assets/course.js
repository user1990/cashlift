function answer(button) {
  const group = button.closest('[data-question]');
  const choices = group.querySelectorAll('.choice');
  const feedback = group.querySelector('.feedback');
  choices.forEach((choice) => {
    choice.disabled = true;
    if (choice.dataset.correct === 'true') choice.classList.add('correct');
  });
  button.classList.add(button.dataset.correct === 'true' ? 'correct' : 'wrong');
  feedback.innerHTML = button.dataset.correct === 'true'
    ? `<strong>Correct.</strong> ${group.dataset.correctFeedback}`
    : `<strong>Not yet.</strong> ${group.dataset.wrongFeedback}`;
  feedback.classList.add('show');
}

function resetQuestion(button) {
  const group = button.closest('[data-question]');
  group.querySelectorAll('.choice').forEach((choice) => {
    choice.disabled = false;
    choice.classList.remove('correct', 'wrong');
  });
  group.querySelector('.feedback').classList.remove('show');
}

function revealModel(button) {
  const panel = button.parentElement.querySelector('.feedback');
  panel.classList.toggle('show');
}

function calculateScore() {
  let total = 0;
  document.querySelectorAll('[data-score]').forEach((input) => {
    const max = Number(input.max);
    const value = Math.max(0, Math.min(max, Number(input.value) || 0));
    input.value = value;
    total += value;
  });
  const label = total >= 90 ? 'Exceptional evidence'
    : total >= 80 ? 'Strong evidence'
    : total >= 70 ? 'Good, with gaps'
    : total >= 60 ? 'Mixed evidence'
    : 'Insufficient evidence';
  document.querySelector('#total').textContent = total;
  document.querySelector('#interpretation').textContent = label;
}
