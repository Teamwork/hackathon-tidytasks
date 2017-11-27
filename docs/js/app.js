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
  this.flatTasks = ko.observableArray();
  this.projectTree = ko.observableArray();
  this.currentFilter = ko.observable();
  this.currentProjectId = ko.observable();
  this.totalTasks = ko.observable();
  this.allProjects = ko.observableArray();
  this.allTasklists = ko.observableArray();
  this.creatingTask = ko.observable(false);
  this.loadingTasks = ko.observable(false);
  this.selectedTasklist = ko.observable();
  this.searchTerm = ko.observable().extend({
    rateLimit: 500
  });
  this.searchResults = ko.observableArray();
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
  this.tasklistSelect = null;
  $(window).bind('mousemove touchmove keypress', () => {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
    return this.autoRefresh = this.setInterval(() => {
      return this.getAllTasks();
    }, 60000);
  });
  $("#start-date").pickadate();
  $("#due-date").pickadate();
  this.currentPage.subscribe(function(value) {
    this.previousPage(value);
  }, this, "beforeChange");
  this.currentPage.subscribe((value) => {
    if (['dashboard'].indexOf(value) > -1) {
      $('html').addClass('blue-bg');
      this.showNav(true);
      this.lightNav(true);
      this.backButton(false);
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
  this.currentProjectId.subscribe((value) => {
    if (value) {
      $('#project-id').val(value);
      this.getProjectTasklists(value);
    }
  });
  this.searchTerm.subscribe((searchTerm) => {
    this.searchResults([]);
    $.each(this.flatTasks(), (i, task) => {
      if (task.taskName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
        return this.searchResults.push(task);
      }
    });
  });
  this.goBack = () => {
    if (this.currentPage() === 'add-task' && this.currentProjectId()) {
      return this.currentPage('tasks-view');
    } else {
      this.currentProjectId(null);
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
        'getSubTasks': 'yes'
      },
      success: (data) => {
        var project, projectsAssoc, taskTotal, tasklist, tasks;
        this.projectTree([]);
        this.flatTasks([]);
        console.log(data);
        tasks = data['todo-items'];
        taskTotal = 0;
        projectsAssoc = {};
        $.each(tasks, (i, task) => {
          var cleanTask, due, start, type;
          if (!task['start-date'] && !task['due-date']) {
            return true;
          }
          if (projectsAssoc['p-' + task['project-id']] === void 0) {
            projectsAssoc['p-' + task['project-id']] = {};
            projectsAssoc['p-' + task['project-id']].taskCount = 0;
            projectsAssoc['p-' + task['project-id']].lateTasks = 0;
            projectsAssoc['p-' + task['project-id']].currentTasks = 0;
            projectsAssoc['p-' + task['project-id']].upcomingTasks = 0;
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc = {};
            projectsAssoc['p-' + task['project-id']].projectName = task['project-name'];
            projectsAssoc['p-' + task['project-id']].projectId = task['project-id'];
          }
          if (projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] === void 0) {
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] = {};
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks = [];
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].private = task['tasklist-private'];
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistName = task['todo-list-name'];
            projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistId = task['todo-list-id'];
          }
          type = '';
          start = task["start-date"];
          due = task["due-date"];
          if (due !== '' && due < this.today) {
            type = 'late';
            projectsAssoc['p-' + task['project-id']].lateTasks++;
            taskTotal++;
          } else if ((start !== '' && start <= this.today) || (due !== '' && due === this.today)) {
            type = 'today';
            projectsAssoc['p-' + task['project-id']].currentTasks++;
            taskTotal++;
          } else if (start !== '' && start > this.today) {
            type = 'upcoming';
            projectsAssoc['p-' + task['project-id']].upcomingTasks++;
          }
          cleanTask = {
            taskName: task.content,
            taskId: task.id,
            taskDescription: marked(task.description),
            taskDescriotionRaw: task.description,
            taskStartDate: start,
            taskDueDate: due,
            taskType: type,
            subtaskCount: task.predecessors.length,
            subtasks: task.predecessors,
            parentId: task.parentTaskId,
            attachmentCount: task['attachments-count'],
            commentCount: task['comments-count']
          };
          projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks.push(cleanTask);
          projectsAssoc['p-' + task['project-id']].taskCount++;
          return this.flatTasks.push(cleanTask);
        });
        for (project in projectsAssoc) {
          projectsAssoc[project].tasklists = [];
          for (tasklist in projectsAssoc[project].tasklistsAssoc) {
            projectsAssoc[project].tasklists.push(projectsAssoc[project].tasklistsAssoc[tasklist]);
          }
          delete projectsAssoc[project].tasklistsAssoc;
          this.projectTree.push(projectsAssoc[project]);
        }
        console.log(this.projectTree());
        this.totalTasks(taskTotal);
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
        this.getProjectTasklists($("#project-id").val());
      }
    };
    $.ajax(this.domain() + 'projects.json', xhrOptions);
  };
  this.getProjectTasklists = (projectId) => {
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
  this.showTasks = (opts) => {
    if (opts && opts.projectId) {
      this.currentProjectId(opts.projectId);
    } else {
      this.currentProjectId('');
    }
    if (opts && opts.filter) {
      this.currentFilter(opts.filter);
    } else {
      this.currentFilter('all');
    }
    this.currentPage('tasks-view');
    this.removeEmpties();
  };
  this.removeEmpties = function() {
    if ($('.task').length === 0 && $('.project-status').length) {
      this.currentFilter('all');
    } else if ($('.task').length === 0) {
      this.currentPage('dashboard');
    }
    $('.task-list').each(function() {
      if ($(this).find('.task').length === 0) {
        return $(this).hide();
      } else {
        return $(this).show();
      }
    });
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
            this.showTasks({
              projectId: this.currentProjectId()
            });
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
          return this.getAllTasks(false, this.removeEmpties);
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
    $.each(this.flatTasks(), (i, task) => {
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
