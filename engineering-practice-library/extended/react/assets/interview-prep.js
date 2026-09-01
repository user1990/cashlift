const languageButtons = document.querySelectorAll('[data-language]');
const lessonVersions = { en: document.querySelector('#lesson-en'), lt: document.querySelector('#lesson-lt') };

function setLanguage(language) {
  Object.entries(lessonVersions).forEach(([key, element]) => { element.hidden = key !== language; });
  languageButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  document.documentElement.lang = language === 'lt' ? 'lt' : 'en';
  document.title = language === 'lt' ? 'Vidurinio lygio React interviu: naudingi atsakymai' : 'Mid-level React interviews: the useful answers';
  localStorage.setItem('react-interview-language', language);
}

languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
setLanguage(localStorage.getItem('react-interview-language') === 'lt' ? 'lt' : 'en');

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-answer]');
  if (!button) return;
  const feedback = button.closest('.quiz').querySelector('.feedback');
  const correct = button.dataset.answer === 'correct';
  const lithuanian = document.documentElement.lang === 'lt';
  feedback.textContent = correct
    ? (lithuanian ? 'Teisingai — pradėk nuo įrodymų, tik tada siaurink priežastį ir optimizuok.' : 'Correct — start with evidence, then narrow the cause before optimizing.')
    : (lithuanian ? 'Ne visai — memoizacija gali padėti, bet tai nėra pirmas diagnostikos žingsnis.' : 'Not quite — memoization is a possible remedy, but it is not the first diagnostic step.');
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
});
