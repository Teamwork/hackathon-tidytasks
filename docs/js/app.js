var iconColour, viewModel;

viewModel = function() {
  this.currentPage = ko.observable('splash');
  this.allTasks = ko.observableArray();
  this.projects = ko.observableArray();
  this.currentProject = ko.observable();
  this.currentProjectId = ko.observable();
  this.currentTasklist = ko.observable();
  this.loginError = ko.observable();
  this.User = new User();
  this.domain = ko.observable();
  this.userId = ko.observable();
  this.userIcon = ko.observable();
  this.userFirstname = ko.observable();
  this.previousPage = ko.observable();
  this.showNav = ko.observable(false);
  this.lightNav = ko.observable(false);
  this.backButton = ko.observable(false);
  this.totalTasks = ko.observable();
  this.currentPage.subscribe(function(value) {
    return this.previousPage(value);
  }, this, "beforeChange");
  this.currentPage.subscribe((value) => {
    if (['dashboard'].indexOf(this.currentPage()) > -1) {
      this.showNav(true);
      this.lightNav(true);
      this.backButton(false);
    } else if (['add-task', 'project', 'project-view'].indexOf(this.currentPage()) > -1) {
      this.showNav(true);
      this.lightNav(false);
      this.backButton(true);
    } else {
      this.showNav(false);
    }
    return iconColour();
  });
  this.goBack = () => {
    return this.currentPage(this.previousPage());
  };
  this.loginSuccess = () => {
    this.currentPage('splash');
    this.loginError('');
    this.domain(User.domain);
    this.userIcon(User.userIcon);
    this.userFirstname(User.userFirstname);
    this.userId(User.userId);
    this.getAllTasks(true);
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
    this.projects([]);
    this.allTasks([]);
    xhrOptions = {
      method: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      data: {
        'filter': 'today',
        'getFiles': false,
        'responsible-party-ids': this.userId(),
        'stamp': new Date().getTime()
      },
      success: (data) => {
        var project, projectsAssoc, tasklist, tasks;
        console.log(data);
        tasks = data['todo-items'];
        this.totalTasks(tasks.length);
        projectsAssoc = {};
        $.each(tasks, function(i, task) {
          var cleanTask;
          if (projectsAssoc['p-' + task['project-id']] === void 0) {
            projectsAssoc['p-' + task['project-id']] = {};
            projectsAssoc['p-' + task['project-id']].taskCount = 0;
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
          cleanTask = {
            taskName: task.content,
            taskId: task.id,
            taskDescription: task.description
          };
          projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks.push(cleanTask);
          return projectsAssoc['p-' + task['project-id']].taskCount++;
        });
        for (project in projectsAssoc) {
          projectsAssoc[project].tasklists = [];
          for (tasklist in projectsAssoc[project].tasklistsAssoc) {
            projectsAssoc[project].tasklists.push(projectsAssoc[project].tasklistsAssoc[tasklist]);
          }
          this.projects.push(projectsAssoc[project]);
        }
        console.log(this.projects());
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
  this.showProject = (projectId) => {
    var j, len, project, ref;
    this.currentProjectId(projectId);
    ref = this.projects();
    for (j = 0, len = ref.length; j < len; j++) {
      project = ref[j];
      if (project.projectId === projectId) {
        this.currentPage('project-view');
        this.currentProject(project);
      }
    }
    console.log(this.currentProject());
  };
  this.createTask = () => {
    var payload, xhrOptions;
    console.log(this.currentTasklist());
    payload = {
      'todo-item': {
        'responsible-party-id': this.userId(),
        'start-date': moment(new Date()).format('YYYYMMDD'),
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
          return this.showProject(this.currentProjectId());
        });
      }
    };
    $.ajax(this.domain() + "tasklists/" + this.currentTasklist() + "/tasks.json", xhrOptions);
  };
  this.completeTask = (taskId) => {
    var xhrOptions;
    xhrOptions = {
      method: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      success: function(data) {
        console.log(data);
        $('[data-task-id=' + taskId + ']').addClass('completed').delay(1000).animate({
          height: 0,
          opacity: 0
        }, function() {
          return $(this).remove();
        });
      }
    };
    $.ajax(this.domain() + "tasks/" + taskId + "/complete.json", xhrOptions);
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
