markedRenderer = new marked.Renderer()
markedRenderer.link = (href, title, text) ->
    return '<a target="_blank" href="' + href + '" title="' + title + '" onclick="event.stopPropagation(); if(window.electronShell){electronShell.openExternal(this.href); return false;}; return true;">' + text + '</a>'

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
    @currentFilter = ko.observable 
        type: 'all'
        projectId: ''
    @allProjects = ko.observableArray()
    @allTasklists = ko.observableArray()

    @prevResponse = ''
    @startDate = ko.observable moment(new Date()).format 'YYYY-MM-DD'
    @dueDate = ko.observable ''
    
    @initDatePickers = =>
        @startDatePicker = flatpickr '#start-date', {altInput: true, defaultDate: 'today'}
        @dueDatePicker = flatpickr '#due-date', {altInput: true, minDate: 'today'} 
        @dueDatePicker.clear()
        @startDate.subscribe (date) =>
            @dueDatePicker.set 'minDate', date
            return
        return

    @creatingTask = ko.observable false
    @loadingTasks = ko.observable false
    
    @selectedTasklist = ko.observable()
    
    @searchTerm = ko.observable('').extend
        rateLimit: 500
        
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
            @currentFilter 
                type: 'all'
                projectId: ''
        else if ['add-task','project','tasks-view','search'].indexOf(value) > -1
            @lightNav false
        else
            @showNav false
        return

    @filteredTasks = ko.pureComputed =>
        return ko.utils.arrayFilter @tasks(), (task) =>
            if task.hasParent
                return false
            if @currentFilter().projectId isnt '' and @currentFilter().projectId isnt task.projectId
                return false
            if @currentFilter().type isnt 'all' and @currentFilter().type isnt task.taskType
                return false
            return true
    , this 
    .extend 
        rateLimit: 
            timeout: 0
            method: "notifyWhenChangesStop"

    @filteredTasks.subscribe (tasks) =>
        if tasks.length is 0 and @currentFilter().projectId isnt '' and @currentFilter().type isnt 'all'
            @currentFilter
                type: 'all'
                projectId: @currentFilter().projectId
        else if tasks.length is 0 and @currentFilter().projectId isnt '' and @currentFilter().type is 'all'
            @currentFilter
                type: 'all'
                projectId: ''
        else if tasks.length is 0 and @currentFilter().projectId is '' and @currentFilter().type is 'all'
            @currentFilter
                type: 'all'
                projectId: ''
            @currentPage 'dashboard'
        return


    @projects = ko.pureComputed =>
        projectIds = []
        projectArray = []
        for task in @tasks()
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
        for task in @tasks()
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
        for task in @tasks()
            unless filter and filter isnt task.taskType
                if task.projectId is projectId
                    taskCount++
        return taskCount

    @currentFilter.subscribe (value) =>
        if value.projectId isnt ''
            document.getElementById('project-id').value = value.projectId
            @getTasklists value.projectId
        return

    @goBack = =>
        if @currentPage() == 'add-task' and @currentFilter().projectId isnt ''
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
                rawTasks = data['todo-items']
                cleanTasks = []
                taskIds = []
                for task in rawTasks
                    taskIds.push task.id
                
                for task in rawTasks
                    
                    if task['start-date'] or task['due-date']
                        type = ''
                        start = task['start-date']
                        due = task['due-date']

                        hasParent = taskIds.indexOf(parseInt(task.parentTaskId)) > -1
                        
                        if due != '' and due < @today
                            type = 'late'
                        else if (start != '' and start <= @today) or (due != '' and due == @today)
                            type = 'today'
                        else if (start != '' and start > @today) or start == '' and due > @today
                            type = 'upcoming'

                        cleanTask = 
                            taskName: marked.inlineLexer(task.content,['links'])
                            taskNameRaw: task.content
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
                            parentId: task.parentTaskId
                            attachmentCount: task['attachments-count']
                            commentCount: task['comments-count']
                            hasParent: hasParent
                    
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
                projects = []
                for project in data.projects
                    project = 
                        text: project.name
                        value: project.id
                    projects.push project
                @allProjects projects
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
                tasklists = []
                for tasklist in data.tasklists
                    tasklist = 
                        text: tasklist.name
                        value: tasklist.id
                    tasklists.push tasklist
                @allTasklists tasklists
                @allTasklists.push 
                    text: 'New tasklist...'
                    value: '-1'
                return

        $.ajax xhrOptions
        return

    @createTask = =>
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
                'start-date': if @startDate() then moment(@startDate()).format 'YYYYMMDD' else ''
                'due-date': if @dueDate() then moment(@dueDate()).format 'YYYYMMDD' else ''
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
                    if @currentFilter().projectId isnt ''
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
        taskEl = document.querySelectorAll('[data-task-id="' + taskId + '"]')
        for el in taskEl
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
                for el in taskEl
                    el.classList.remove('completed')
                alert 'There was an error completing the task'
        
        $.ajax xhrOptions
        return

    @getSubtasks = (taskId) =>
        return ko.utils.arrayFilter @tasks(), (task) ->
            return parseInt(task.parentId) is parseInt(taskId)

    @toggleDetails = (taskId) ->
        detailsEl = document.querySelectorAll('[data-task-id="' + taskId + '"] > .task-body > .task-details')
        if detailsEl.length
            for el in detailsEl
                el.classList.toggle('hidden')
        return

    @initiated = true
    
    return

ko.applyBindings viewModel
initDatePickers()

$.ajax 
    url: 'components/task.html'
    success: (html) ->
        ko.components.register 'task',
            template: html
    contentType: 'text/html'
