document.addEventListener('DOMContentLoaded', function() {
  // Populate recent tasks table
  const taskTableBody = document.getElementById('taskTableBody');
  if (taskTableBody) {
    populateRecentTasks();
  }

  // Populate upcoming deadlines list
  const deadlinesList = document.getElementById('deadlinesList');
  if (deadlinesList) {
    populateDeadlines();
  }

  // Refresh deadlines button
  const refreshDeadlines = document.getElementById('refreshDeadlines');
  if (refreshDeadlines) {
    refreshDeadlines.addEventListener('click', function() {
      showToast('Refreshing deadlines...', 'info');
      
      // Simulate loading
      this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Refreshing...';
      this.disabled = true;
      
      setTimeout(() => {
        populateDeadlines();
        this.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh';
        this.disabled = false;
        showToast('Deadlines refreshed', 'success');
      }, 1500);
    });
  }

  // Create new workflow button
  const createWorkflowBtn = document.getElementById('createWorkflowBtn');
  if (createWorkflowBtn) {
    createWorkflowBtn.addEventListener('click', function() {
      const workflowName = document.getElementById('workflowName').value;
      
      if (!workflowName) {
        showToast('Please enter a workflow name', 'warning');
        return;
      }
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('newWorkflowModal'));
      modal.hide();
      
      // Show success message
      showToast(`Workflow "${workflowName}" created successfully`, 'success');
      
      // Redirect to the automations page
      setTimeout(() => {
        window.location.href = 'automations.html';
      }, 1500);
    });
  }

  // Task detail modal
  const taskDetailModal = document.getElementById('taskDetailModal');
  if (taskDetailModal) {
    taskDetailModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      const taskId = button ? button.getAttribute('data-task-id') : null;
      
      if (taskId) {
        showTaskDetails(taskId);
      }
    });
  }

  // Function to populate the recent tasks table
  function populateRecentTasks() {
    const tasks = [
      {
        id: 1,
        title: 'Design new dashboard layout',
        assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 2) // 2 days from now
      },
      {
        id: 2,
        title: 'Implement user authentication',
        assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/32' },
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 5) // 5 days from now
      },
      {
        id: 3,
        title: 'Fix pagination bugs',
        assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://via.placeholder.com/32' },
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(Date.now() - 86400000 * 1) // 1 day ago
      },
      {
        id: 4,
        title: 'Create API documentation',
        assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
        status: 'In Progress',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 3) // 3 days from now
      },
      {
        id: 5,
        title: 'Update privacy policy',
        assignee: null,
        status: 'To Do',
        priority: 'Low',
        dueDate: new Date(Date.now() + 86400000 * 7) // 7 days from now
      }
    ];
    
    let taskRows = '';
    
    tasks.forEach(task => {
      const dueDate = task.dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const assignee = task.assignee ? 
        `<div class="d-flex align-items-center">
          <img src="${task.assignee.avatar}" alt="${task.assignee.name}" class="rounded-circle me-2" width="28" height="28">
          <span>${task.assignee.name}</span>
        </div>` : 
        '<span class="text-muted">Unassigned</span>';
      
      const statusClass = task.status === 'Completed' ? 'success' : 
                          task.status === 'In Progress' ? 'primary' : 
                          task.status === 'To Do' ? 'secondary' : 'warning';
      
      const priorityClass = task.priority === 'High' ? 'danger' : 
                           task.priority === 'Medium' ? 'warning' : 'success';
      
      taskRows += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <span class="priority-indicator priority-${task.priority.toLowerCase()}"></span>
              <a href="#" class="fw-medium text-decoration-none text-reset" data-bs-toggle="modal" data-bs-target="#taskDetailModal" data-task-id="${task.id}">${task.title}</a>
            </div>
          </td>
          <td>${assignee}</td>
          <td><span class="badge bg-${statusClass}">${task.status}</span></td>
          <td><span class="badge text-bg-${priorityClass} bg-opacity-10 text-${priorityClass}">${task.priority}</span></td>
          <td>${dueDate}</td>
          <td>
            <div class="dropdown">
              <button class="btn btn-sm btn-icon" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#taskDetailModal" data-task-id="${task.id}">View Details</a></li>
                <li><a class="dropdown-item" href="#">Edit Task</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#">Delete Task</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    });
    
    taskTableBody.innerHTML = taskRows;
  }

  // Function to populate upcoming deadlines
  function populateDeadlines() {
    const today = new Date();
    const deadlines = [
      {
        id: 1,
        title: 'Design new dashboard layout',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0), // Today at 5 PM
        assignee: { id: 1, name: 'John Doe' }
      },
      {
        id: 2,
        title: 'Team weekly meeting',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0), // Tomorrow at 10 AM
        assignee: { id: 2, name: 'Jane Smith' }
      },
      {
        id: 4,
        title: 'Client presentation',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0), // Day after tomorrow at 2 PM
        assignee: { id: 1, name: 'John Doe' }
      },
      {
        id: 5,
        title: 'Project deadline',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 17, 0), // 5 days from now at 5 PM
        assignee: { id: 3, name: 'Robert Johnson' }
      }
    ];
    
    let deadlinesHtml = '';
    
    deadlines.forEach(deadline => {
      const dueDate = deadline.dueDate;
      const isToday = dueDate.getDate() === today.getDate() && 
                      dueDate.getMonth() === today.getMonth() && 
                      dueDate.getFullYear() === today.getFullYear();
      
      const isTomorrow = dueDate.getDate() === today.getDate() + 1 && 
                         dueDate.getMonth() === today.getMonth() && 
                         dueDate.getFullYear() === today.getFullYear();
      
      const markerClass = isToday ? 'today' : isTomorrow ? 'upcoming' : 'future';
      
      const formattedDate = isToday ? 'Today' : 
                           isTomorrow ? 'Tomorrow' : 
                           dueDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                           });
      
      const formattedTime = dueDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      deadlinesHtml += `
        <li class="list-group-item deadline-item d-flex align-items-center">
          <div class="deadline-marker ${markerClass}"></div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <div>
                <h6 class="mb-0">${deadline.title}</h6>
                <p class="mb-0 small text-muted">Assigned to ${deadline.assignee.name}</p>
              </div>
              <div class="text-end">
                <span class="badge text-bg-${isToday ? 'danger' : isTomorrow ? 'warning' : 'info'}">${formattedDate}</span>
                <div class="small text-muted">${formattedTime}</div>
              </div>
            </div>
          </div>
        </li>
      `;
    });
    
    deadlinesList.innerHTML = deadlinesHtml;
    
    // Add click event to deadline items
    const deadlineItems = deadlinesList.querySelectorAll('.deadline-item');
    deadlineItems.forEach(item => {
      item.addEventListener('click', function() {
        // Simulate navigation to task detail
        showToast('Opening task details...', 'info');
      });
    });
  }

  // Function to show task details in the modal
  function showTaskDetails(taskId) {
    const taskDetailContent = document.getElementById('taskDetailContent');
    
    if (!taskDetailContent) return;
    
    // Simulating loading
    taskDetailContent.innerHTML = `
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    
    // Simulate API call delay
    setTimeout(() => {
      // Find task details (in a real app, this would be an API call)
      const tasks = [
        {
          id: 1,
          title: 'Design new dashboard layout',
          description: 'Create a modern and user-friendly dashboard layout for the admin panel. Include analytics, recent activity, and shortcuts to common actions.',
          assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/64' },
          status: 'In Progress',
          priority: 'High',
          dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
          createdDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
          createdBy: { id: 2, name: 'Jane Smith' },
          tags: ['Design', 'UI/UX', 'Frontend'],
          attachments: [
            { name: 'dashboard_wireframe.pdf', size: '2.4 MB' },
            { name: 'design_inspiration.jpg', size: '1.8 MB' }
          ],
          comments: [
            {
              id: 1,
              author: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
              date: new Date(Date.now() - 86400000 * 2), // 2 days ago
              content: 'Please make sure to include a dark theme option in the design.'
            },
            {
              id: 2,
              author: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
              date: new Date(Date.now() - 86400000 * 1), // 1 day ago
              content: 'I\'ll add the dark theme toggle in the header.'
            }
          ]
        },
        {
          id: 2,
          title: 'Implement user authentication',
          description: 'Set up secure user authentication with email verification and password reset functionality.',
          assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/64' },
          status: 'To Do',
          priority: 'Medium',
          dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
          createdDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
          createdBy: { id: 3, name: 'Robert Johnson' },
          tags: ['Backend', 'Security'],
          attachments: [],
          comments: []
        }
      ];
      
      const task = tasks.find(t => t.id === parseInt(taskId));
      
      if (!task) {
        taskDetailContent.innerHTML = '<div class="alert alert-danger">Task not found</div>';
        return;
      }
      
      // Update modal title
      document.getElementById('taskDetailModalLabel').textContent = `Task: ${task.title}`;
      
      // Create the task detail content
      const dueDate = task.dueDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const createdDate = task.createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const statusClass = task.status === 'Completed' ? 'success' : 
                         task.status === 'In Progress' ? 'primary' : 
                         task.status === 'To Do' ? 'secondary' : 'warning';
      
      const priorityClass = task.priority === 'High' ? 'danger' : 
                          task.priority === 'Medium' ? 'warning' : 'success';
      
      let tagsHtml = '';
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach(tag => {
          tagsHtml += `<span class="badge bg-light text-dark me-1">${tag}</span>`;
        });
      }
      
      let attachmentsHtml = '';
      if (task.attachments && task.attachments.length > 0) {
        task.attachments.forEach(attachment => {
          attachmentsHtml += `
            <div class="d-flex align-items-center mb-2">
              <i class="bi bi-file-earmark me-2"></i>
              <div class="flex-grow-1">
                <div>${attachment.name}</div>
                <small class="text-muted">${attachment.size}</small>
              </div>
              <button class="btn btn-sm btn-outline-primary">
                <i class="bi bi-download"></i>
              </button>
            </div>
          `;
        });
      } else {
        attachmentsHtml = '<p class="text-muted">No attachments</p>';
      }
      
      let commentsHtml = '';
      if (task.comments && task.comments.length > 0) {
        task.comments.forEach(comment => {
          const commentDate = comment.date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          commentsHtml += `
            <div class="comment-item">
              <div class="d-flex">
                <img src="${comment.author.avatar}" alt="${comment.author.name}" class="comment-avatar">
                <div class="comment-content">
                  <div class="d-flex justify-content-between">
                    <h6 class="mb-0">${comment.author.name}</h6>
                    <small class="text-muted">${commentDate}</small>
                  </div>
                  <p class="mb-0">${comment.content}</p>
                  <div class="comment-actions">
                    <button class="btn btn-sm btn-link text-muted p-0 me-2">Reply</button>
                    <button class="btn btn-sm btn-link text-muted p-0">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      } else {
        commentsHtml = '<p class="text-muted">No comments yet</p>';
      }
      
      // Build the full HTML
      taskDetailContent.innerHTML = `
        <div class="task-detail-header">
          <div class="d-flex justify-content-between mb-2">
            <h5 class="mb-0">${task.title}</h5>
            <span class="badge bg-${statusClass}">${task.status}</span>
          </div>
          <div class="task-detail-meta">
            <div class="task-meta-item">
              <i class="bi bi-flag"></i>
              <span class="badge text-bg-${priorityClass} bg-opacity-10 text-${priorityClass}">${task.priority} Priority</span>
            </div>
            <div class="task-meta-item">
              <i class="bi bi-calendar"></i>
              <span>Due: ${dueDate}</span>
            </div>
            <div class="task-meta-item">
              <i class="bi bi-person"></i>
              <span>Assigned to: ${task.assignee.name}</span>
            </div>
            <div class="task-meta-item">
              <i class="bi bi-clock-history"></i>
              <span>Created: ${createdDate}</span>
            </div>
          </div>
        </div>
        
        <div class="row mb-4">
          <div class="col-md-8">
            <h6>Description</h6>
            <p>${task.description}</p>
            
            <div class="mb-3">
              <h6>Tags</h6>
              <div>${tagsHtml || '<p class="text-muted">No tags</p>'}</div>
            </div>
          </div>
          <div class="col-md-4">
            <h6>Attachments</h6>
            <div>${attachmentsHtml}</div>
          </div>
        </div>
        
        <div class="task-comments">
          <h6>Comments (${task.comments.length})</h6>
          ${commentsHtml}
          
          <div class="mt-3">
            <textarea class="form-control" rows="2" placeholder="Add a comment..."></textarea>
            <div class="d-flex justify-content-end mt-2">
              <button class="btn btn-sm btn-primary">
                <i class="bi bi-send"></i> Send
              </button>
            </div>
          </div>
        </div>
      `;
    }, 500);
  }
});