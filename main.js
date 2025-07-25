// Common functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', function() {
      sidebar.classList.remove('active');
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    const isMobile = window.innerWidth < 768;
    const isClickInsideSidebar = sidebar && sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle && sidebarToggle.contains(event.target);
    
    if (isMobile && sidebar && sidebar.classList.contains('active') && !isClickInsideSidebar && !isClickOnToggle) {
      sidebar.classList.remove('active');
    }
  });

  // Toast functionality
  window.showToast = function(message, type = 'success', autohide = true) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    // Generate a unique ID for the toast
    const toastId = 'toast-' + Date.now();
    
    // Create toast HTML
    const toastHtml = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" ${autohide ? 'data-bs-autohide="true"' : ''} data-bs-delay="5000">
        <div class="toast-header">
          <span class="rounded me-2 bg-${type}" style="width: 16px; height: 16px;"></span>
          <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
          <small>just now</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>
    `;
    
    // Append the toast to the container
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Initialize and show the toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    // Remove the toast from the DOM when hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
      toastElement.remove();
    });
  };

  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchQuery = this.value.toLowerCase().trim();
      
      if (window.handleSearch && typeof window.handleSearch === 'function') {
        // If the page has a custom search handler, use it
        window.handleSearch(searchQuery);
      }
      
      // Otherwise, we don't do anything until a specific page
      // implements its own search handler
    });
  }

  // Populating the integrations list
  const integrationsListElements = document.querySelectorAll('#integrationsList');
  if (integrationsListElements.length > 0) {
    populateIntegrationsList();
  }

  // Function to populate integrations list
  function populateIntegrationsList() {
    const integrations = [
      {
        id: 'slack',
        name: 'Slack',
        description: 'Send notifications to Slack channels',
        icon: 'bi-slack',
        connected: true
      },
      {
        id: 'gmail',
        name: 'Gmail',
        description: 'Send emails and access inbox',
        icon: 'bi-envelope',
        connected: true
      },
      {
        id: 'trello',
        name: 'Trello',
        description: 'Sync tasks with Trello boards',
        icon: 'bi-trello',
        connected: false
      },
      {
        id: 'gcalendar',
        name: 'Google Calendar',
        description: 'Schedule events and meetings',
        icon: 'bi-calendar-check',
        connected: true
      },
      {
        id: 'github',
        name: 'GitHub',
        description: 'Link tasks to GitHub issues',
        icon: 'bi-github',
        connected: false
      },
      {
        id: 'msteams',
        name: 'Microsoft Teams',
        description: 'Integrate with Microsoft Teams',
        icon: 'bi-microsoft',
        connected: false
      }
    ];

    integrationsListElements.forEach(listElement => {
      let listHtml = '';
      
      integrations.forEach(integration => {
        listHtml += `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="integration-icon me-3">
                  <i class="bi ${integration.icon}"></i>
                </div>
                <div>
                  <h6 class="mb-0">${integration.name}</h6>
                  <p class="text-muted mb-0 small">${integration.description}</p>
                </div>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="integration-${integration.id}" 
                  ${integration.connected ? 'checked' : ''} 
                  data-integration-id="${integration.id}">
              </div>
            </div>
            <div class="mt-3 pt-3 border-top">
              ${integration.connected ? 
                `<div class="d-flex justify-content-between align-items-center">
                  <span class="badge bg-success">Connected</span>
                  <button class="btn btn-sm btn-outline-danger integration-disconnect" 
                  data-integration-id="${integration.id}">Disconnect</button>
                </div>` : 
                `<div class="d-flex justify-content-end">
                  <button class="btn btn-sm btn-primary integration-connect" 
                  data-integration-id="${integration.id}">Connect</button>
                </div>`
              }
            </div>
          </div>
        `;
      });
      
      listElement.innerHTML = listHtml;
      
      // Add event listeners for integration toggles
      const toggles = listElement.querySelectorAll('.form-check-input');
      toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
          const integrationId = this.dataset.integrationId;
          const isConnected = this.checked;
          
          if (isConnected) {
            // Logic for connecting
            const connectionButton = this.closest('.list-group-item').querySelector('.integration-connect');
            if (connectionButton) {
              connectionButton.click();
            } else {
              this.checked = false;
              showToast('This integration is already connected.', 'info');
            }
          } else {
            // Logic for disconnecting
            const disconnectButton = this.closest('.list-group-item').querySelector('.integration-disconnect');
            if (disconnectButton) {
              disconnectButton.click();
            } else {
              this.checked = true;
              showToast('You need to connect this integration first.', 'warning');
            }
          }
        });
      });
      
      // Connect buttons
      const connectButtons = listElement.querySelectorAll('.integration-connect');
      connectButtons.forEach(button => {
        button.addEventListener('click', function() {
          const integrationId = this.dataset.integrationId;
          const listItem = this.closest('.list-group-item');
          
          // Simulate connection success
          setTimeout(() => {
            // Update UI
            const contentHtml = `
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-success">Connected</span>
                <button class="btn btn-sm btn-outline-danger integration-disconnect" 
                data-integration-id="${integrationId}">Disconnect</button>
              </div>
            `;
            
            this.closest('.border-top').innerHTML = contentHtml;
            listItem.querySelector('.form-check-input').checked = true;
            
            // Show success toast
            showToast(`Successfully connected to ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)}`, 'success');
            
            // Add event listener to the new disconnect button
            const disconnectBtn = listItem.querySelector('.integration-disconnect');
            if (disconnectBtn) {
              disconnectBtn.addEventListener('click', handleDisconnect);
            }
          }, 1000);
        });
      });
      
      // Disconnect buttons
      const disconnectButtons = listElement.querySelectorAll('.integration-disconnect');
      disconnectButtons.forEach(button => {
        button.addEventListener('click', handleDisconnect);
      });
      
      function handleDisconnect() {
        const integrationId = this.dataset.integrationId;
        const listItem = this.closest('.list-group-item');
        
        // Simulate disconnection success
        setTimeout(() => {
          // Update UI
          const contentHtml = `
            <div class="d-flex justify-content-end">
              <button class="btn btn-sm btn-primary integration-connect" 
              data-integration-id="${integrationId}">Connect</button>
            </div>
          `;
          
          this.closest('.border-top').innerHTML = contentHtml;
          listItem.querySelector('.form-check-input').checked = false;
          
          // Show success toast
          showToast(`Disconnected from ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)}`, 'info');
          
          // Add event listener to the new connect button
          const connectBtn = listItem.querySelector('.integration-connect');
          if (connectBtn) {
            connectBtn.addEventListener('click', function() {
              const integrationId = this.dataset.integrationId;
              const listItem = this.closest('.list-group-item');
              
              // Simulate connection success
              setTimeout(() => {
                // Update UI
                const contentHtml = `
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-success">Connected</span>
                    <button class="btn btn-sm btn-outline-danger integration-disconnect" 
                    data-integration-id="${integrationId}">Disconnect</button>
                  </div>
                `;
                
                this.closest('.border-top').innerHTML = contentHtml;
                listItem.querySelector('.form-check-input').checked = true;
                
                // Show success toast
                showToast(`Successfully connected to ${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)}`, 'success');
                
                // Add event listener to the new disconnect button
                const disconnectBtn = listItem.querySelector('.integration-disconnect');
                if (disconnectBtn) {
                  disconnectBtn.addEventListener('click', handleDisconnect);
                }
              }, 1000);
            });
          }
        }, 1000);
      }
    });
  }
});