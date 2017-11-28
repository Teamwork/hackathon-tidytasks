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
  $("#start-date").pickadate();
  $("#due-date").pickadate();
  $(window).bind('mousemove touchmove keypress', () => {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
    return this.autoRefresh = this.setInterval(() => {
      return this.getAllTasks();
    }, 60000);
  });
  this.totalTasks = ko.pureComputed(() => {
    return this.tasks().length;
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
  }, this, "beforeChange");
  this.currentPage.subscribe((value) => {
    if (['dashboard'].indexOf(value) > -1) {
      $('html').addClass('blue-bg');
      this.showNav(true);
      this.lightNav(true);
      this.backButton(false);
      this.currentFilter('all');
      this.currentProjectId('');
    } else if (['add-task', 'project', 'tasks-view', 'search'].indexOf(value) > -1) {
      this.showNav(true);
      this.lightNav(false);
      this.backButton(true);
      $('html').removeClass('blue-bg');
    } else {
      $('html').addClass('blue-bg');
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
          lateCount: this.getTaskCount(task.projectId, "late"),
          todayCount: this.getTaskCount(task.projectId, "today"),
          upcomingCount: this.getTaskCount(task.projectId, "upcoming"),
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
      $('#project-id').val(value);
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
      apiKey: $('#API-key').val(),
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
      method: 'GET',
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
        var cleanTask, cleanTasks, due, j, len, ref, start, task, type;
        cleanTasks = [];
        ref = data['todo-items'];
        for (j = 0, len = ref.length; j < len; j++) {
          task = ref[j];
          if (task['start-date'] || task['due-date']) {
            type = '';
            start = task["start-date"];
            due = task["due-date"];
            if (due !== '' && due < this.today) {
              type = 'late';
            } else if ((start !== '' && start <= this.today) || (due !== '' && due === this.today)) {
              type = 'today';
            } else if (start !== '' && start > this.today) {
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
    return $.ajax(this.domain() + 'tasks.json', xhrOptions);
  };
  this.getAllProjects = () => {
    var xhrOptions;
    xhrOptions = {
      method: 'GET',
      data: {
        pageSize: 500
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        $.each(data.projects, (i, project) => {
          project = {
            text: project.name,
            value: project.id
          };
          return this.allProjects.push(project);
        });
        this.getTasklists($("#project-id").val());
      }
    };
    $.ajax(this.domain() + 'projects.json', xhrOptions);
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
      method: 'GET',
      data: {
        pageSize: 500
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        this.allTasklists([]);
        $.each(data.tasklists, (i, tasklist) => {
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
    $.ajax(this.domain() + 'projects/' + projectId + '/tasklists.json', xhrOptions);
  };
  this.createTask = () => {
    var dueDate, payload, startDate, tasklistPayload, tasklistXhrOptions, xhrOptions;
    startDate = $('#start-date').val() ? moment($('#start-date').val(), "DD MMMM, YYYY").format("YYYYMMDD") : '';
    dueDate = $('#due-date').val() ? moment($('#due-date').val(), "DD MMMM, YYYY").format("YYYYMMDD") : '';
    if (dueDate && (startDate > dueDate)) {
      alert('The start date can\'t be before the due date');
      return false;
    }
    payload = {
      'todo-item': {
        'responsible-party-id': this.userId(),
        'start-date': startDate,
        'due-date': dueDate,
        'content': $('#task-name').val()
      }
    };
    xhrOptions = {
      method: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify(payload),
      success: (data) => {
        this.getAllTasks(false, function() {
          if (this.currentProjectId()) {
            this.currentProjectId(projectId);
            this.currentPage('tasks-view');
          } else {
            this.currentPage('dashboard');
          }
          return this.creatingTask(false);
        });
      }
    };
    this.creatingTask(true);
    if ($('#tasklist-name').val()) {
      tasklistPayload = {
        'todo-list': {
          'name': $('#tasklist-name').val()
        }
      };
      tasklistXhrOptions = {
        method: 'POST',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
        },
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify(tasklistPayload),
        success: (data) => {
          $.ajax(this.domain() + "tasklists/" + data.TASKLISTID + "/tasks.json", xhrOptions);
        }
      };
      $.ajax(this.domain() + "projects/" + $('#project-id').val() + "/tasklists.json", tasklistXhrOptions);
    } else {
      $.ajax(this.domain() + "tasklists/" + $('#tasklist-id').val() + "/tasks.json", xhrOptions);
    }
  };
  this.completeTask = (taskId) => {
    var el, xhrOptions;
    el = $('[data-task-id=' + taskId + ']');
    el.addClass('completed');
    xhrOptions = {
      method: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: (data) => {
        el.delay(1000).animate({
          height: 0,
          opacity: 0
        }, () => {
          el.remove();
          return this.getAllTasks();
        });
      },
      error: function() {
        el.removeClass('completed');
        return alert('There was an error completing the task');
      }
    };
    $.ajax(this.domain() + "tasks/" + taskId + "/complete.json", xhrOptions);
  };
  this.highlightSubtasks = (taskId) => {
    $.each(this.tasks(), (i, task) => {
      if (parseInt(task.parentId) === parseInt(taskId)) {
        $('[data-task-id=' + task.taskId + "]").toggleClass('highlight');
      }
    });
  };
  this.toggleDetails = function(data, event) {
    $(event.target).next('.task-details').toggleClass('hidden');
  };
};

ko.applyBindings(viewModel);
