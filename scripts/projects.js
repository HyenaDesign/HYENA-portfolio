const projectState = {
  projects: [],
  activeCategory: 'All'
};

const projectElements = {
  featured: document.getElementById('featured-projects'),
  grid: document.getElementById('project-grid'),
  filters: document.getElementById('project-filters')
};

function escapeHTML(value = '') {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function isExternalLink(url = '') {
  return /^https?:\/\//i.test(url);
}

function normalizeProject(project) {
  const fallbackLinks = project.link
    ? [{ label: 'View Project', url: project.link, type: 'project' }]
    : [];

  return {
    ...project,
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    tags: Array.isArray(project.tags) ? project.tags : [],
    links: Array.isArray(project.links) && project.links.length ? project.links : fallbackLinks,
    category: project.category || 'Project',
    status: project.status || '',
    featured: Boolean(project.featured)
  };
}

function renderPills(items, className) {
  if (!items.length) return '';

  return `
    <ul class="${className}" aria-label="${className.replace('project-', '').replace('-', ' ')}">
      ${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}
    </ul>
  `;
}

function renderProjectLinks(project) {
  if (!project.links.length) {
    return '<span class="project-link project-link-muted">Details coming soon</span>';
  }

  return project.links.map(link => {
    const targetAttributes = isExternalLink(link.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a class="project-link" href="${escapeHTML(link.url)}"${targetAttributes}>${escapeHTML(link.label)}</a>`;
  }).join('');
}

function renderCollaborator(project) {
  const collaborator = project.collaborator;
  const hasCollaborator = collaborator && collaborator.name && collaborator.name.trim() !== '';

  if (!hasCollaborator) return '';

  const collaboratorName = escapeHTML(collaborator.name);
  const collaboratorLink = collaborator.link ? escapeHTML(collaborator.link) : '';

  if (!collaboratorLink) {
    return `<p class="project-collaborator"><strong>Collaborator:</strong> ${collaboratorName}</p>`;
  }

  return `
    <p class="project-collaborator">
      <strong>Collaborator:</strong>
      <a href="${collaboratorLink}" target="_blank" rel="noopener noreferrer">${collaboratorName}</a>
    </p>
  `;
}

function renderProjectCard(project, variant = 'standard') {
  const isFeatured = variant === 'featured';
  const featuredLabel = project.featured ? '<span class="featured-badge">Featured</span>' : '';
  const statusLabel = project.status ? `<span class="project-status">${escapeHTML(project.status)}</span>` : '';

  return `
    <article class="project-card ${isFeatured ? 'project-card-featured' : ''}" data-category="${escapeHTML(project.category)}">
      <a class="project-media" href="${project.links[0] ? escapeHTML(project.links[0].url) : '#projects'}"${project.links[0] && isExternalLink(project.links[0].url) ? ' target="_blank" rel="noopener noreferrer"' : ''} aria-label="Open ${escapeHTML(project.title)}">
        <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} preview" loading="lazy" onerror="this.parentElement.classList.add('project-media-empty'); this.remove();">
      </a>
      <div class="project-content">
        <div class="project-meta">
          <span>${escapeHTML(project.category)}</span>
          ${statusLabel}
          ${featuredLabel}
        </div>
        <h3>${escapeHTML(project.title)}</h3>
        <p class="description">${escapeHTML(project.description)}</p>
        ${renderPills(project.technologies, 'project-tech-list')}
        ${isFeatured ? renderPills(project.tags, 'project-tag-list') : ''}
        ${renderCollaborator(project)}
        <div class="project-actions">
          ${renderProjectLinks(project)}
        </div>
      </div>
    </article>
  `;
}

function getCategories(projects) {
  return ['All', ...new Set(projects.map(project => project.category).filter(Boolean))];
}

function renderFilters(projects) {
  if (!projectElements.filters) return;

  projectElements.filters.innerHTML = getCategories(projects).map(category => {
    const isActive = category === projectState.activeCategory;
    return `
      <button class="project-filter ${isActive ? 'active' : ''}" type="button" data-category="${escapeHTML(category)}" aria-pressed="${isActive}">
        ${escapeHTML(category)}
      </button>
    `;
  }).join('');

  projectElements.filters.addEventListener('click', event => {
    const button = event.target.closest('.project-filter');
    if (!button) return;

    projectState.activeCategory = button.dataset.category;
    renderProjectGrid();
    renderFilters(projectState.projects);
  }, { once: true });
}

function renderFeaturedProjects() {
  if (!projectElements.featured) return;

  const featuredProjects = projectState.projects.filter(project => project.featured);
  projectElements.featured.innerHTML = featuredProjects.map(project => renderProjectCard(project, 'featured')).join('');
}

function renderProjectGrid() {
  if (!projectElements.grid) return;

  const visibleProjects = projectState.activeCategory === 'All'
    ? projectState.projects
    : projectState.projects.filter(project => project.category === projectState.activeCategory);

  projectElements.grid.innerHTML = visibleProjects.map(project => renderProjectCard(project)).join('');
}

async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const projects = await response.json();
    projectState.projects = projects.map(normalizeProject);

    renderFeaturedProjects();
    renderProjectGrid();
    renderFilters(projectState.projects);
  } catch (error) {
    console.error('Error loading projects:', error);

    const fallbackMessage = '<p class="projects-error">Error loading projects. Please try again later.</p>';
    if (projectElements.featured) projectElements.featured.innerHTML = fallbackMessage;
    if (projectElements.grid) projectElements.grid.innerHTML = fallbackMessage;
  }
}

loadProjects();
