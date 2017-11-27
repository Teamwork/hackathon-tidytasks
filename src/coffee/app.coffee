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
    @flatTasks  = ko.observableArray()
    @projectTree = ko.observableArray()
    @currentFilter = ko.observable()
    @currentProjectId = ko.observable()
    @totalTasks = ko.observable()
    @allProjects = ko.observableArray()
    @allTasklists = ko.observableArray()
    @creatingTask = ko.observable false
    @loadingTasks = ko.observable false
    @selectedTasklist = ko.observable()
    @searchTerm = ko.observable().extend({ rateLimit: 500 })
    @searchResults = ko.observableArray()
    
    @User = new User()
    @domain = ko.observable()
    @userId = ko.observable()
    @userIcon = ko.observable()
    @userFirstname = ko.observable()
    
    @previousPage = ko.observable()
    @showNav = ko.observable false
    @lightNav = ko.observable false
    @backButton = ko.observable false
    @loginError = ko.observable()

    @today = moment(new Date()).format('YYYYMMDD')
    @tasklistSelect = null

    $(window).bind 'mousemove touchmove keypress', =>
        if @autoRefresh 
            clearInterval(@autoRefresh)
        @autoRefresh = @setInterval =>
            @getAllTasks() 
        , 60000

    $("#start-date").pickadate()
    $("#due-date").pickadate()

    @currentPage.subscribe (value) ->
        @previousPage value
        return
    , this, "beforeChange"

    @currentPage.subscribe (value) =>
        if ['dashboard'].indexOf(value) > -1
            $('html').addClass 'blue-bg'
            @showNav true
            @lightNav true
            @backButton false
        else if ['add-task','project','tasks-view','search'].indexOf(value) > -1
            @showNav true
            @lightNav false
            @backButton true
            $('html').removeClass 'blue-bg'
        else
            $('html').addClass 'blue-bg'
            @showNav false
        setTimeout ->
            if value == 'search'
                document.getElementById('search-term').focus()
            else if value == 'add-task'
                document.getElementById('task-name').focus()
        , 50
        return

    @currentProjectId.subscribe (value) =>
        if value
            $('#project-id').val value
            @getProjectTasklists value
        return

    @searchTerm.subscribe (searchTerm) =>
        @searchResults []
        $.each @flatTasks(), (i,task) =>
            if task.taskName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                @searchResults.push task
        return

    @goBack = =>
        if @currentPage() == 'add-task' and @currentProjectId()
            @currentPage 'tasks-view'
        else
            @currentProjectId null
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
            apiKey: $('#API-key').val(), 
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
            method: 'GET'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            data: 
                'getFiles': false
                'responsible-party-ids': @userId()
                'stamp': new Date().getTime()
                'getSubTasks': 'yes'

            success: (data) =>
                @projectTree []
                @flatTasks []
                tasks = data['todo-items']
                taskTotal = 0
                projectsAssoc = {}
                
                $.each tasks, (i, task) =>
                    if !task['start-date'] and !task['due-date']
                        return true
                    if projectsAssoc['p-' + task['project-id']] is undefined
                        projectsAssoc['p-' + task['project-id']] = {}
                        projectsAssoc['p-' + task['project-id']].taskCount = 0
                        projectsAssoc['p-' + task['project-id']].lateTasks = 0
                        projectsAssoc['p-' + task['project-id']].currentTasks = 0
                        projectsAssoc['p-' + task['project-id']].upcomingTasks = 0
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc = {}
                        projectsAssoc['p-' + task['project-id']].projectName = task['project-name']
                        projectsAssoc['p-' + task['project-id']].projectId = task['project-id']
                    if projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] is undefined
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] = {}
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks = []
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].private = task['tasklist-private']
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistName = task['todo-list-name']
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistId = task['todo-list-id']
                    
                    type = ''
                    start = task["start-date"]
                    due = task["due-date"]
                    if due != '' and due < @today
                        type = 'late'
                        projectsAssoc['p-' + task['project-id']].lateTasks++ 
                    else if (start != '' and start <= @today) or (due != '' and due == @today)
                        type = 'today'
                        projectsAssoc['p-' + task['project-id']].currentTasks++ 
                    else if start != '' and start > @today
                        type = 'upcoming'
                        projectsAssoc['p-' + task['project-id']].upcomingTasks++ 
                    
                    cleanTask = 
                        taskName: task.content
                        taskId: task.id
                        taskDescription: marked(task.description)
                        taskDescriotionRaw: task.description
                        taskStartDate: start
                        taskDueDate: due
                        taskType: type
                        subtaskCount: task.predecessors.length
                        subtasks: task.predecessors
                        parentId: task.parentTaskId
                        attachmentCount: task['attachments-count']
                        commentCount: task['comments-count']
                    
                    projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks.push cleanTask
                    projectsAssoc['p-' + task['project-id']].taskCount++
                    @flatTasks.push cleanTask
                    taskTotal++
                
                for project of projectsAssoc
                    projectsAssoc[project].tasklists = []
                    for tasklist of projectsAssoc[project].tasklistsAssoc
                        projectsAssoc[project].tasklists.push projectsAssoc[project].tasklistsAssoc[tasklist]
                    delete projectsAssoc[project].tasklistsAssoc
                    @projectTree.push projectsAssoc[project]
                                
                @totalTasks taskTotal
                
                if goToDash
                    @currentPage 'dashboard'
                if typeof callback == 'function'
                    callback()
                @loadingTasks false
                return
            
        $.ajax @domain() + 'tasks.json', xhrOptions

    @getAllProjects = () =>
        xhrOptions = 
            method: 'GET'
            data: 
                pageSize: 500
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                $.each data.projects, (i, project) =>
                    project = 
                        text: project.name
                        value: project.id
                    @allProjects.push(project)
                @getProjectTasklists $("#project-id").val()
                return

        $.ajax @domain() + 'projects.json', xhrOptions
        return

    @getProjectTasklists = (projectId) =>
        @allTasklists [{id:'',text:'Loading tasklists...'}]
        xhrOptions = 
            method: 'GET'
            data: 
                pageSize: 500
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                @allTasklists []
                $.each data.tasklists, (i, tasklist) =>
                    tasklist = 
                        text: tasklist.name
                        value: tasklist.id
                    @allTasklists.push(tasklist)
                @allTasklists.push 
                    text: 'New tasklist...'
                    value: '-1'
                return

        $.ajax @domain() + 'projects/' + projectId + '/tasklists.json', xhrOptions
        return

    @showTasks = (opts) =>
        if opts and opts.projectId
            @currentProjectId opts.projectId
        else 
            @currentProjectId ''
        if opts and opts.filter
            @currentFilter opts.filter
        else
            @currentFilter 'all'
        
        @currentPage 'tasks-view'
        @removeEmpties()
        return

    @removeEmpties = () ->
        if $('.task').length is 0 and $('.project-status').length
            @currentFilter 'all'
        else if $('.task').length is 0
            @currentPage 'dashboard'
        
        $('.task-list').each ->
            if $(this).find('.task').length is 0
                $(this).hide()
            else 
                $(this).show()
        return

    @createTask = =>
        startDate = if $('#start-date').val() then moment($('#start-date').val(),"DD MMMM, YYYY").format("YYYYMMDD") else ''
        dueDate = if $('#due-date').val() then moment($('#due-date').val(),"DD MMMM, YYYY").format("YYYYMMDD") else ''
        
        if dueDate and (startDate > dueDate)
            alert 'The start date can\'t be before the due date'
            return false
        payload = 
            'todo-item':
                'responsible-party-id': @userId()
                'start-date': startDate
                'due-date': dueDate
                'content': $('#task-name').val()
        xhrOptions = 
            method: 'POST'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            contentType: "application/json"
            dataType: 'json'
            data: JSON.stringify payload
                
            success: (data) =>
                @getAllTasks false, ->
                    if @currentProjectId()
                        @showTasks 
                            projectId: @currentProjectId()
                    else 
                        @currentPage 'dashboard'
                    @creatingTask false
                return
        
        @creatingTask true
        
        if $('#tasklist-name').val()
            tasklistPayload = 
                'todo-list':
                    'name': $('#tasklist-name').val()
            tasklistXhrOptions = 
                method: 'POST'
                beforeSend: (xhr) ->
                    xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                    return
                contentType: "application/json"
                dataType: 'json'
                data: JSON.stringify tasklistPayload
                success: (data) =>
                    $.ajax @domain() + "tasklists/" + data.TASKLISTID + "/tasks.json", xhrOptions
                    return
            $.ajax @domain() + "projects/" + $('#project-id').val() + "/tasklists.json", tasklistXhrOptions
        else
            $.ajax @domain() + "tasklists/" + $('#tasklist-id').val() + "/tasks.json", xhrOptions
        return

    @completeTask = (taskId) =>
        el = $('[data-task-id=' + taskId + ']')
        el.addClass('completed')

        xhrOptions = 
            method: 'PUT'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                el.delay(1000).animate({
                    height: 0,
                    opacity: 0
                }, =>
                    el.remove()
                    @getAllTasks false, @removeEmpties
                )
                return
            error: ->
                el.removeClass('completed')
                alert 'There was an error completing the task'
        
        $.ajax @domain() + "tasks/" + taskId + "/complete.json", xhrOptions
        return

    @highlightSubtasks = (taskId) =>
        $.each @flatTasks(), (i, task) =>
            if parseInt(task.parentId) == parseInt(taskId)
                $('[data-task-id=' + task.taskId + "]").toggleClass('highlight')
            return
        return

    @toggleDetails = (data,event) ->
        $(event.target).next('.task-details').toggleClass('hidden')
        return

    return



ko.applyBindings viewModel