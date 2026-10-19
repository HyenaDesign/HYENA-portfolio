"use strict";

function groupFeaturedProjects(projects) {
  const groups = { ui: [], motion: [], graphic: [] };
  for (const project of projects) {
    const categories = project.categories.join(" ");
    if (/3d|sculpture|creative development/i.test(categories)) groups.motion.push(project);
    else if (/ui\/ux|web design|front-end/i.test(categories)) groups.ui.push(project);
    else groups.graphic.push(project);
  }
  return groups;
}

function setupFeaturedCarousel(card, projects) {
  if (projects.length < 2) return;
  const image = card.querySelector(".selected-work-image img");
  const title = card.querySelector("h2");
  const description = card.querySelector(".card-content > p");
  const link = card.querySelector(".card-cta");
  const label = link.querySelector("span");
  const credit = card.querySelector(".project-credit");
  const more = card.querySelector(".project-more");
  const originalTitle = title.textContent;
  let active = Math.max(0, projects.findIndex(project => project.title === originalTitle));
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hovered = false, focused = false;
  let visible = !("IntersectionObserver" in window), timer;

  const controls = document.createElement("div");
  controls.className = "featured-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Project carousel controls");
  function button(text, name, action) {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.setAttribute("aria-label", name);
    element.addEventListener("click", action);
    return element;
  }
  const status = document.createElement("span");
  status.setAttribute("aria-atomic", "true");
  const previous = button("←", "Previous project", () => { show(-1); schedule(); });
  const next = button("→", "Next project", () => { show(1); schedule(); });
  function show(direction) {
    active = (active + direction + projects.length) % projects.length;
    const project = projects[active];
    image.src = project.thumbnail;
    image.alt = project.title;
    image.style.objectPosition = project.title === "Promptly" ? "left center" : "center";
    title.textContent = project.title;
    description.textContent = project.description;
    link.href = project.url || project.thumbnail;
    label.textContent = project.url ? "View Project" : "View Artwork";
    if (credit) credit.hidden = project.title !== originalTitle;
    status.textContent = `${active + 1} / ${projects.length}`;
    if (direction && !motion.matches && image.animate) {
      image.animate([{opacity:0.3}, {opacity:1}], {duration:300, easing:"ease-out"});
    }
  }
  function schedule() {
    clearTimeout(timer);
    const playing = !motion.matches && !hovered && !focused && visible && !document.hidden;
    status.setAttribute("aria-live", playing ? "off" : "polite");
    if (playing) timer = setTimeout(() => { show(1); schedule(); }, 5000);
  }
  controls.append(previous, status, next);
  card.querySelector(".card-content").append(controls);
  if (more) more.hidden = true;
  show(0);
  card.addEventListener("pointerenter", event => {
    if (event.pointerType === "touch") return;
    hovered = true; schedule();
  });
  card.addEventListener("pointerleave", () => { hovered = false; schedule(); });
  card.addEventListener("focusin", () => { focused = true; schedule(); });
  card.addEventListener("focusout", event => { focused = card.contains(event.relatedTarget); schedule(); });
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", schedule);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(card);
  }
  schedule();
}

async function loadFeaturedProjects() {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error("Projects unavailable");
    const projects = await response.json();
    if (!Array.isArray(projects) || projects.some(project => !project ||
      ["title", "description", "thumbnail"].some(key => typeof project[key] !== "string" || !project[key].trim()) ||
      !Array.isArray(project.categories) || project.categories.some(value => typeof value !== "string") ||
      !/^assets\/[\w /.-]+$/i.test(project.thumbnail) ||
      (project.url !== undefined && (typeof project.url !== "string" || !/^(https?:\/\/|[\w-]+\.html(?:#[\w-]+)?$)/i.test(project.url))))) {
      throw new Error("Invalid projects");
    }
    const groups = groupFeaturedProjects(projects);
    for (const [id, group] of [["work", "ui"], ["swear", "motion"], ["graphic-work", "graphic"]]) {
      const card = document.querySelector(`#${id}`);
      if (card) setupFeaturedCarousel(card, groups[group]);
    }
  } catch (error) {
    // Keep the original three projects and their links usable if loading fails.
    console.error("Could not load project rotation:", error);
  }
}

loadFeaturedProjects();
