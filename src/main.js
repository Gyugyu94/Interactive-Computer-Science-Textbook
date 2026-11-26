import { lessons, slideRoutes, weeks } from "./lesson.js";
import { renderVisual, setVisualStage } from "./visuals.js";

const byId = (id) => document.getElementById(id);
const article = byId("slide");
const title = byId("lesson-title");
const catalog = byId("catalog");
const catalogTitle = byId("catalog-title");
const figure = byId("lesson-figure");
const scene = byId("scene");
const extra = byId("lesson-extra");
const dialog = byId("mobile-toc");
const nextSlide = byId("next-slide");
const previousSlide = byId("previous-slide");
const nextStep = byId("next-step");
const previousStep = byId("previous-step");
const replay = byId("replay");
const previousWeek = byId("previous-week");
const nextWeek = byId("next-week");

let activeWeek = weeks[0];
let activeLesson;
let slideIndex = -1;
let stageIndex = 0;
let playing = false;
let replayTimer;

function populateWeekLinks() {
  for (const nav of document.querySelectorAll("[data-week-links]")) {
    const compact = nav.hasAttribute("data-compact");
    nav.innerHTML = `<ol>${weeks.map((week) => `
      <li><a href="${week.hash}" data-route data-week="${week.number}">
        <span class="week-link-number">${week.number}주차</span>
        ${compact ? "" : `<span>${week.title}</span>`}
      </a></li>`).join("")}</ol>`;
  }
}

function populateContents(groups) {
  let number = 0;
  const markup = groups.map((group) => `
    <div class="toc-group">
      <h3>${group.title}</h3>
      <ol>${group.slides.map((slide) => `
        <li><a href="#${slide.id}" data-route data-slide="${slide.id}">
          <span class="toc-number">${String(++number).padStart(2, "0")}</span>
          <span>${slide.name}</span>
        </a></li>`).join("")}</ol>
    </div>`).join("");

  for (const nav of document.querySelectorAll("[data-toc]")) nav.innerHTML = markup;
}

function showLessonView(visible) {
  article.hidden = !visible;
  catalog.hidden = visible;
  byId("week-sidebar").hidden = visible;
  byId("slide-sidebar").hidden = !visible;
  byId("sidebar").setAttribute("aria-label", visible ? "강의 목차" : "커리큘럼");
  byId("back-to-catalog").hidden = !visible;
  byId("keyboard-hint").hidden = !visible;
  byId("open-toc").hidden = !visible;
}

function focusHeading(heading) {
  window.scrollTo(0, 0);
  heading.focus({ preventScroll: true });
}

function renderCatalog(week, moveFocus) {
  stopReplay();
  activeLesson = undefined;
  activeWeek = week;
  showLessonView(false);
  document.title = "강의 목록 · 실행의 원리";
  byId("week-number").textContent = `${week.number}주차`;
  byId("week-title").textContent = week.title;
  byId("week-range").textContent = `Day ${week.lessons[0].day}–${week.lessons.at(-1).day}`;
  byId("week-position").textContent = `${week.number} / ${weeks.length}`;
  previousWeek.disabled = week.number === 1;
  nextWeek.disabled = week.number === weeks.length;

  for (const link of document.querySelectorAll("[data-week]")) {
    if (Number(link.dataset.week) === week.number) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }

  byId("day-list").innerHTML = week.lessons.map((lesson) => {
    const name = `
      <span class="outline-day">Day ${lesson.day}</span>
      <span class="outline-name">${lesson.title}</span>`;
    if (!lesson.slides) {
      return `<li class="day-row">${name}<span class="outline-status">준비 중</span></li>`;
    }
    return `
      <li><a class="day-row ready-day" href="#${lesson.slides[0].id}" data-route>
        ${name}
        <span class="outline-status">
          <span class="outline-slides">${lesson.slides.length}개 화면</span>
          <span class="outline-open">강의 열기 <span aria-hidden="true">→</span></span>
        </span>
      </a></li>`;
  }).join("");

  if (moveFocus) focusHeading(byId("week-title"));
}

function updateReplayButton() {
  let label = "재생";
  let icon = "▷";
  if (playing) {
    label = "재생 중지";
    icon = "Ⅱ";
  } else if (stageIndex > 0) {
    label = "다시 보기";
    icon = "↻";
  }
  byId("replay-label").textContent = label;
  byId("replay-icon").textContent = icon;
}

function stopReplay() {
  clearTimeout(replayTimer);
  playing = false;
  updateReplayButton();
}

function showStage(index, animate = false) {
  const stages = activeLesson?.slides[slideIndex]?.stages;
  if (!stages) return;
  const stage = stages[index];
  if (!stage) return;

  stageIndex = index;
  setVisualStage(scene, stage, animate);
  byId("step-label").textContent = stage.label;
  byId("step-caption").textContent = stage.caption;
  byId("figure-count").textContent = `단계 ${index + 1} / ${stages.length}`;
  previousStep.disabled = index === 0;
  nextStep.disabled = index === stages.length - 1;
  updateReplayButton();
}

function moveStage(shift) {
  const target = stageIndex + shift;
  if (!activeLesson?.slides[slideIndex]?.stages?.[target]) return;

  stopReplay();
  showStage(target, shift > 0);
}

function replayStages() {
  if (playing) {
    stopReplay();
    return;
  }

  showStage(0);
  playing = true;
  updateReplayButton();
  const lastIndex = activeLesson.slides[slideIndex].stages.length - 1;
  const advance = () => {
    showStage(stageIndex + 1, true);
    if (stageIndex === lastIndex) stopReplay();
    else replayTimer = setTimeout(advance, 2000);
  };
  replayTimer = setTimeout(advance, 1150);
}

function renderExtra(slide, followingLesson) {
  extra.hidden = !slide.note && !slide.points && !slide.questions;

  if (slide.questions) {
    extra.innerHTML = `
      <div class="questions">
        ${slide.questions.map((question, index) => `
          <details class="question">
            <summary>
              <span class="question-number">${index + 1}</span>
              <span class="question-prompt">${question.prompt}</span>
              <span class="answer-toggle" aria-hidden="true"><span class="answer-show">정답 보기</span><span class="answer-hide">접기</span><i></i></span>
            </summary>
            <div class="question-answer">
              <p>${question.answer}</p>
              <div class="answer-diagram">${question.diagram}</div>
            </div>
          </details>`).join("")}
      </div>
      ${followingLesson ? `<p class="next-lesson"><strong>Day ${followingLesson.day}</strong> ${followingLesson.title}</p>` : ""}`;
  } else if (slide.points) {
    extra.innerHTML = `<ol class="recap-list">${slide.points.map((point) => `<li>${point}</li>`).join("")}</ol>`;
  } else {
    extra.innerHTML = slide.note ? `<p class="figure-note">${slide.note}</p>` : "";
  }
}

function renderSlide({ lesson, index }, moveFocus) {
  if (activeLesson === lesson && index === slideIndex) {
    if (moveFocus) focusHeading(title);
    return;
  }

  stopReplay();
  if (activeLesson !== lesson) {
    populateContents(lesson.groups);
    byId("sidebar-day").textContent = `Day ${lesson.day}`;
    byId("sidebar-lesson-title").textContent = lesson.heading;
    byId("mobile-toc-title").textContent = `Day ${lesson.day} · ${lesson.heading}`;
  }
  activeLesson = lesson;
  activeWeek = weeks[lesson.week - 1];
  byId("back-to-catalog").href = activeWeek.hash;
  slideIndex = index;
  const slide = lesson.slides[index];
  const position = `${index + 1} / ${lesson.slides.length}`;
  const followingSlide = lesson.slides[index + 1];
  const followingLesson = lessons.find((item) => item.day === lesson.day + 1);
  showLessonView(true);

  title.textContent = slide.title;
  byId("lesson-section").textContent = slide.section;
  byId("lesson-description").textContent = slide.description;
  document.title = `${slide.title} · 실행의 원리`;

  figure.hidden = !slide.visual;
  if (slide.visual) {
    byId("figure-title").textContent = slide.figureTitle;
    byId("figure-count").hidden = slide.stages.length === 1;
    byId("figure-footer").hidden = slide.stages.length === 1;
    scene.dataset.visual = slide.visual;
    scene.innerHTML = renderVisual(slide.visual);
    showStage(0);
  }
  renderExtra(slide, followingLesson);

  previousSlide.disabled = index === 0;
  const followingLessonStart = followingLesson?.slides?.[0];
  if (followingSlide) {
    nextSlide.firstChild.textContent = "다음 화면 ";
    nextSlide.href = `#${followingSlide.id}`;
  } else if (followingLessonStart) {
    nextSlide.firstChild.textContent = "다음 강의 ";
    nextSlide.href = `#${followingLessonStart.id}`;
  } else {
    nextSlide.firstChild.textContent = "강의 목록 ";
    nextSlide.href = activeWeek.hash;
  }
  byId("slide-count").textContent = position;

  for (const progress of document.querySelectorAll("[data-progress]")) {
    progress.max = lesson.slides.length;
    progress.value = index + 1;
  }
  for (const count of document.querySelectorAll("[data-position]")) count.textContent = position;
  for (const link of document.querySelectorAll("[data-slide]")) {
    if (link.dataset.slide === slide.id) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  }

  if (moveFocus) focusHeading(title);
}

function renderRoute(moveFocus = false) {
  if (dialog.open) dialog.close();
  const hash = window.location.hash;
  const route = slideRoutes.get(hash);
  if (route) renderSlide(route, moveFocus);
  else renderCatalog(weeks.find((week) => week.hash === hash) ?? weeks[0], moveFocus);
}

function goTo(hash) {
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  renderRoute(true);
}

function goToSlide(index) {
  const slide = activeLesson?.slides[index];
  if (slide) goTo(`#${slide.id}`);
}

for (const [button, shift] of [[previousStep, -1], [nextStep, 1]]) {
  button.addEventListener("click", () => moveStage(shift));
}
replay.addEventListener("click", replayStages);
previousSlide.addEventListener("click", () => goToSlide(slideIndex - 1));
previousWeek.addEventListener("click", () => goTo(weeks[activeWeek.number - 2].hash));
nextWeek.addEventListener("click", () => goTo(weeks[activeWeek.number].hash));

document.addEventListener("click", (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const link = event.target instanceof Element && event.target.closest("a[data-route]");
  if (!link) return;
  event.preventDefault();
  goTo(link.hash);
});

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  focusHeading(activeLesson ? title : catalogTitle);
});

byId("open-toc").addEventListener("click", () => {
  stopReplay();
  dialog.showModal();
  dialog.querySelector('[aria-current="step"]').focus();
});
byId("close-toc").addEventListener("click", () => dialog.close());
window.matchMedia("(max-width: 850px)").addEventListener("change", (event) => {
  if (!event.matches && dialog.open) dialog.close();
});

window.addEventListener("hashchange", () => {
  renderRoute(true);
});

const arrowShift = { ArrowLeft: -1, ArrowRight: 1 };

function acceptsLessonShortcut(event) {
  if (!activeLesson || event.defaultPrevented || dialog.open || event.isComposing) return false;
  if (event.altKey || event.ctrlKey || event.metaKey) return false;
  const target = event.target instanceof Element ? event.target : document.activeElement;
  return !target?.closest("input, textarea, select, [contenteditable]");
}

window.addEventListener("keydown", (event) => {
  if (!event.shiftKey || !acceptsLessonShortcut(event)) return;
  const shift = arrowShift[event.key];
  if (!shift) return;
  const stages = activeLesson.slides[slideIndex].stages;
  if (!stages || stages.length < 2) return;
  event.preventDefault();
  event.stopPropagation();
  moveStage(shift);
}, { capture: true });

window.addEventListener("keydown", (event) => {
  if (event.shiftKey || !acceptsLessonShortcut(event)) return;
  const shift = arrowShift[event.key];
  if (!shift || !activeLesson.slides[slideIndex + shift]) return;
  event.preventDefault();
  goToSlide(slideIndex + shift);
});

byId("catalog-length").textContent = `${weeks.length}주 · ${lessons.length}일`;
populateWeekLinks();
renderRoute();
