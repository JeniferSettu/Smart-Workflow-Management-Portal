document.addEventListener('DOMContentLoaded', function() {
  // View toggle buttons
  const viewAutomations = document.getElementById('viewAutomations');
  const viewEditor = document.getElementById('viewEditor');

  const automationsGallery = document.getElementById('automationsGallery');
  const automationEditor = document.getElementById('automationEditor');

  if (viewAutomations && viewEditor) {
    viewAutomations.addEventListener('click', function() {
      setActiveView(this, automationsGallery);
    });

    viewEditor.addEventListener('click', function() {
      setActiveView(this, automationEditor);
    });
  }

  // Function to set active view
  function setActiveView(button, viewElement) {
    // Remove active class from all buttons
    [viewAutomations, viewEditor].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Hide all views
    [automationsGallery, automationEditor].forEach(view => {
      if (view) view.classList.add('d-none');
    });
    
    // Show selected view
    viewElement.classList.remove('d-none');
  }

  // Initialize automation lists
  const myAutomationsList = document.getElementById('myAutomationsList');
  const templatesList = document.getElementById('templatesList');
  const archivedList = document.getElementById('archivedList');

  if (myAutomationsList && templatesList && archivedList) {
    initializeAutomationLists();
  }

  // Initialize connected integrations
  const connectedIntegrations = document.getElementById('connectedIntegrations');
  if (connectedIntegrations) {
    initializeConnectedIntegrations();
  }

  // Create workflow button
  const createWorkflowBtn = document.getElementById('createWorkflowBtn');
  if (createWorkflowBtn) {
    createWorkflowBtn.addEventListener('click', function() {
      const automationName = document.getElementById('newAutomationName').value;
      
      if (!automationName) {
        showToast('Please enter a workflow name', 'warning');
        return;
      }
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('createAutomationModal'));
      modal.hide();
      
      // Show success message
      showToast(`Workflow "${automationName}" created successfully`, 'success');
      
      // Switch to editor view
      if (viewEditor && automationEditor) {
        viewEditor.click();
        
        // Update the editor title
        const automationTitle = document.getElementById('automationTitle');
        if (automationTitle) {
          automationTitle.value = automationName;
        }
      }
    });
  }

  // Cancel edit button
  const cancelEdit = document.getElementById('cancelEdit');
  if (cancelEdit) {
    cancelEdit.addEventListener('click', function() {
      if (viewAutomations) {
        viewAutomations.click();
      }
    });
  }

  // Save automation button
  const saveAutomation = document.getElementById('saveAutomation');
  if (saveAutomation) {
    saveAutomation.addEventListener('click', function() {
      const automationTitle = document.getElementById('automationTitle').value;
      
      if (!automationTitle) {
        showToast('Please enter a workflow name', 'warning');
        return;
      }
      
      // Show success message
      showToast(`Workflow "${automationTitle}" saved successfully`, 'success');
      
      // Switch back to gallery view
      if (viewAutomations) {
        viewAutomations.click();
      }
    });
  }

  // Template selection in the create automation modal
  const startEmpty = document.getElementById('startEmpty');
  const startTemplate = document.getElementById('startTemplate');
  const templateSelect = document.getElementById('templateSelect');

  if (startEmpty && startTemplate && templateSelect) {
    startEmpty.addEventListener('change', function() {
      templateSelect.disabled = this.checked;
    });

    startTemplate.addEventListener('change', function() {
      templateSelect.disabled = !this.checked;
    });
  }

  // Add step buttons in the step modal
  const stepButtons = document.querySelectorAll('[data-step-type]');
  if (stepButtons) {
    stepButtons.forEach(button => {
      button.addEventListener('click', function() {
        const stepType = this.getAttribute('data-step-type');
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStepModal'));
        modal.hide();
        
        // Add the step to the workflow
        addWorkflowStep(stepType);
        
        // Show success message
        showToast('Step added to workflow', 'success');
      });
    });
  }

  // Save step button
  const saveStepBtn = document.getElementById('saveStepBtn');
  if (saveStepBtn) {
    saveStepBtn.addEventListener('click', function() {
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('editStepModal'));
      modal.hide();
      
      // Show success message
      showToast('Step updated successfully', 'success');
    });
  }

  // Step search input
  const stepSearchInput = document.getElementById('stepSearchInput');
  if (stepSearchInput) {
    stepSearchInput.addEventListener('input', function() {
      const searchQuery = this.value.toLowerCase().trim();
      
      // Filter the step list items
      const stepItems = document.querySelectorAll('[data-step-type]');
      stepItems.forEach(item => {
        const stepTitle = item.querySelector('h6').textContent.toLowerCase();
        const stepDesc = item.querySelector('p').textContent.toLowerCase();
        
        if (stepTitle.includes(searchQuery) || stepDesc.includes(searchQuery)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Initialize automation lists
  function initializeAutomationLists() {
    // My automations
    const myAutomations = [
      {
        id: 1,
        title: 'Customer Onboarding',
        description: 'Automated workflow for new customer onboarding process',
        trigger: 'When a new customer is created',
        steps: 4,
        status: 'active',
        lastRun: new Date(Date.now() - 86400000 * 2) // 2 days ago
      },
      {
        id: 2,
        title: 'Bug Fix Process',
        description: 'Standard procedure for handling and fixing reported bugs',
        trigger: 'When a bug is reported',
        steps: 5,
        status: 'active',
        lastRun: new Date(Date.now() - 86400000 * 1) // 1 day ago
      },
      {
        id: 3,
        title: 'Invoice Reminder',
        description: 'Send reminders for upcoming and overdue invoices',
        trigger: 'Scheduled (Daily at 9 AM)',
        steps: 3,
        status: 'active',
        lastRun: new Date() // Today
      },
      {
        id: 4,
        title: 'Lead Qualification',
        description: 'Process to qualify and follow up with new leads',
        trigger: 'When a lead form is submitted',
        steps: 4,
        status: 'draft',
        lastRun: null
      }
    ];
    
    // Templates
    const templates = [
      {
        id: 1,
        title: 'Customer Onboarding',
        description: 'Standard workflow for new customer onboarding',
        steps: 4,
        category: 'Sales'
      },
      {
        id: 2,
        title: 'Bug Tracking',
        description: 'Track and manage software bugs efficiently',
        steps: 5,
        category: 'Development'
      },
      {
        id: 3,
        title: 'Approval Process',
        description: 'Multi-level approval workflow for documents',
        steps: 6,
        category: 'Administration'
      },
      {
        id: 4,
        title: 'Lead Nurturing',
        description: 'Nurture leads through marketing funnel',
        steps: 5,
        category: 'Marketing'
      },
      {
        id: 5,
        title: 'Employee Onboarding',
        description: 'Workflow for new employee onboarding process',
        steps: 7,
        category: 'HR'
      },
      {
        id: 6,
        title: 'Content Approval',
        description: 'Review and approve content before publishing',
        steps: 4,
        category: 'Marketing'
      }
    ];
    
    // Archived automations
    const archivedAutomations = [
      {
        id: 1,
        title: 'Old Customer Survey',
        description: 'Customer satisfaction survey workflow (discontinued)',
        trigger: 'Manual',
        steps: 3,
        status: 'archived',
        lastRun: new Date(Date.now() - 86400000 * 30) // 30 days ago
      },
      {
        id: 2,
        title: 'Legacy Notification System',
        description: 'Previous notification system before the upgrade',
        trigger: 'Scheduled',
        steps: 2,
        status: 'archived',
        lastRun: new Date(Date.now() - 86400000 * 45) // 45 days ago
      }
    ];
    
    // Populate my automations list
    let myAutomationsHtml = '';
    myAutomations.forEach(automation => {
      const lastRunText = automation.lastRun ? 
        `Last run: ${automation.lastRun.toLocaleDateString()}` : 
        'Never run';
      
      const statusBadge = automation.status === 'active' ? 
        '<span class="badge bg-success">Active</span>' : 
        '<span class="badge bg-secondary">Draft</span>';
      
      myAutomationsHtml += `
        <div class="col-md-6 col-lg-4">
          <div class="card automation-card h-100" data-automation-id="${automation.id}">
            <div class="card-body">
              <div class="automation-status">
                ${statusBadge}
              </div>
              <h5 class="card-title">${automation.title}</h5>
              <p class="card-text text-muted">${automation.description}</p>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded bg-primary bg-opacity-10 p-2 me-2">
                  <i class="bi bi-play-circle text-primary"></i>
                </div>
                <div class="small">${automation.trigger}</div>
              </div>
              <div class="d-flex justify-content-between">
                <span class="small text-muted">${automation.steps} steps</span>
                <span class="small text-muted">${lastRunText}</span>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-primary me-2 edit-automation" data-automation-id="${automation.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-secondary run-automation" data-automation-id="${automation.id}" ${automation.status !== 'active' ? 'disabled' : ''}>
                <i class="bi bi-play"></i> Run
              </button>
            </div>
          </div>
        </div>
      `;
    });
    myAutomationsList.innerHTML = myAutomationsHtml;
    
    // Populate templates list
    let templatesHtml = '';
    templates.forEach(template => {
      templatesHtml += `
        <div class="col-md-6 col-lg-4">
          <div class="card automation-card h-100" data-template-id="${template.id}">
            <div class="card-body">
              <span class="badge bg-light text-dark position-absolute top-0 end-0 m-3">${template.category}</span>
              <h5 class="card-title">${template.title}</h5>
              <p class="card-text text-muted">${template.description}</p>
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-diagram-3 text-primary me-2"></i>
                <span class="small">${template.steps} steps</span>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-primary use-template" data-template-id="${template.id}">
                <i class="bi bi-plus-lg"></i> Use Template
              </button>
            </div>
          </div>
        </div>
      `;
    });
    templatesList.innerHTML = templatesHtml;
    
    // Populate archived automations list
    let archivedHtml = '';
    archivedAutomations.forEach(automation => {
      const lastRunText = automation.lastRun ? 
        `Last run: ${automation.lastRun.toLocaleDateString()}` : 
        'Never run';
      
      archivedHtml += `
        <div class="col-md-6">
          <div class="card automation-card h-100" data-automation-id="${automation.id}">
            <div class="card-body">
              <div class="automation-status">
                <span class="badge bg-secondary">Archived</span>
              </div>
              <h5 class="card-title">${automation.title}</h5>
              <p class="card-text text-muted">${automation.description}</p>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded bg-secondary bg-opacity-10 p-2 me-2">
                  <i class="bi bi-play-circle text-secondary"></i>
                </div>
                <div class="small">${automation.trigger}</div>
              </div>
              <div class="d-flex justify-content-between">
                <span class="small text-muted">${automation.steps} steps</span>
                <span class="small text-muted">${lastRunText}</span>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-end">
              <button class="btn btn-sm btn-outline-primary restore-automation" data-automation-id="${automation.id}">
                <i class="bi bi-arrow-counterclockwise"></i> Restore
              </button>
            </div>
          </div>
        </div>
      `;
    });
    archivedList.innerHTML = archivedHtml;
    
    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('.edit-automation');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const automationId = this.getAttribute('data-automation-id');
        const automation = myAutomations.find(a => a.id === parseInt(automationId));
        
        if (automation) {
          // Switch to editor view
          if (viewEditor && automationEditor) {
            viewEditor.click();
            
            // Update the editor title
            const automationTitle = document.getElementById('automationTitle');
            if (automationTitle) {
              automationTitle.value = automation.title;
            }
          }
        }
      });
    });
    
    // Add event listeners to run buttons
    const runButtons = document.querySelectorAll('.run-automation');
    runButtons.forEach(button => {
      button.addEventListener('click', function() {
        const automationId = this.getAttribute('data-automation-id');
        const automation = myAutomations.find(a => a.id === parseInt(automationId));
        
        if (automation) {
          // Show confirmation dialog
          if (confirm(`Are you sure you want to run the "${automation.title}" workflow?`)) {
            // Show progress
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Running...';
            this.disabled = true;
            
            // Simulate running
            setTimeout(() => {
              this.innerHTML = '<i class="bi bi-play"></i> Run';
              this.disabled = false;
              
              // Show success message
              showToast(`Workflow "${automation.title}" executed successfully`, 'success');
            }, 2000);
          }
        }
      });
    });
    
    // Add event listeners to use template buttons
    const useTemplateButtons = document.querySelectorAll('.use-template');
    useTemplateButtons.forEach(button => {
      button.addEventListener('click', function() {
        const templateId = this.getAttribute('data-template-id');
        const template = templates.find(t => t.id === parseInt(templateId));
        
        if (template) {
          // Open create workflow modal
          const modal = new bootstrap.Modal(document.getElementById('createAutomationModal'));
          modal.show();
          
          // Pre-fill with template
          document.getElementById('newAutomationName').value = template.title;
          document.getElementById('newAutomationDesc').value = template.description;
          document.getElementById('startTemplate').checked = true;
          document.getElementById('templateSelect').disabled = false;
          document.getElementById('templateSelect').value = templateId;
        }
      });
    });
    
    // Add event listeners to restore buttons
    const restoreButtons = document.querySelectorAll('.restore-automation');
    restoreButtons.forEach(button => {
      button.addEventListener('click', function() {
        const automationId = this.getAttribute('data-automation-id');
        const automation = archivedAutomations.find(a => a.id === parseInt(automationId));
        
        if (automation) {
          // Show confirmation
          if (confirm(`Are you sure you want to restore "${automation.title}"?`)) {
            // Show success message
            showToast(`Workflow "${automation.title}" restored successfully`, 'success');
            
            // Remove the card with animation
            const card = this.closest('.automation-card');
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
              card.closest('.col-md-6').remove();
            }, 300);
          }
        }
      });
    });
    
    // Make automation cards clickable
    const automationCards = document.querySelectorAll('.automation-card');
    automationCards.forEach(card => {
      card.addEventListener('click', function(event) {
        // Don't trigger if a button was clicked
        if (event.target.tagName === 'BUTTON' || event.target.parentNode.tagName === 'BUTTON' || 
            event.target.tagName === 'I' && event.target.parentNode.tagName === 'BUTTON') {
          return;
        }
        
        const automationId = this.getAttribute('data-automation-id');
        const templateId = this.getAttribute('data-template-id');
        
        if (automationId) {
          // Find edit button and trigger click
          const editButton = this.querySelector('.edit-automation');
          if (editButton) {
            editButton.click();
          } else {
            // For archived automations
            const restoreButton = this.querySelector('.restore-automation');
            if (restoreButton) {
              restoreButton.click();
            }
          }
        } else if (templateId) {
          // Find use template button and trigger click
          const useButton = this.querySelector('.use-template');
          if (useButton) {
            useButton.click();
          }
        }
      });
    });
  }

  // Initialize connected integrations
  function initializeConnectedIntegrations() {
    const integrations = [
      {
        id: 'slack',
        name: 'Slack',
        icon: 'bi-slack',
        connected: true
      },
      {
        id: 'gmail',
        name: 'Gmail',
        icon: 'bi-envelope',
        connected: true
      },
      {
        id: 'gcalendar',
        name: 'Google Calendar',
        icon: 'bi-calendar-check',
        connected: true
      }
    ];
    
    let integrationsHtml = '';
    
    integrations.forEach(integration => {
      integrationsHtml += `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="card integration-card">
            <div class="card-body">
              <div class="integration-status">
                <span class="badge bg-success">Connected</span>
              </div>
              <div class="integration-logo">
                <i class="bi ${integration.icon}"></i>
              </div>
              <h5 class="text-center mb-0">${integration.name}</h5>
            </div>
          </div>
        </div>
      `;
    });
    
    connectedIntegrations.innerHTML = integrationsHtml;
  }

  // Function to add a workflow step
  function addWorkflowStep(stepType) {
    const stepsContainer = document.getElementById('automationStepsContainer');
    if (!stepsContainer) return;
    
    // Get the last connector (the one with the add button)
    const lastConnector = stepsContainer.querySelector('.add-step-connector');
    if (!lastConnector) return;
    
    // Generate a unique ID for the new step
    const stepId = Date.now();
    
    // Step content based on type
    let stepIcon = 'bi-gear';
    let stepTitle = 'New Step';
    let stepDescription = 'Configure this step';
    
    switch (stepType) {
      case 'create_task':
        stepIcon = 'bi-calendar-plus';
        stepTitle = 'Create Task';
        stepDescription = 'Create a new task with details';
        break;
      case 'update_task':
        stepIcon = 'bi-pencil-square';
        stepTitle = 'Update Task';
        stepDescription = 'Update an existing task';
        break;
      case 'assign_task':
        stepIcon = 'bi-person-check';
        stepTitle = 'Assign Task';
        stepDescription = 'Assign task to a team member';
        break;
      case 'send_email':
        stepIcon = 'bi-envelope';
        stepTitle = 'Send Email';
        stepDescription = 'Send an email notification';
        break;
      case 'send_slack':
        stepIcon = 'bi-chat-dots';
        stepTitle = 'Send Slack Message';
        stepDescription = 'Send a message to Slack';
        break;
      case 'wait':
        stepIcon = 'bi-hourglass-split';
        stepTitle = 'Wait';
        stepDescription = 'Wait for a specific time period';
        break;
      case 'condition':
        stepIcon = 'bi-columns-gap';
        stepTitle = 'Condition';
        stepDescription = 'Branch based on conditions';
        break;
    }
    
    // Create the new step HTML
    const stepHtml = `
      <div class="automation-step" data-step-id="${stepId}" data-step-type="${stepType}">
        <div class="automation-step-header">
          <div class="step-icon">
            <i class="bi ${stepIcon}"></i>
          </div>
          <div class="step-content">
            <h6>${stepTitle}</h6>
            <p class="mb-0">${stepDescription}</p>
          </div>
          <div class="step-actions">
            <button class="btn btn-sm btn-link text-secondary" data-bs-toggle="modal" data-bs-target="#editStepModal">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-link text-danger delete-step">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="automation-connector">
        <div class="automation-connector-line"></div>
      </div>
    `;
    
    // Insert the new step before the last connector
    lastConnector.insertAdjacentHTML('beforebegin', stepHtml);
    
    // Add event listener to the delete button
    const deleteButton = stepsContainer.querySelector(`.automation-step[data-step-id="${stepId}"] .delete-step`);
    if (deleteButton) {
      deleteButton.addEventListener('click', function() {
        // Get the step element
        const step = this.closest('.automation-step');
        // Get the connector after the step
        const connector = step.nextElementSibling;
        
        // Remove the step and connector with animation
        step.style.opacity = '0';
        connector.style.opacity = '0';
        
        setTimeout(() => {
          step.remove();
          connector.remove();
          
          // Show toast
          showToast('Step removed from workflow', 'info');
        }, 300);
      });
    }
  }
});