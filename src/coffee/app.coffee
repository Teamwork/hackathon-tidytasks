# This file is required by the index.html file and will
# be executed in the renderer process for that window.
# All of the Node.js APIs are available in this process.
# Define a "Person" class that tracks its own name and children, and has a method to add a new child
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
  projects: [
    new Project(1, 'Build Time Machine', [
      new TaskList('DeLorean', [
        'Construct Flux Capacitor'
        'Get Plutonium']
      )
    ])
    new Project(2, 'Load Dishwasher')
    new Project(3, 'Hackathon', [
      new TaskList('Thingie', [
        'Name Team'
        'Decide Project'
      ]),
      new TaskList('Yoke', [
        'Rename Team'
        'Undecide Project'
      ])
    ])
    new Project(4, 'Find Treasure')
  ]
  showAddTask: () ->
    this.showPage = "add-task"
  

showProject = (model, project) ->
  model.currentProject = project
  model.showPage = "tasks"
  console.log(model)
  
viewModel.currentProject = viewModel.projects[0]

ko.applyBindings viewModel

console.log(viewModel.projects[0])
# ---
# generated by js2coffee 2.2.0