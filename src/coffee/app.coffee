# This file is required by the index.html file and will
# be executed in the renderer process for that window.
# All of the Node.js APIs are available in this process.
# Define a "Person" class that tracks its own name and children, and has a method to add a new child

var taskLists = {"STATUS":"OK","tasklists":[{"name":"Bedrooms","pinned":false,"milestone-id":"","description":"","uncompleted-count":6,"id":"725038","complete":false,"private":false,"isTemplate":false,"position":4000,"status":"new","projectId":"249091","projectName":"House Renovation","DLM":1511477458965},{"name":"Garage","pinned":false,"milestone-id":"","description":"","uncompleted-count":8,"id":"725039","complete":false,"private":false,"isTemplate":false,"position":4001,"newTaskDefaults":{"grantAccessTo":"","dueDateOffset":"","estimated-minutes":0,"description":"","content":"","priority":"","defaultsTaskId":7000466,"viewEstimatedTime":true,"private":0,"startDateOffset":"","lockdownId":"","userFollowingComments":false,"userFollowingChanges":false,"changeFollowerIds":"","commentFollowerIds":"","changeFollowerSummary":"","commentFollowerSummary":"","tags":null,"boardColumn":null},"status":"new","projectId":"249091","projectName":"House Renovation","DLM":1511477458965},{"name":"Kitchen","pinned":false,"milestone-id":"","description":"","uncompleted-count":5,"id":"725041","complete":false,"private":false,"isTemplate":false,"position":4002,"newTaskDefaults":{"grantAccessTo":"","dueDateOffset":"","estimated-minutes":0,"description":"","content":"","priority":"","defaultsTaskId":7000470,"viewEstimatedTime":true,"private":0,"startDateOffset":"","lockdownId":"","userFollowingComments":false,"userFollowingChanges":false,"changeFollowerIds":"","commentFollowerIds":"","changeFollowerSummary":"","commentFollowerSummary":"","tags":null,"boardColumn":null},"status":"new","projectId":"249091","projectName":"House Renovation","DLM":1511477458965}]}.tasklists
var tasks = {"STATUS":"OK","tasks":[{"id":7000523,"name":"Bring old couch to the dump","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T16:56:00Z","dateChanged":"2017-11-23T16:56:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":0,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2001,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2001,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127},{"id":7000537,"name":"Insulate and paint walls","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T16:58:00Z","dateChanged":"2017-11-23T16:58:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":2,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2002,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2002,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127},{"id":7000538,"name":"Replace window frame","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T16:58:00Z","dateChanged":"2017-11-23T16:58:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":0,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2003,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2003,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127},{"id":7000539,"name":"tidy tools away","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T16:58:00Z","dateChanged":"2017-11-23T16:58:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":0,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2004,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2004,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127},{"id":7001684,"name":"Stack boxes","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T17:24:00Z","dateChanged":"2017-11-23T17:24:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":0,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2005,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2005,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127},{"id":7001686,"name":"build new integrated shelves","priority":null,"status":"new","parentTaskId":0,"description":"","canViewEstTime":true,"createdBy":{"id":170293,"firstName":"Rory","lastName":"O'Kelly"},"dateCreated":"2017-11-23T17:24:00Z","dateChanged":"2017-11-23T17:24:00Z","hasFollowers":false,"hasLoggedTime":false,"hasReminders":false,"hasRemindersForUser":false,"hasTickets":false,"isPrivate":false,"privacyIsInherited":null,"lockdownId":0,"numMinutesLogged":0,"numActiveSubTasks":0,"numAttachments":0,"numComments":0,"numCommentsRead":0,"numCompletedSubTasks":0,"numDependencies":0,"numEstMins":0,"numPredecessors":0,"position":2006,"projectId":249091,"startDate":"20171123","assignedTo":[{"id":170291,"firstName":"Alder","lastName":"Cass"}],"dueDate":null,"dueDateFromMilestone":false,"taskListId":725039,"progress":0,"changeFollowerIds":"","commentFollowerIds":"","followingChanges":false,"followingComments":false,"order":2006,"canComplete":true,"canEdit":true,"canLogTime":true,"DLM":1511477689127}]}.tasks
var projects = {"letters":["H"],"STATUS":"OK","projects":[{"replyByEmailEnabled":true,"starred":false,"notifySettings":{"taskByEmailEveryone":false,"linkEveryone":false,"commentIncludeAssigned":true,"messageEveryone":false,"fileEveryone":false,"privateItemEveryone":false,"milestoneAssignee":false,"notebookEveryone":false,"commentIncludeCreator":true,"taskAssignee":false,"commentIncludeCompleter":true,"messageByEmailEveryone":false,"allowNotifyAnyone":false},"show-announcement":false,"harvest-timers-enabled":false,"status":"active","subStatus":"current","defaultPrivacy":"open","integrations":{"microsoftConnectors":{"enabled":false},"onedrivebusiness":{"enabled":false,"folder":"root","account":"","foldername":"root"}},"created-on":"2017-11-23T16:44:40Z","category":{"name":"","id":"","color":""},"filesAutoNewVersion":false,"tags":[],"overview-start-page":"default","logo":"","startDate":"","id":"249091","last-changed-on":"2017-11-23T17:24:08Z","defaults":{"privacy":""},"endDate":"","company":{"name":"Tidy Tasks","is-owner":"1","id":"89204"},"tasks-start-page":"default","active-pages":{"links":"1","tasks":"1","time":"1","billing":"1","notebooks":"1","files":"1","comments":"1","riskRegister":"1","milestones":"1","messages":"1"},"name":"House Renovation","privacyEnabled":false,"description":"","announcement":"","permissions":{"canAddTaskLists":true,"viewNotebook":true,"canAccessOneDriveBusiness":true,"receiveEmailNotifications":true,"projectAdministrator":true,"viewMessagesAndFiles":true,"canAddLinks":true,"canAddMessages":true,"isObserving":false,"notifyDefaults":{"newTasks":"0"},"canAccess":true,"canEditAllTasks":true,"canAccessBox":false,"viewTimeLog":true,"canSetPrivacy":true,"canAddNotebooks":true,"viewLinks":true,"isArchived":false,"viewTasksAndMilestones":true,"viewEstimatedTime":true,"viewAllTimeLogs":true,"canAddMilestones":true,"canLogTime":true,"canAccessDropbox":false,"canAddFiles":true,"canAccessGoogleDocs":false,"canAccessInvoiceTracking":true,"viewRiskRegister":true,"canAddTasks":true,"active":true,"canAccessOneDrive":false},"isProjectAdmin":true,"start-page":"projectoverview","notifyeveryone":false,"boardData":{}}],"categoryPath":[{"name":"All projects","id":"-1"}]}.projects

Task = (task) -> 
  @name = task
  return

TaskList = (name, tasks) ->
  @name = name
  @tasks = tasks #.map x -> new Task(x) # ko.observableArray(tasks)
  # @addTask = ((task) ->
  #   @tasks.push new Task(task)
  #   return
  # ).bind(this)
  return  

Project = (id, name, tasklists) ->
  @id = id
  @name = name
  @tasklists = tasklists
  @lateTasks = 4
  @dueTasks = 3
  @upcomingTasks = 6
  # @addList = (->
  #   @tasklists.push new TaskList()
  #   return
  # ).bind(this)
  @navigateToProject = ( ->
    # console.log("pop")
    return true
  ).bind(this)
  @counttasks = (->
    return 4
  ).bind(this)
  @progress = (->
    return 15
  ).bind(this)
  return  

# The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
viewModel = 
  background: 'blue'
  showPage: "dashboard-projects"
  showHeader: true
  username: 'Mark'
  tasksdue: 4
  currentProject: null
  projects: ko.observableArray()
  showAddTask: () ->
    this.showPage = "add-task"
  

showProject = (model, project) ->
  model.currentProject = project
  model.showPage = "tasks"
  console.log(model)

viewModel.projects = ko.observableArray(projects)


  
viewModel.currentProject = viewModel.projects[0]

ko.applyBindings viewModel

console.log(viewModel.projects[0])
# ---
# generated by js2coffee 2.2.0