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

      container.innerHTML = projects.map(project => {
        // Check if collaborator exists and has content
        const hasCollaborator = project.collaborator && 
                               project.collaborator.name && 
                               project.collaborator.name.trim() !== '';
        
        const collaboratorHTML = hasCollaborator 
          ? `<p class="collaborator"><strong>Collaborator:</strong> <a href="${project.collaborator.link}" target="_blank" rel="noopener noreferrer">${project.collaborator.name}</a></p>`
          : '';
        
        return `
          <div class="project-card">
            <img src="${project.image}" alt="${project.title}" onerror="this.style.display='none'">
            <div class="project-content">
              <h3>${project.title}</h3>
              <p class="description">${project.description}</p>
              <p class="technologies"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
              ${collaboratorHTML}
              <a href="${project.link}" target="_blank" rel="noopener noreferrer">View Project</a>
            </div>
          </div>
        `;
      }).join('');

      // Initialize enhanced scrolling after content is loaded
      initializeEnhancedScrolling(container);
    } catch (error) {
      console.error('Error loading projects:', error);
      const container = document.getElementById('project-carousel');
      if (container) {
        container.innerHTML = '<p style="color: var(--orange); text-align: center;">Error loading projects. Please try again later.</p>';
      }
    }
  }

  // Enhanced scrolling functionality
  function initializeEnhancedScrolling(container) {
    let isScrolling = false;
    let scrollTimeout;

    // Add smooth momentum scrolling
    container.addEventListener('scroll', () => {
      isScrolling = true;
      
      // Clear timeout and set new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);

      // Add visual feedback during scroll
      container.style.background = 'linear-gradient(90deg, rgba(206, 79, 10, 0.05) 0%, transparent 50%, rgba(206, 79, 10, 0.05) 100%)';
    });

    // Remove visual feedback when scrolling stops
    container.addEventListener('scrollend', () => {
      container.style.background = 'none';
    });

    // Enhanced keyboard navigation
    container.addEventListener('keydown', (e) => {
      const cardWidth = 340; // card width + gap
      const currentScroll = container.scrollLeft;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          container.scrollTo({
            left: currentScroll - cardWidth,
            behavior: 'smooth'
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          container.scrollTo({
            left: currentScroll + cardWidth,
            behavior: 'smooth'
          });
          break;
        case 'Home':
          e.preventDefault();
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          break;
        case 'End':
          e.preventDefault();
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth'
          });
          break;
      }
    });

    // Make container focusable for keyboard navigation
    container.setAttribute('tabindex', '0');
    
    // Add visual focus indicator
    container.addEventListener('focus', () => {
      container.style.outline = '2px solid rgba(206, 79, 10, 0.5)';
      container.style.outlineOffset = '4px';
    });
    
    container.addEventListener('blur', () => {
      container.style.outline = 'none';
    });

    // Auto-scroll disabled to prevent unwanted page scrolling
    // setTimeout(() => {
    //   const firstCard = container.querySelector('.project-card');
    //   if (firstCard) {
    //     firstCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    //   }
    // }, 100);
  }

  // Load projects when the script runs
  loadProjects();