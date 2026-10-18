"use strict";

function createProjectTags(project) {
  const tags = document.createElement("div");
  tags.className = "project-tags";
  for (const [key, label] of [["categories", "Category"], ["techStack", "Tech stack"]]) {
    const row = document.createElement("div");
    row.className = "project-tag-row";
    const heading = document.createElement("span");
    heading.className = "project-tag-label";
    heading.textContent = label;
    const list = document.createElement("ul");
    list.className = "project-tag-list";
    list.setAttribute("aria-label", label);
    const values = project[key]?.length ? project[key] : ["To be added"];
    for (const value of values) {
      const tag = document.createElement("li");
      tag.className = `project-tag${key === "categories" ? " project-tag--category" : ""}`;
      tag.textContent = value;
      list.append(tag);
    }
    row.append(heading, list);
    tags.append(row);
  }
  return tags;
}

function setupProjectCarousel(carousel, slides, controls, status) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timer = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let focused = false;
  let inView = !("IntersectionObserver" in window);

  function schedule() {
    clearTimeout(timer);
    timer = 0;
    const playing = !paused && !hovered && !focused && inView && !document.hidden;
    status.setAttribute("aria-live", playing ? "off" : "polite");
    if (playing) {
      timer = setTimeout(() => {
        showSlide(1);
        schedule();
      }, 5000);
    }
  }

  function showSlide(direction) {
    activeIndex = (activeIndex + direction + slides.length) % slides.length;
    slides.forEach((slide, index) => { slide.hidden = index !== activeIndex; });
    status.textContent = `${activeIndex + 1} / ${slides.length}`;
  }

  controls.hidden = false;
  status.textContent = `1 / ${slides.length}`;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.direction) showSlide(Number(button.dataset.direction));
    schedule();
  });
  carousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    hovered = true;
    schedule();
  });
  carousel.addEventListener("pointerleave", () => {
    hovered = false;
    schedule();
  });
  carousel.addEventListener("focusin", () => {
    focused = true;
    schedule();
  });
  carousel.addEventListener("focusout", (event) => {
    focused = carousel.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
    schedule();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      schedule();
    }, { threshold: 0 });
    observer.observe(carousel);
  }
  schedule();
}

const carousel = document.querySelector(".bento-card--project");

if (carousel) {
  const slideContainer = carousel.querySelector("#project-slides");
  const controls = carousel.querySelector(".carousel-controls");
  const status = carousel.querySelector(".carousel-status");

  async function loadProjects() {
    try {
      const response = await fetch("projects.json");
      if (!response.ok) {
        throw new Error(`Could not load projects.json (${response.status})`);
      }

      const projects = await response.json();
      if (!Array.isArray(projects) || projects.some((project) =>
        !project ||
        typeof project.title !== "string" ||
        typeof project.description !== "string" ||
        typeof project.thumbnail !== "string" ||
        (project.url !== undefined && (typeof project.url !== "string" ||
          !/^(https?:\/\/|[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$)/i.test(project.url))) ||
        ["categories", "techStack"].some((key) => project[key] !== undefined &&
          (!Array.isArray(project[key]) || project[key].some((tag) => typeof tag !== "string" || !tag.trim())))
      )) {
        throw new Error("Projects require title, description, and thumbnail strings; categories and techStack must be arrays of non-empty strings");
      }

      if (projects.length === 0) {
        slideContainer.innerHTML = "";
        const message = document.createElement("p");
        message.className = "project-message";
        message.textContent = "Add projects to projects.json to feature them here.";
        slideContainer.append(message);
        return;
      }

      slideContainer.innerHTML = "";
      const slides = projects.map((project, index) => {
        const slide = document.createElement("article");
        slide.className = "project-slide";
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");
        slide.setAttribute("aria-label", `${index + 1} of ${projects.length}`);

        const image = document.createElement("img");
        image.className = "project-thumbnail";
        image.src = project.thumbnail;
        image.alt = "";
        image.loading = "lazy";

        const title = document.createElement("h2");
        title.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        const caption = document.createElement("div");
        caption.className = "project-caption";
        caption.append(title, description, createProjectTags(project));
        if (project.url) {
          const link = document.createElement("a");
          link.className = "project-link";
          link.href = project.url;
          link.textContent = "View project ↗";
          link.setAttribute("aria-label", `View ${project.title}`);
          caption.append(link);
        }

        slide.append(image, caption);
        slide.hidden = index !== 0;
        slideContainer.append(slide);
        return slide;
      });

      if (slides.length > 1) {
        setupProjectCarousel(carousel, slides, controls, status);
      }
      window.ScrollTrigger?.refresh();
    } catch (error) {
      console.error("Unable to display portfolio projects:", error);
      slideContainer.innerHTML = "";
      const message = document.createElement("p");
      message.className = "project-message";
      message.setAttribute("role", "alert");
      message.textContent = "Projects could not be loaded. Check projects.json and reload the page.";
      slideContainer.append(message);
    }
  }

  loadProjects();
}

// A DOM cursor supports large SVGs without browser cursor-size limits.
const serviceCards = document.querySelectorAll(".bento-card--service[data-service]");

if (serviceCards.length) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cursor = document.createElement("div");
  cursor.className = "service-cursor";
  cursor.hidden = true;
  cursor.setAttribute("aria-hidden", "true");

  const icons = new Map();
  for (const [service, filename] of Object.entries({
    "ui-ux": "design-services.svg",
    graphic: "graphic-eq.svg",
    motion: "motion-blur.svg",
  })) {
    const image = new Image();
    image.src = `assets/cursors/${filename}`;
    image.alt = "";
    image.hidden = true;
    image.draggable = false;
    cursor.append(image);
    icons.set(service, image);
  }
  document.body.append(cursor);

  let activeCard = null;
  let frame = 0;
  let lastTime = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;

  function placeCursor() {
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  function follow(time) {
    frame = 0;
    if (!activeCard) return;
    const elapsed = Math.min(time - lastTime, 64);
    lastTime = time;
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 65);
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    if (Math.hypot(targetX - x, targetY - y) < 0.1) {
      x = targetX;
      y = targetY;
    } else {
      frame = requestAnimationFrame(follow);
    }
    placeCursor();
  }

  function hideCursor() {
    activeCard?.classList.remove("has-service-cursor");
    activeCard = null;
    cursor.hidden = true;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function trackPointer(event, card) {
    if (!finePointer.matches || event.pointerType === "touch") return;
    const image = icons.get(card.dataset.service);
    // Retain the native cursor if an asset has not loaded or failed.
    if (!image?.complete || !image.naturalWidth) return;
    targetX = event.clientX;
    targetY = event.clientY;

    if (activeCard !== card) {
      hideCursor();
      activeCard = card;
      icons.forEach((icon) => { icon.hidden = icon !== image; });
      x = targetX;
      y = targetY;
      placeCursor();
      cursor.hidden = false;
      card.classList.add("has-service-cursor");
    }

    if (reducedMotion.matches) {
      x = targetX;
      y = targetY;
      placeCursor();
    } else if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(follow);
    }
  }

  serviceCards.forEach((card) => {
    card.addEventListener("pointerenter", (event) => trackPointer(event, card));
    card.addEventListener("pointermove", (event) => trackPointer(event, card));
    card.addEventListener("pointerleave", hideCursor);
    card.addEventListener("pointercancel", hideCursor);
  });

  window.addEventListener("blur", hideCursor);
  window.addEventListener("scroll", hideCursor, { passive: true, capture: true });
  window.addEventListener("resize", hideCursor);
  document.addEventListener("visibilitychange", hideCursor);
  finePointer.addEventListener("change", hideCursor);
  reducedMotion.addEventListener("change", hideCursor);
}
