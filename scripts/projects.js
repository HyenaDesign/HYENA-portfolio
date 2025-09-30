  async function loadProjects() {
    try {
      const response = await fetch('projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const projects = await response.json();

      const container = document.getElementById('project-carousel');
      if (!container) {
        console.error('Project carousel container not found');
        return;
      }

      container.innerHTML = projects.map(project => `
        <div class="project-card">
          <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
          <div class="project-content">
            <h3>${project.title}</h3>
            <p class="description">${project.description}</p>
            <p class="technologies"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
            <a href="${project.link}" target="_blank" rel="noopener noreferrer">View Project</a>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading projects:', error);
      const container = document.getElementById('project-carousel');
      if (container) {
        container.innerHTML = '<p style="color: var(--orange); text-align: center;">Error loading projects. Please try again later.</p>';
      }
    }
  }

  // Load projects when the script runs
  loadProjects();