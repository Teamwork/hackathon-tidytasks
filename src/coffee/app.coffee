markedRenderer = new marked.Renderer()
markedRenderer.link = (href, title, text) ->
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'

marked.setOptions
    renderer: markedRenderer
    gfm: true
    tables: true
    breaks: false
    pedantic: false
    sanitize: true
    smartLists: true
    smartypants: false

viewModel = ->
    @currentPage = ko.observable 'splash'
    @tasks = ko.observableArray()
    @currentFilter = ko.observable 'all'
    @currentProjectId = ko.observable ''
    @allProjects = ko.observableArray()
    @allTasklists = ko.observableArray()

    @prevResponse = ''
    
    @creatingTask = ko.observable false
    @loadingTasks = ko.observable false
    
    @selectedTasklist = ko.observable()
    
    @searchTerm = ko.observable('').extend({ rateLimit: 500 })

    @User = new User()
    @domain = ko.observable()
    @userId = ko.observable()
    @userIcon = ko.observable()
    @userFirstname = ko.observable()
    
    @previousPage = ko.observable()
    @showNav = ko.observable false
    @lightNav = ko.observable false
    @loginError = ko.observable()

    @today = moment(new Date()).format 'YYYYMMDD'

    document.addEventListener 'mousemove', =>
        if @autoRefresh 
            clearInterval(@autoRefresh)
        @autoRefresh = @setInterval =>
            @getAllTasks() 
        , 60000

    @greeting = ko.pureComputed =>
        currentHour = moment(new Date()).format 'HH'
        if currentHour < 4 
            return 'Hey'
        else if currentHour < 12
            return 'Good morning'
        else if currentHour < 17
            return 'Good afternoon'
        else
            return 'Good evening'

    @totalTasks = ko.pureComputed =>
        return @tasks().length
    
    @totalLate = ko.pureComputed =>
        return (ko.utils.arrayFilter @tasks(), (task) ->
            return task.taskType is 'late'
        ).length
    
    @totalToday = ko.pureComputed =>
        return (ko.utils.arrayFilter @tasks(), (task) ->
            return task.taskType is 'today'
        ).length
    
    @totalUpcoming = ko.pureComputed =>
        return (ko.utils.arrayFilter @tasks(), (task) ->
            return task.taskType is 'upcoming'
        ).length
    
    @searchResults = ko.pureComputed =>
        if !@searchTerm() 
            return []
        else
            return ko.utils.arrayFilter @tasks(), (task) ->
                return task.taskName.toLowerCase().indexOf(searchTerm().toLowerCase()) > -1 or task.taskDescriptionRaw.toLowerCase().indexOf(searchTerm().toLowerCase()) > -1
    
    @currentPage.subscribe (value) =>
        @previousPage value
        return
    , this, 'beforeChange'

    @currentPage.subscribe (value) =>
        @showNav true
        if ['dashboard'].indexOf(value) > -1
            @lightNav true
            @currentFilter 'all'
            @currentProjectId ''
        else if ['add-task','project','tasks-view','search'].indexOf(value) > -1
            @lightNav false
        else
            @showNav false
        return

    @filteredTasks = ko.pureComputed =>
        return ko.utils.arrayFilter @tasks(), (task) =>
            if @currentProjectId() isnt '' and @currentProjectId() isnt task.projectId
                return false
            if @currentFilter() isnt 'all' and @currentFilter() isnt task.taskType
                return false
            return true
    , this

    @projects = ko.pureComputed =>
        projectIds = []
        projectArray = []
        ko.utils.arrayForEach @filteredTasks(), (task) =>
            if projectIds.indexOf(task.projectId) < 0
                project = 
                    projectId: task.projectId
                    projectName: task.projectName
                    taskCount: @getTaskCount task.projectId
                    lateCount: @getTaskCount task.projectId, 'late'
                    todayCount: @getTaskCount task.projectId, 'today'
                    upcomingCount: @getTaskCount task.projectId, 'upcoming'
                    tasklists: @getProjectTasklists task.projectId
                projectIds.push task.projectId
                projectArray.push project
        return projectArray
    , this
    
    @tasklists = ko.pureComputed =>
        tasklistIds = []
        tasklistsArray = []
        ko.utils.arrayForEach @filteredTasks(), (task) =>
            if tasklistIds.indexOf(task.tasklistId) < 0
                tasklist = 
                    tasklistId: task.tasklistId
                    tasklistName: task.tasklistName
                    projectId: task.projectId
                    tasks: @getTasklistTasks task.tasklistId
                tasklistIds.push task.tasklistId
                tasklistsArray.push tasklist
        return tasklistsArray
    , this

    @getProjectTasklists = (projectId) =>
        return ko.utils.arrayFilter @tasklists(), (tasklist) =>
            return tasklist.projectId is projectId
    
    @getTasklistTasks = (tasklistId) =>
        return ko.utils.arrayFilter @filteredTasks(), (task) =>
            return task.tasklistId is tasklistId

    @getTaskCount = (projectId,filter) =>
        taskCount = 0
        ko.utils.arrayForEach @tasks(), (task) =>
            if filter and filter isnt task.taskType
                return
            if task.projectId is projectId
                taskCount++
        return taskCount

    @currentProjectId.subscribe (value) =>
        if value
            document.getElementById('project-id').value = value
            @getTasklists value
        return

    @goBack = =>
        if @currentPage() == 'add-task' and @currentProjectId()
            @currentPage 'tasks-view'
        else
            @currentPage 'dashboard'

    @loginSuccess = =>
        @currentPage 'splash'
        @loginError ''
        @domain User.domain
        @userIcon User.userIcon
        @userFirstname User.userFirstname
        @userId User.userId
        @getAllTasks true
        @getAllProjects()
        return

    @loginFail = =>
        @currentPage 'login'
        @loginError 'There was an error logging in. Please double check your API key.'
        return

    @logout = ->
        localStorage.removeItem 'auth'
        window.location.reload true
        return

    @processLogin = ->
        @currentPage 'splash'
        @User.auth 
            apiKey: document.getElementById('API-key').value, 
            success: @loginSuccess
            fail: @loginFail
        return

    if localStorage.getItem 'auth'
        @User.auth 
            authHeader: localStorage.getItem 'auth'
            success: @loginSuccess
            fail: @loginFail       
    else
        @currentPage 'login'

    @getAllTasks = (goToDash,callback) =>
        if @loadingTasks() 
            return
        @loadingTasks true
        xhrOptions = 
            url: @domain() + 'tasks.json'
            type: 'GET'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            data: 
                'getFiles': false
                'responsible-party-ids': @userId()
                'stamp': new Date().getTime()
                'getSubTasks': 'yes'
                'sort': 'duedate'

            success: (data) =>
                if @prevResponse == JSON.stringify data
                    @loadingTasks false
                    return
                
                @prevResponse = JSON.stringify data
                cleanTasks = []
                for task in data['todo-items']
                    if task['start-date'] or task['due-date']
                    
                        type = ''
                        start = task['start-date']
                        due = task['due-date']
                        
                        if due != '' and due < @today
                            type = 'late'
                        else if (start != '' and start <= @today) or (due != '' and due == @today)
                            type = 'today'
                        else if (start != '' and start > @today) or start == '' and due > @today
                            type = 'upcoming'
                        
                        cleanTask = 
                            taskName: task.content
                            taskId: task.id
                            tasklistId: task['todo-list-id']
                            tasklistName: task['todo-list-name']
                            projectId: task['project-id']
                            projectName: task['project-name']
                            taskDescription: marked(task.description)
                            taskDescriptionRaw: task.description
                            taskStartDate: start
                            taskDueDate: due
                            taskType: type
                            subtaskCount: task.predecessors.length
                            subtasks: task.predecessors
                            parentId: task.parentTaskId
                            attachmentCount: task['attachments-count']
                            commentCount: task['comments-count']
                    
                        cleanTasks.push cleanTask
                
                @tasks cleanTasks 
                
                if goToDash
                    @currentPage 'dashboard'
                if typeof callback == 'function'
                    callback()
                
                @loadingTasks false
                return
            
        $.ajax xhrOptions

    @getAllProjects = () =>
        xhrOptions = 
            url: @domain() + 'projects.json'
            data: 
                pageSize: 500
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                ko.utils.arrayForEach data.projects, (project) =>
                    project = 
                        text: project.name
                        value: project.id
                    @allProjects.push(project)
                @getTasklists document.getElementById('project-id').value
                return

        $.ajax xhrOptions
        return

    @getTasklists = (projectId) =>
        @allTasklists [{id:'', text:'Loading tasklists...'}]
        xhrOptions = 
            url: @domain() + 'projects/' + projectId + '/tasklists.json'
            data: 
                pageSize: 500
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                @allTasklists []
                ko.utils.arrayForEach data.tasklists, (tasklist) =>
                    tasklist = 
                        text: tasklist.name
                        value: tasklist.id
                    @allTasklists.push(tasklist)
                @allTasklists.push 
                    text: 'New tasklist...'
                    value: '-1'
                return

        $.ajax xhrOptions
        return

    @createTask = =>
        startDateVal = document.getElementById('start-date').value
        dueDateVal = document.getElementById('due-date').value
        startDate = if startDateVal then moment(startDateVal).format 'YYYYMMDD' else ''
        dueDate = if dueDateVal then moment(dueDateVal).format 'YYYYMMDD' else ''

        taskName = document.getElementById('task-name').value
        tasklistId = document.getElementById('tasklist-id').value
        tasklistName = if document.getElementById('tasklist-name') then document.getElementById('tasklist-name').value else null
        projectId = document.getElementById('project-id').value
        
        if dueDate and (startDate > dueDate)
            alert 'The start date can\'t be before the due date'
            return false
        taskPayload = 
            'todo-item':
                'responsible-party-id': @userId()
                'start-date': startDate
                'due-date': dueDate
                'content': taskName
        taskXhrOptions = 
            url: @domain() + 'tasklists/' + tasklistId + '/tasks.json'
            type: 'POST'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            contentType: 'application/json'
            dataType: 'json'
            data: JSON.stringify taskPayload
                
            success: (data) =>
                @getAllTasks false, ->
                    @getAllProjects()
                    if @currentProjectId()
                        @currentPage 'tasks-view'
                    else 
                        @currentPage 'dashboard'
                    @creatingTask false
                return
        
        @creatingTask true
        
        if tasklistName 
            tasklistPayload = 
                'todo-list':
                    'name': tasklistName
            tasklistXhrOptions =   
                url: @domain() + 'projects/' + projectId + '/tasklists.json '
                type: 'POST'
                beforeSend: (xhr) ->
                    xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                    return
                contentType: 'application/json'
                dataType: 'json'
                data: JSON.stringify tasklistPayload
                success: (data) =>
                    taskXhrOptions.url = @domain() + 'tasklists/' + data.TASKLISTID + '/tasks.json'
                    $.ajax taskXhrOptions
                    return
            $.ajax tasklistXhrOptions
        else
            $.ajax taskXhrOptions
        return

    @completeTask = (taskId) =>
        el = document.querySelector('[data-task-id="' + taskId + '"]')
        el.classList.add('completed')

        xhrOptions = 
            url: @domain() + 'tasks/' + taskId + '/complete.json'
            type: 'PUT'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                @getAllTasks()
                return
            error: ->
                el.classList.remove('completed')
                alert 'There was an error completing the task'
        
        $.ajax xhrOptions
        return

    @highlightSubtasks = (taskId) =>
        ko.utils.arrayForEach @tasks(), (task) =>
            if parseInt(task.parentId) == parseInt(taskId)
                taskEl = document.querySelector('[data-task-id="' + task.taskId + '"]')
                if taskEl
                    taskEl.classList.toggle('highlight')
            return
        return

    @toggleDetails = (data,event) ->
        detailsEl = event.target.nextSibling
        if detailsEl
            detailsEl.classList.toggle('hidden')
        return

    @initiated = true
    
    return

ko.applyBindings viewModel