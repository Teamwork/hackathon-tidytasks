var markedRenderer, viewModel;

markedRenderer = new marked.Renderer();

markedRenderer.link = function(href, title, text) {
  return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>';
};

marked.setOptions({
  renderer: markedRenderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

viewModel = function() {
  this.currentPage = ko.observable('splash');
  this.tasks = ko.observableArray();
  this.currentFilter = ko.observable('all');
  this.currentProjectId = ko.observable('');
  this.allProjects = ko.observableArray();
  this.allTasklists = ko.observableArray();
  this.prevResponse = '';
  this.creatingTask = ko.observable(false);
  this.loadingTasks = ko.observable(false);
  this.selectedTasklist = ko.observable();
  this.searchTerm = ko.observable('').extend({
    rateLimit: 500
  });
  this.User = new User();
  this.domain = ko.observable();
  this.userId = ko.observable();
  this.userIcon = ko.observable();
  this.userFirstname = ko.observable();
  this.previousPage = ko.observable();
  this.showNav = ko.observable(false);
  this.lightNav = ko.observable(false);
  this.backButton = ko.observable(false);
  this.loginError = ko.observable();
  this.today = moment(new Date()).format('YYYYMMDD');
  document.addEventListener('mousemove', () => {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
    return this.autoRefresh = this.setInterval(() => {
      return this.getAllTasks();
    }, 60000);
  });
  this.greeting = ko.pureComputed(() => {
    var currentHour;
    currentHour = moment(new Date()).format('HH');
    if (currentHour < 4) {
      return 'Hey';
    } else if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  });
  this.totalTasks = ko.pureComputed(() => {
    return this.tasks().length;
  });
  this.totalLate = ko.pureComputed(() => {
    return (ko.utils.arrayFilter(this.tasks(), function(task) {
      return task.taskType === 'late';
    })).length;
  });
  this.totalToday = ko.pureComputed(() => {
    return (ko.utils.arrayFilter(this.tasks(), function(task) {
      return task.taskType === 'today';
    })).length;
  });
  this.totalUpcoming = ko.pureComputed(() => {
    return (ko.utils.arrayFilter(this.tasks(), function(task) {
      return task.taskType === 'upcoming';
    })).length;
  });
  this.searchResults = ko.pureComputed(() => {
    if (!this.searchTerm()) {
      return [];
    } else {
      return ko.utils.arrayFilter(this.tasks(), function(task) {
        return task.taskName.toLowerCase().indexOf(searchTerm().toLowerCase()) > -1 || task.taskDescriptionRaw.toLowerCase().indexOf(searchTerm().toLowerCase()) > -1;
      });
    }
  });
  this.currentPage.subscribe((value) => {
    this.previousPage(value);
  }, this, 'beforeChange');
  this.currentPage.subscribe((value) => {
    if (['dashboard'].indexOf(value) > -1) {
      this.showNav(true);
      this.lightNav(true);
      this.backButton(false);
      this.currentFilter('all');
      this.currentProjectId('');
    } else if (['add-task', 'project', 'tasks-view', 'search'].indexOf(value) > -1) {
      this.showNav(true);
      this.lightNav(false);
      this.backButton(true);
    } else {
      this.showNav(false);
    }
    setTimeout(function() {
      if (value === 'search') {
        return document.getElementById('search-term').focus();
      } else if (value === 'add-task') {
        return document.getElementById('task-name').focus();
      }
    }, 50);
  });
  this.filteredTasks = ko.pureComputed(() => {
    return ko.utils.arrayFilter(this.tasks(), (task) => {
      if (this.currentProjectId() !== '' && this.currentProjectId() !== task.projectId) {
        return false;
      }
      if (this.currentFilter() !== 'all' && this.currentFilter() !== task.taskType) {
        return false;
      }
      return true;
    });
  }, this);
  this.projects = ko.pureComputed(() => {
    var projectArray, projectIds;
    projectIds = [];
    projectArray = [];
    ko.utils.arrayForEach(this.filteredTasks(), (task) => {
      var project;
      if (projectIds.indexOf(task.projectId) < 0) {
        project = {
          projectId: task.projectId,
          projectName: task.projectName,
          taskCount: this.getTaskCount(task.projectId),
          lateCount: this.getTaskCount(task.projectId, 'late'),
          todayCount: this.getTaskCount(task.projectId, 'today'),
          upcomingCount: this.getTaskCount(task.projectId, 'upcoming'),
          tasklists: this.getProjectTasklists(task.projectId)
        };
        projectIds.push(task.projectId);
        return projectArray.push(project);
      }
    });
    return projectArray;
  }, this);
  this.tasklists = ko.pureComputed(() => {
    var tasklistIds, tasklistsArray;
    tasklistIds = [];
    tasklistsArray = [];
    ko.utils.arrayForEach(this.filteredTasks(), (task) => {
      var tasklist;
      if (tasklistIds.indexOf(task.tasklistId) < 0) {
        tasklist = {
          tasklistId: task.tasklistId,
          tasklistName: task.tasklistName,
          projectId: task.projectId,
          tasks: this.getTasklistTasks(task.tasklistId)
        };
        tasklistIds.push(task.tasklistId);
        return tasklistsArray.push(tasklist);
      }
    });
    return tasklistsArray;
  }, this);
  this.getProjectTasklists = (projectId) => {
    return ko.utils.arrayFilter(this.tasklists(), (tasklist) => {
      return tasklist.projectId === projectId;
    });
  };
  this.getTasklistTasks = (tasklistId) => {
    return ko.utils.arrayFilter(this.filteredTasks(), (task) => {
      return task.tasklistId === tasklistId;
    });
  };
  this.getTaskCount = (projectId, filter) => {
    var taskCount;
    taskCount = 0;
    ko.utils.arrayForEach(this.tasks(), (task) => {
      if (filter && filter !== task.taskType) {
        return;
      }
      if (task.projectId === projectId) {
        return taskCount++;
      }
    });
    return taskCount;
  };
  this.currentProjectId.subscribe((value) => {
    if (value) {
      document.getElementById('project-id').value = value;
      this.getTasklists(value);
    }
  });
  this.goBack = () => {
    if (this.currentPage() === 'add-task' && this.currentProjectId()) {
      return this.currentPage('tasks-view');
    } else {
      return this.currentPage('dashboard');
    }
  };
  this.loginSuccess = () => {
    this.currentPage('splash');
    this.loginError('');
    this.domain(User.domain);
    this.userIcon(User.userIcon);
    this.userFirstname(User.userFirstname);
    this.userId(User.userId);
    this.getAllTasks(true);
    this.getAllProjects();
  };
  this.loginFail = () => {
    this.currentPage('login');
    this.loginError('There was an error logging in. Please double check your API key.');
  };
  this.logout = function() {
    localStorage.removeItem('auth');
    window.location.reload(true);
  };
  this.processLogin = function() {
    this.currentPage('splash');
    this.User.auth({
      apiKey: document.getElementById('API-key').value,
      success: this.loginSuccess,
      fail: this.loginFail
    });
  };
  if (localStorage.getItem('auth')) {
    this.User.auth({
      authHeader: localStorage.getItem('auth'),
      success: this.loginSuccess,
      fail: this.loginFail
    });
  } else {
    this.currentPage('login');
  }
  this.getAllTasks = (goToDash, callback) => {
    var xhrOptions;
    if (this.loadingTasks()) {
      return;
    }
    this.loadingTasks(true);
    xhrOptions = {
      url: this.domain() + 'tasks.json',
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      data: {
        'getFiles': false,
        'responsible-party-ids': this.userId(),
        'stamp': new Date().getTime(),
        'getSubTasks': 'yes',
        'sort': 'duedate'
      },
      success: (data) => {
        var cleanTask, cleanTasks, due, i, len, ref, start, task, type;
        if (this.prevResponse === JSON.stringify(data)) {
          this.loadingTasks(false);
          return;
        }
        this.prevResponse = JSON.stringify(data);
        cleanTasks = [];
        ref = data['todo-items'];
        for (i = 0, len = ref.length; i < len; i++) {
          task = ref[i];
          if (task['start-date'] || task['due-date']) {
            type = '';
            start = task['start-date'];
            due = task['due-date'];
            if (due !== '' && due < this.today) {
              type = 'late';
            } else if ((start !== '' && start <= this.today) || (due !== '' && due === this.today)) {
              type = 'today';
            } else if ((start !== '' && start > this.today) || start === '' && due > this.today) {
              type = 'upcoming';
            }
            cleanTask = {
              taskName: task.content,
              taskId: task.id,
              tasklistId: task['todo-list-id'],
              tasklistName: task['todo-list-name'],
              projectId: task['project-id'],
              projectName: task['project-name'],
              taskDescription: marked(task.description),
              taskDescriptionRaw: task.description,
              taskStartDate: start,
              taskDueDate: due,
              taskType: type,
              subtaskCount: task.predecessors.length,
              subtasks: task.predecessors,
              parentId: task.parentTaskId,
              attachmentCount: task['attachments-count'],
              commentCount: task['comments-count']
            };
            cleanTasks.push(cleanTask);
          }
        }
        this.tasks(cleanTasks);
        if (goToDash) {
          this.currentPage('dashboard');
        }
        if (typeof callback === 'function') {
          callback();
        }
        this.loadingTasks(false);
      }
    };
    return $.ajax(xhrOptions);
  };
  this.getAllProjects = () => {
    var xhrOptions;
    xhrOptions = {
      url: this.domain() + 'projects.json',
      data: {
        pageSize: 500
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        ko.utils.arrayForEach(data.projects, (project) => {
          project = {
            text: project.name,
            value: project.id
          };
          return this.allProjects.push(project);
        });
        this.getTasklists(document.getElementById('project-id').value);
      }
    };
    $.ajax(xhrOptions);
  };
  this.getTasklists = (projectId) => {
    var xhrOptions;
    this.allTasklists([
      {
        id: '',
        text: 'Loading tasklists...'
      }
    ]);
    xhrOptions = {
      url: this.domain() + 'projects/' + projectId + '/tasklists.json',
      data: {
        pageSize: 500
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        this.allTasklists([]);
        ko.utils.arrayForEach(data.tasklists, (tasklist) => {
          tasklist = {
            text: tasklist.name,
            value: tasklist.id
          };
          return this.allTasklists.push(tasklist);
        });
        this.allTasklists.push({
          text: 'New tasklist...',
          value: '-1'
        });
      }
    };
    $.ajax(xhrOptions);
  };
  this.createTask = () => {
    var dueDate, dueDateVal, projectId, startDate, startDateVal, taskName, taskPayload, taskXhrOptions, tasklistId, tasklistName, tasklistPayload, tasklistXhrOptions;
    startDateVal = document.getElementById('start-date').value;
    dueDateVal = document.getElementById('due-date').value;
    startDate = startDateVal ? moment(startDateVal).format('YYYYMMDD') : '';
    dueDate = dueDateVal ? moment(dueDateVal).format('YYYYMMDD') : '';
    taskName = document.getElementById('task-name').value;
    tasklistId = document.getElementById('tasklist-id').value;
    tasklistName = document.getElementById('tasklist-name') ? document.getElementById('tasklist-name').value : null;
    projectId = document.getElementById('project-id').value;
    if (dueDate && (startDate > dueDate)) {
      alert('The start date can\'t be before the due date');
      return false;
    }
    taskPayload = {
      'todo-item': {
        'responsible-party-id': this.userId(),
        'start-date': startDate,
        'due-date': dueDate,
        'content': taskName
      }
    };
    taskXhrOptions = {
      url: this.domain() + 'tasklists/' + tasklistId + '/tasks.json',
      type: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(taskPayload),
      success: (data) => {
        this.getAllTasks(false, function() {
          this.getAllProjects();
          if (this.currentProjectId()) {
            this.currentPage('tasks-view');
          } else {
            this.currentPage('dashboard');
          }
          return this.creatingTask(false);
        });
      }
    };
    this.creatingTask(true);
    if (tasklistName) {
      tasklistPayload = {
        'todo-list': {
          'name': tasklistName
        }
      };
      tasklistXhrOptions = {
        url: this.domain() + 'projects/' + projectId + '/tasklists.json ',
        type: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
        },
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(tasklistPayload),
        success: (data) => {
          taskXhrOptions.url = this.domain() + 'tasklists/' + data.TASKLISTID + '/tasks.json';
          $.ajax(taskXhrOptions);
        }
      };
      $.ajax(tasklistXhrOptions);
    } else {
      $.ajax(taskXhrOptions);
    }
  };
  this.completeTask = (taskId) => {
    var el, xhrOptions;
    el = document.querySelector('[data-task-id="' + taskId + '"]');
    el.classList.add('completed');
    xhrOptions = {
      url: this.domain() + 'tasks/' + taskId + '/complete.json',
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        this.getAllTasks();
      },
      error: function() {
        el.classList.remove('completed');
        return alert('There was an error completing the task');
      }
    };
    $.ajax(xhrOptions);
  };
  this.highlightSubtasks = (taskId) => {
    ko.utils.arrayForEach(this.tasks(), (task) => {
      var taskEl;
      if (parseInt(task.parentId) === parseInt(taskId)) {
        taskEl = document.querySelector('[data-task-id="' + task.taskId + '"]');
        if (taskEl) {
          taskEl.classList.toggle('highlight');
        }
      }
    });
  };
  this.toggleDetails = function(data, event) {
    var detailsEl;
    detailsEl = event.target.nextSibling;
    if (detailsEl) {
      detailsEl.classList.toggle('hidden');
    }
  };
};

ko.applyBindings(viewModel);
