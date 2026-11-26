import assert from "node:assert/strict";
import { lessonContents, lessons, slideRoutes, weeks } from "../src/lesson.js";
import { renderVisual } from "../src/visuals.js";

assert.equal(weeks.length, 8);
assert.ok(weeks.every((week) => week.lessons.length === 7));
assert.ok(lessons.every((lesson, index) => lesson.day === index + 1 && lesson.title.length));

const publishedLessons = lessons.filter((lesson) => lesson.slides);
assert.equal(publishedLessons.length, lessonContents.length);
assert.ok(publishedLessons.every((lesson) => lesson.slides.length > 0));
assert.equal(lessons[0].slides.length, 12);
assert.equal(lessons[0].slides.at(-1).questions.length, 5);

const slides = publishedLessons.flatMap((lesson) => lesson.slides);
assert.equal(slideRoutes.size, slides.length);

for (const slide of slides) {
  assert.ok(slide.title && slide.description, slide.id);
  if (!slide.visual) continue;

  const markup = renderVisual(slide.visual);
  const parts = new Set(Array.from(markup.matchAll(/data-part="([^"]+)"/g), (match) => match[1]));
  const values = new Set(Array.from(markup.matchAll(/data-value="([^"]+)"/g), (match) => match[1]));

  assert.ok(slide.stages.length, slide.id);
  assert.equal(new Set(slide.stages.map((stage) => stage.id)).size, slide.stages.length, slide.id);
  for (const stage of slide.stages) {
    for (const part of stage.active) assert.ok(parts.has(part), `${slide.id}: missing ${part}`);
    for (const key of Object.keys(stage.values)) assert.ok(values.has(key), `${slide.id}: missing ${key}`);
  }
}

console.log(`Checked ${weeks.length} weeks, ${lessons.length} topics, and ${slides.length} published screens with their diagram states.`);
