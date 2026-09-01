const courseKey = "ai-fundamentals-course-v1";

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

document.querySelectorAll("input[data-check-key]").forEach((box) => {
  const progress = readProgress();
  box.checked = Boolean(progress.checks?.[box.dataset.checkKey]);
  box.addEventListener("change", () => {
    const current = readProgress();
    current.checks = { ...(current.checks || {}), [box.dataset.checkKey]: box.checked };
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
  });
});

document.querySelectorAll(".course-card[data-lesson]").forEach((card) => {
  card.dataset.complete = String(Boolean(readProgress().lessons?.[card.dataset.lesson]));
});

function renderLibraryProgress() {
  const progress = readProgress();
  const completed = Object.values(progress.lessons || {}).filter(Boolean).length;

  document.querySelectorAll("[data-progress-label]").forEach((label) => {
    label.textContent = `${completed} / 7`;
  });
  document.querySelectorAll("[data-progress-summary]").forEach((summary) => {
    summary.textContent = `${completed} of 7 complete`;
  });
  document.querySelectorAll("[data-progress-value]").forEach((bar) => {
    bar.style.width = `${(completed / 7) * 100}%`;
  });

  document.querySelectorAll("[data-course]").forEach((card) => {
    const lessons = (card.dataset.courseLessons || "").split(",").filter(Boolean);
    const courseCompleted = lessons.filter((lesson) => progress.lessons?.[lesson]).length;
    const label = card.querySelector(".course-progress-label");
    const bar = card.querySelector(".course-progress-fill");
    if (label) label.textContent = `${courseCompleted} / ${lessons.length} lessons`;
    if (bar) bar.style.width = `${lessons.length ? (courseCompleted / lessons.length) * 100 : 0}%`;
  });

  document.querySelectorAll(".lesson-row[data-lesson]").forEach((row) => {
    row.dataset.complete = String(Boolean(progress.lessons?.[row.dataset.lesson]));
  });
}

renderLibraryProgress();

document.querySelectorAll("[data-crap-calculator]").forEach((calculator) => {
  const complexity = calculator.querySelector("[data-complexity]");
  const coverage = calculator.querySelector("[data-coverage]");
  const complexityValue = calculator.querySelector("[data-complexity-value]");
  const coverageValue = calculator.querySelector("[data-coverage-value]");
  const score = calculator.querySelector("[data-score]");
  const status = calculator.querySelector("[data-status]");

  const render = () => {
    const comp = Number(complexity.value);
    const cov = Number(coverage.value) / 100;
    const result = (comp ** 2) * ((1 - cov) ** 3) + comp;
    complexityValue.textContent = String(comp);
    coverageValue.textContent = `${coverage.value}%`;
    score.textContent = result.toFixed(1);
    status.textContent = result > 30
      ? "Above the original CRAP1 warning threshold"
      : "Below the original CRAP1 warning threshold";
  };
  complexity.addEventListener("input", render);
  coverage.addEventListener("input", render);
  render();
});

document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});
