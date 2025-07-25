document.addEventListener('DOMContentLoaded', function() {
  // View toggle buttons
  const viewKanban = document.getElementById('viewKanban');
  const viewTimeline = document.getElementById('viewTimeline');
  const viewList = document.getElementById('viewList');

  const kanbanView = document.getElementById('kanbanView');
  const timelineView = document.getElementById('timelineView');
  const listView = document.getElementById('listView');

  if (viewKanban && viewTimeline && viewList) {
    viewKanban.addEventListener('click', function() {
      setActiveView(this, kanbanView);
    });

    viewTimeline.addEventListener('click', function() {
      setActiveView(this, timelineView);
    });

    viewList.addEventListener('click', function() {
      setActiveView(this, listView);
    });
  }

  // Function to set active view
  function setActiveView(button, viewElement) {
    // Remove active class from all buttons
    [viewKanban, viewTimeline, viewList].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Hide all views
    [kanbanView, timelineView, listView].forEach(view => {
      if (view) view.classList.add('d-none');
    });
    
    // Show selected view
    viewElement.classList.remove('d-none');
    
    // If timeline view is activated, initialize it
    if (viewElement === timelineView && !timelineView.getAttribute('data-initialized')) {
      initializeTimelineView();
      timelineView.setAttribute('data-initialized', 'true');
    }
    
    // If list view is activated, initialize it
    if (viewElement === listView && !listView.getAttribute('data-initialized')) {
      initializeListView();
      listView.setAttribute('data-initialized', 'true');
    }
  }

  // Initialize Kanban board
  const kanbanColumns = document.querySelectorAll('.kanban-tasks');
  if (kanbanColumns.length > 0) {
    initializeKanbanBoard();
  }

  // Save task button
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  if (saveTaskBtn) {
    saveTaskBtn.addEventListener('click', function() {
      // Get form values
      const title = document.getElementById('taskTitle').value;
      const dueDate = document.getElementById('taskDueDate').value;
      
      if (!title) {
        showToast('Please enter a task title', 'warning');
        return;
      }
      
      if (!dueDate) {
        showToast('Please select a due date', 'warning');
        return;
      }
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
      modal.hide();
      
      // Show success message
      showToast(`Task "${title}" created successfully`, 'success');
      
      // Add the task to the kanban board
      const todoColumn = document.querySelector('.kanban-tasks[data-status="todo"]');
      if (todoColumn) {
        const newTask = createKanbanTaskElement({
          id: Date.now(),
          title: title,
          assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(dueDate),
          priority: document.getElementById('taskPriority').value
        });
        
        todoColumn.insertAdjacentHTML('afterbegin', newTask);
        
        // Update the count
        const countBadge = todoColumn.closest('.kanban-column').querySelector('.badge');
        countBadge.textContent = parseInt(countBadge.textContent) + 1;
        
        // Add click event to the new task
        const taskElement = todoColumn.querySelector('.kanban-task:first-child');
        if (taskElement) {
          taskElement.addEventListener('click', function() {
            // Show task details
            const taskId = this.getAttribute('data-task-id');
            showTaskDetails(taskId);
          });
        }
      }
      
      // Reset the form
      document.getElementById('addTaskForm').reset();
    });
  }

  // Initialize Kanban board
  function initializeKanbanBoard() {
    const tasks = {
      todo: [
        {
          id: 1,
          title: 'Design new dashboard layout',
          description: 'Create a modern and user-friendly dashboard layout for the admin panel.',
          assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
          priority: 'high'
        },
        {
          id: 2,
          title: 'Implement user authentication',
          description: 'Set up secure user authentication with email verification.',
          assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
          priority: 'medium'
        },
        {
          id: 5,
          title: 'Update privacy policy',
          description: 'Review and update the privacy policy to comply with new regulations.',
          assignee: null,
          dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
          priority: 'low'
        },
        {
          id: 8,
          title: 'Create onboarding tutorial',
          description: 'Design and implement an onboarding tutorial for new users.',
          assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
          priority: 'medium'
        }
      ],
      inprogress: [
        {
          id: 3,
          title: 'API integration for user profiles',
          description: 'Integrate the user profile API with the frontend.',
          assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
          priority: 'high'
        },
        {
          id: 4,
          title: 'Create API documentation',
          description: 'Document the REST API endpoints for developers.',
          assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
          priority: 'medium'
        },
        {
          id: 9,
          title: 'Implement dark mode',
          description: 'Add dark mode support to the application.',
          assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() + 86400000 * 6), // 6 days from now
          priority: 'low'
        }
      ],
      completed: [
        {
          id: 6,
          title: 'Fix pagination bugs',
          description: 'Fix bugs in the pagination component.',
          assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
          completedDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
          priority: 'high'
        },
        {
          id: 7,
          title: 'Setup CI/CD pipeline',
          description: 'Configure continuous integration and deployment.',
          assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
          completedDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
          priority: 'medium'
        },
        {
          id: 10,
          title: 'Initial project setup',
          description: 'Create repository and set up project structure.',
          assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/32' },
          dueDate: new Date(Date.now() - 86400000 * 7), // 7 days ago
          completedDate: new Date(Date.now() - 86400000 * 8), // 8 days ago
          priority: 'low'
        }
      ]
    };
    
    // Populate kanban columns
    kanbanColumns.forEach(column => {
      const status = column.getAttribute('data-status');
      const statusTasks = tasks[status] || [];
      
      let tasksHtml = '';
      
      statusTasks.forEach(task => {
        tasksHtml += createKanbanTaskElement(task);
      });
      
      column.innerHTML = tasksHtml;
      
      // Update the task count in the column header
      const countBadge = column.closest('.kanban-column').querySelector('.badge');
      if (countBadge) {
        countBadge.textContent = statusTasks.length;
      }
    });
    
    // Add click event to kanban tasks
    const kanbanTasks = document.querySelectorAll('.kanban-task');
    kanbanTasks.forEach(task => {
      task.addEventListener('click', function() {
        // Show task details
        const taskId = this.getAttribute('data-task-id');
        showTaskDetails(taskId);
      });
    });
  }

  // Create kanban task element
  function createKanbanTaskElement(task) {
    const dueDate = task.dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const assigneeHtml = task.assignee ? 
      `<div class="task-assignee">
        <img src="${task.assignee.avatar}" alt="${task.assignee.name}" class="rounded-circle">
        <span class="small">${task.assignee.name}</span>
      </div>` : 
      '<span class="small text-muted">Unassigned</span>';
    
    return `
      <div class="kanban-task priority-${task.priority}" data-task-id="${task.id}">
        <div class="d-flex justify-content-between mb-2">
          <h6 class="mb-0">${task.title}</h6>
          <span class="badge text-bg-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'} bg-opacity-10 text-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
        </div>
        <p class="small text-muted mb-2">${task.description ? task.description.substring(0, 60) + (task.description.length > 60 ? '...' : '') : ''}</p>
        <div class="d-flex justify-content-between align-items-center">
          ${assigneeHtml}
          <span class="small text-muted"><i class="bi bi-calendar me-1"></i>${dueDate}</span>
        </div>
      </div>
    `;
  }

  // Initialize Timeline View
  function initializeTimelineView() {
    const timelineDates = document.querySelector('.timeline-dates');
    const timelineBody = document.getElementById('timelineBody');
    
    if (!timelineDates || !timelineBody) return;
    
    // Create 14 days timeline (2 weeks)
    const today = new Date();
    const days = 14;
    
    // Generate timeline header dates
    let datesHtml = '';
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - 3); // Start 3 days before today
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = date.toDateString() === today.toDateString();
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      datesHtml += `
        <div class="timeline-date ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}">
          ${dayName}<br>${dayNumber}
        </div>
      `;
    }
    
    timelineDates.innerHTML = datesHtml;
    
    // Generate timeline tasks
    const tasks = [
      {
        id: 1,
        title: 'Design dashboard',
        assignee: { id: 1, name: 'John Doe' },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), // 2 days ago
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), // tomorrow
        progress: 70
      },
      {
        id: 2,
        title: 'API integration',
        assignee: { id: 2, name: 'Jane Smith' },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), // yesterday
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), // 3 days from now
        progress: 30
      },
      {
        id: 3,
        title: 'User authentication',
        assignee: { id: 2, name: 'Jane Smith' },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), // 2 days from now
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), // 6 days from now
        progress: 0
      },
      {
        id: 4,
        title: 'Documentation',
        assignee: { id: 1, name: 'John Doe' },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4), // 4 days from now
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9), // 9 days from now
        progress: 0
      },
      {
        id: 5,
        title: 'Testing',
        assignee: { id: 3, name: 'Robert Johnson' },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), // 7 days from now
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), // 10 days from now
        progress: 0
      }
    ];
    
    let rowsHtml = '';
    
    tasks.forEach(task => {
      const taskStartDay = Math.floor((task.startDate - startDate) / (24 * 60 * 60 * 1000));
      const taskDuration = Math.ceil((task.endDate - task.startDate) / (24 * 60 * 60 * 1000)) + 1;
      const taskLeft = taskStartDay * 100; // 100px per day
      const taskWidth = taskDuration * 100; // 100px per day
      
      const startDate = task.startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      const endDate = task.endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      rowsHtml += `
        <div class="timeline-row">
          <div class="timeline-task">
            <div class="timeline-task-name">${task.title}</div>
            <div class="timeline-task-meta">Assigned to: ${task.assignee.name}</div>
          </div>
          <div class="timeline-progress">
            <div class="timeline-bar" style="left: ${taskLeft}px; width: ${taskWidth}px;">
              ${task.title} (${task.progress}%)
            </div>
          </div>
        </div>
      `;
    });
    
    timelineBody.innerHTML = rowsHtml;
    
    // Add today marker to all rows
    const todayPosition = (3 * 100) + 50; // 3 days from start (0-indexed) + half day
    const timelineRows = timelineBody.querySelectorAll('.timeline-progress');
    
    timelineRows.forEach(row => {
      const todayMarker = document.createElement('div');
      todayMarker.className = 'timeline-bar today-marker';
      todayMarker.style.left = `${todayPosition}px`;
      todayMarker.style.height = '100%';
      row.appendChild(todayMarker);
    });
  }

  // Initialize List View
  function initializeListView() {
    const taskListBody = document.getElementById('taskListBody');
    
    if (!taskListBody) return;
    
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
      },
      {
        id: 6,
        title: 'Setup CI/CD pipeline',
        assignee: { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/32' },
        status: 'Completed',
        priority: 'High',
        dueDate: new Date(Date.now() - 86400000 * 2) // 2 days ago
      },
      {
        id: 7,
        title: 'API integration for user profiles',
        assignee: { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/32' },
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000 * 4) // 4 days from now
      },
      {
        id: 8,
        title: 'Create onboarding tutorial',
        assignee: { id: 3, name: 'Robert Johnson', avatar: 'https://via.placeholder.com/32' },
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 86400000 * 9) // 9 days from now
      }
    ];
    
    let rowsHtml = '';
    
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
      
      rowsHtml += `
        <tr>
          <td>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="task-${task.id}" ${task.status === 'Completed' ? 'checked' : ''}>
              <label class="form-check-label" for="task-${task.id}"></label>
            </div>
          </td>
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
    
    taskListBody.innerHTML = rowsHtml;
    
    // Add event listener to the select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllTasks');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', function() {
        const checked = this.checked;
        const checkboxes = taskListBody.querySelectorAll('.form-check-input');
        
        checkboxes.forEach(checkbox => {
          checkbox.checked = checked;
        });
      });
    }
    
    // Add event listener to task checkboxes
    const taskCheckboxes = taskListBody.querySelectorAll('.form-check-input');
    taskCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        // Check if all checkboxes are checked
        const allChecked = Array.from(taskCheckboxes).every(cb => cb.checked);
        
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = allChecked;
          selectAllCheckbox.indeterminate = !allChecked && Array.from(taskCheckboxes).some(cb => cb.checked);
        }
        
        // Show a toast when a task is marked as complete
        if (this.checked) {
          const taskId = this.id.split('-')[1];
          const task = tasks.find(t => t.id === parseInt(taskId));
          
          if (task) {
            showToast(`Task "${task.title}" marked as complete`, 'success');
          }
        }
      });
    });
  }

  // Function to show task details in the modal (reused from dashboard.js)
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
      
      const task = tasks.find(t => t.id === parseInt(taskId)) || tasks[0];
      
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
              <span>Assigned to: ${task.assignee ? task.assignee.name : 'Unassigned'}</span>
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
          <h6>Comments (${task.comments ? task.comments.length : 0})</h6>
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

  // Add search handler
  window.handleSearch = function(query) {
    // Handle search in each view
    if (kanbanView && !kanbanView.classList.contains('d-none')) {
      searchKanbanTasks(query);
    } else if (listView && !listView.classList.contains('d-none')) {
      searchListTasks(query);
    } else if (timelineView && !timelineView.classList.contains('d-none')) {
      searchTimelineTasks(query);
    }
  };

  // Function to search kanban tasks
  function searchKanbanTasks(query) {
    const kanbanTasks = document.querySelectorAll('.kanban-task');
    
    kanbanTasks.forEach(task => {
      const title = task.querySelector('h6').textContent.toLowerCase();
      const description = task.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(query) || description.includes(query)) {
        task.style.display = '';
        task.classList.add('highlight-search');
        setTimeout(() => {
          task.classList.remove('highlight-search');
        }, 2000);
      } else {
        task.style.display = 'none';
      }
    });
  }

  // Function to search list tasks
  function searchListTasks(query) {
    const taskRows = document.querySelectorAll('#taskListBody tr');
    
    taskRows.forEach(row => {
      const title = row.querySelector('.fw-medium').textContent.toLowerCase();
      
      if (title.includes(query)) {
        row.style.display = '';
        row.classList.add('table-primary');
        setTimeout(() => {
          row.classList.remove('table-primary');
        }, 2000);
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Function to search timeline tasks
  function searchTimelineTasks(query) {
    const timelineRows = document.querySelectorAll('.timeline-row');
    
    timelineRows.forEach(row => {
      const title = row.querySelector('.timeline-task-name').textContent.toLowerCase();
      
      if (title.includes(query)) {
        row.style.display = '';
        row.classList.add('highlight-search');
        setTimeout(() => {
          row.classList.remove('highlight-search');
        }, 2000);
      } else {
        row.style.display = 'none';
      }
    });
  }
});