function filterQuestions() {
  const query = document.querySelector('#question-search').value.trim().toLowerCase();
  const category = document.querySelector('#category-filter').value;
  const difficulty = document.querySelector('#difficulty-filter').value;
  let shown = 0;
  document.querySelectorAll('.question-card').forEach((card) => {
    const matchesText = !query || card.textContent.toLowerCase().includes(query);
    const matchesCategory = category === 'all' || card.dataset.category === category;
    const matchesDifficulty = difficulty === 'all' || card.dataset.difficulty === difficulty;
    card.hidden = !(matchesText && matchesCategory && matchesDifficulty);
    if (!card.hidden) shown += 1;
  });
  document.querySelector('#visible-count').textContent = shown;
}

function updateProgress() {
  const checks = [...document.querySelectorAll('[data-complete]')];
  const complete = checks.filter((check) => check.checked).length;
  const percent = checks.length ? Math.round((complete / checks.length) * 100) : 0;
  document.querySelector('#progress-bar').style.width = `${percent}%`;
  document.querySelector('#progress-label').textContent = `${complete}/${checks.length}`;
  localStorage.setItem('staffFrontendPrepProgress', JSON.stringify(checks.map((check) => check.checked)));
}

function restoreProgress() {
  const checks = [...document.querySelectorAll('[data-complete]')];
  try {
    const saved = JSON.parse(localStorage.getItem('staffFrontendPrepProgress'));
    if (Array.isArray(saved)) checks.forEach((check, index) => { check.checked = Boolean(saved[index]); });
  } catch (_) {}
  updateProgress();
}

let interviewTimer;
function startTimer(seconds = 120) {
  clearInterval(interviewTimer);
  let remaining = seconds;
  const output = document.querySelector('#timer');
  const render = () => {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');
    output.textContent = `${minutes}:${secs}`;
  };
  render();
  interviewTimer = setInterval(() => {
    remaining -= 1;
    render();
    if (remaining <= 0) clearInterval(interviewTimer);
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  restoreProgress();
  document.querySelectorAll('[data-complete]').forEach((check) => check.addEventListener('change', updateProgress));
  document.querySelectorAll('#question-search, #category-filter, #difficulty-filter').forEach((control) => control.addEventListener('input', filterQuestions));
  filterQuestions();
});
