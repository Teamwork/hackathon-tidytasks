var iconColour, viewModel;

viewModel = function() {
  this.currentPage = ko.observable('splash');
  this.flatTasks = ko.observableArray();
  this.projects = ko.observableArray();
  this.currentFilter = ko.observable();
  this.currentProjectId = ko.observable();
  this.totalTasks = ko.observable();
  this.allProjects = ko.observableArray();
  this.allTasklists = ko.observableArray();
  this.creatingTask = ko.observable(false);
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
  $("#start-date").pickadate();
  $("#due-date").pickadate();
  this.currentPage.subscribe(function(value) {
    this.previousPage(value);
  }, this, "beforeChange");
  this.currentPage.subscribe((value) => {
    if (['dashboard'].indexOf(this.currentPage()) > -1) {
      $('html').addClass('blue-bg');
      this.showNav(true);
      this.lightNav(true);
      this.backButton(false);
    } else if (['add-task', 'project', 'tasks-view'].indexOf(this.currentPage()) > -1) {
      this.showNav(true);
      this.lightNav(false);
      this.backButton(true);
      $('html').removeClass('blue-bg');
    } else {
      $('html').addClass('blue-bg');
      this.showNav(false);
    }
    iconColour();
  });
  this.currentProjectId.subscribe((value) => {
    if (value) {
      $('#project-id').val(value);
      this.getProjectTasklists(value);
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
        'sort': 'dateadded'
      },
      success: (data) => {
        var project, projectsAssoc, taskTotal, tasklist, tasks;
        this.projects([]);
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
            taskDescription: task.description,
            taskStartDate: start,
            taskDueDate: due,
            taskType: type,
            subtaskCount: task.predecessors.length,
            subtasks: task.predecessors,
            parentId: task.parentTaskId
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
          this.projects.push(projectsAssoc[project]);
        }
        console.log(this.projects());
        this.totalTasks(taskTotal);
        if (goToDash) {
          this.currentPage('dashboard');
        }
        if (typeof callback === 'function') {
          callback();
        }
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
      }
    };
    $.ajax(this.domain() + 'projects/' + projectId + '/tasklists.json', xhrOptions);
  };
  this.showTasks = (opts) => {
    if (opts.projectId) {
      this.currentProjectId(opts.projectId);
    } else {
      this.currentProjectId('');
    }
    if (opts.filter) {
      this.currentFilter(opts.filter);
    } else {
      this.currentFilter('all');
    }
    this.removeEmpties();
    this.currentPage('tasks-view');
  };
  this.removeEmpties = function() {
    $('.task-list').each(function() {
      if ($(this).find('.task').length === 0) {
        return $(this).hide();
      } else {
        return $(this).show();
      }
    });
  };
  this.createTask = () => {
    var dueDate, payload, startDate, xhrOptions;
    startDate = $('#start-date').val() ? moment($('#start-date').val(), "DD MMMM, YYYY").format("YYYYMMDD") : '';
    dueDate = $('#due-date').val() ? moment($('#due-date').val(), "DD MMMM, YYYY").format("YYYYMMDD") : '';
    if (startDate > dueDate) {
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
          this.showTasks({
            projectId: this.currentProjectId()
          });
          return this.creatingTask(false);
        });
      }
    };
    this.creatingTask(true);
    $.ajax(this.domain() + "tasklists/" + $('#tasklist-id').val() + "/tasks.json", xhrOptions);
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

iconColour = function() {
  $('.svg-icon').each(function() {
    var $e, color, imgURL;
    $e = $(this);
    imgURL = $e.prop('src');
    if ($e.hasClass('svg-icon-white')) {
      color = '#fff';
    } else {
      color = 'rgba(0,0,0,0.7)';
    }
    return $.get(imgURL, function(data) {
      var $svg;
      $svg = $(data).find('svg');
      $svg.find('path').attr('fill', color);
      return $e.prop('src', "data:image/svg+xml;base64," + window.btoa($svg.prop('outerHTML')));
    });
  });
};

ko.applyBindings(viewModel);
