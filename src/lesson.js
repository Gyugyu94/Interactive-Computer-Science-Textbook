import { curriculum } from "./curriculum.js";
import dayOne from "./lessons/day-1.js";

export const lessonContents = [dayOne];
const contentByDay = new Map(lessonContents.map((content) => [content.day, content]));

let lastDay = 0;
export const weeks = curriculum.map(({ title, days }, index) => {
  const number = index + 1;
  const lessons = days.map((title) => {
    const day = ++lastDay;
    const content = contentByDay.get(day);
    const lesson = { day, title, week: number };
    if (!content) return lesson;

    const slides = content.groups.flatMap((group) =>
      group.slides.map((slide) => ({ ...slide, section: group.title })),
    );
    return { ...lesson, heading: content.heading ?? title, groups: content.groups, slides };
  });
  return { number, title, hash: `#week-${number}`, lessons };
});

export const lessons = weeks.flatMap((week) => week.lessons);
export const slideRoutes = new Map(lessons.flatMap((lesson) =>
  lesson.slides?.map((slide, index) => [`#${slide.id}`, { lesson, index }]) ?? [],
));
