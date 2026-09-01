const courseKey = "own-the-bottleneck-v1";

function readProgress() {
  try { return JSON.parse(localStorage.getItem(courseKey) || "{}"); }
  catch { return {}; }
}

function writeProgress(progress) {
  try { localStorage.setItem(courseKey, JSON.stringify(progress)); }
  catch { /* Lessons still work when storage is unavailable. */ }
}

document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  const button = quiz.querySelector("button");
  const feedback = quiz.querySelector(".feedback");
  button?.addEventListener("click", () => {
    const selected = quiz.querySelector("input:checked");
    if (!selected) {
      feedback.textContent = "Choose an answer first; retrieval requires a commitment.";
      feedback.className = "feedback incorrect";
      return;
    }
    const isCorrect = selected.value === quiz.dataset.answer;
    feedback.textContent = selected.dataset.feedback || (isCorrect ? "Correct." : "Try again.");
    feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  });
});

document.querySelectorAll("textarea[data-note-key]").forEach((field) => {
  const progress = readProgress();
  field.value = progress.notes?.[field.dataset.noteKey] || "";
  field.addEventListener("input", () => {
    const current = readProgress();
    current.notes = { ...(current.notes || {}), [field.dataset.noteKey]: field.value };
    writeProgress(current);
  });
});

document.querySelectorAll(".mark-complete[data-lesson]").forEach((button) => {
  const lesson = button.dataset.lesson;
  const render = () => {
    const done = Boolean(readProgress().lessons?.[lesson]);
    button.textContent = done ? "Lesson completed" : "Mark lesson complete";
    button.setAttribute("aria-pressed", String(done));
  };
  render();
  button.addEventListener("click", () => {
    const current = readProgress();
    current.lessons = { ...(current.lessons || {}), [lesson]: !current.lessons?.[lesson] };
    writeProgress(current);
    render();
    renderCourseProgress();
  });
});

function renderCourseProgress() {
  const progress = readProgress();
  const ids = ["ob01", "ob02", "ob03", "ob04", "ob05", "ob06", "ob07"];
  const completed = ids.filter((id) => progress.lessons?.[id]).length;
  document.querySelectorAll("[data-ob-progress-label]").forEach((label) => {
    label.textContent = `${completed} / 7`;
  });
  document.querySelectorAll("[data-ob-progress-value]").forEach((bar) => {
    bar.style.width = `${(completed / 7) * 100}%`;
  });
  document.querySelectorAll(".lesson-row[data-lesson]").forEach((row) => {
    row.dataset.complete = String(Boolean(progress.lessons?.[row.dataset.lesson]));
  });
}

renderCourseProgress();
