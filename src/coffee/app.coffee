viewModel = ->
    @currentPage = ko.observable 'splash'
    @flatTasks  = ko.observableArray()
    @projects = ko.observableArray()
    @currentFilter = ko.observable()
    @currentProjectId = ko.observable()
    @totalTasks = ko.observable()
    @allTasklists = ko.observableArray()
    
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

    @currentPage.subscribe (value) ->
        @previousPage value
    , this, "beforeChange"

    @currentPage.subscribe (value) =>
        if ['dashboard'].indexOf(@currentPage()) > -1
            @showNav true
            @lightNav true
            @backButton false
        else if ['add-task','project','tasks-view'].indexOf(@currentPage()) > -1
            @showNav true
            @lightNav false
            @backButton true
        else   
            @showNav false
        iconColour()

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
        @getAllTasks(true)
        @getAllTasklists()
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
                @projects []
                @flatTasks []
                console.log data
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
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistName = task['todo-list-name']
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistId = task['todo-list-id']
                    
                    type = ''
                    start = task["start-date"]
                    due = task["due-date"]
                    if due != '' and due < @today
                        type = 'late'
                        projectsAssoc['p-' + task['project-id']].lateTasks++ 
                        taskTotal++
                    else if (start != '' and start <= @today) or (due != '' and due == @today)
                        type = 'today'
                        projectsAssoc['p-' + task['project-id']].currentTasks++ 
                        taskTotal++
                    else if start != '' and start > @today
                        type = 'upcoming'
                        projectsAssoc['p-' + task['project-id']].upcomingTasks++ 
                    
                    cleanTask = 
                        taskName: task.content
                        taskId: task.id
                        taskDescription: task.description
                        taskStartDate: start
                        taskDueDate: due
                        taskType: type
                        subtaskCount: task.predecessors.length
                        subtasks: task.predecessors
                        parentId: task.parentTaskId
                    
                    projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks.push cleanTask
                    projectsAssoc['p-' + task['project-id']].taskCount++
                    @flatTasks.push cleanTask
                
                for project of projectsAssoc
                    projectsAssoc[project].tasklists = []
                    for tasklist of projectsAssoc[project].tasklistsAssoc
                        projectsAssoc[project].tasklists.push projectsAssoc[project].tasklistsAssoc[tasklist]
                    delete projectsAssoc[project].tasklistsAssoc
                    @projects.push projectsAssoc[project]
                
                console.log @projects()
                
                @totalTasks taskTotal
                
                if goToDash
                    @currentPage 'dashboard'
                if typeof callback == 'function'
                    callback()
                return
            
        $.ajax @domain() + 'tasks.json', xhrOptions

    @getAllTasklists = () =>
        xhrOptions = 
            method: 'GET'
            data: 
                pageSize: 500
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                $.each data.tasklists, (i, tasklist) =>
                    tasklist = 
                        text: tasklist.projectName + ' / ' + tasklist.name
                        value: tasklist.id
                    @allTasklists.push(tasklist)

                $select = $('#tasklist-id').selectize
                    sortField: 'text'
                    options: @allTasklists()
                    placeholder: 'Select a tasklist...'
                @selectize = $select[0].selectize
                return

        $.ajax @domain() + 'tasklists.json', xhrOptions

    @showTasks = (opts) =>
        if opts.projectId
            @currentProjectId opts.projectId
        else 
            @currentProjectId ''
        if opts.filter
            @currentFilter opts.filter
        else
            @currentFilter 'all'
        
        @removeEmpties()
        @currentPage 'tasks-view'
        return

    @removeEmpties = () ->
        $('.task-list').each ->
            if $(this).find('.task').length is 0
                $(this).hide()
            else 
                $(this).show()
        return

    @showAddTask = (tasklistId) =>
        if tasklistId
            @selectize.setValue tasklistId
        @currentPage 'add-task'
        return

    @createTask = =>
        payload = 
            'todo-item':
                'responsible-party-id': @userId()
                'start-date': moment(new Date()).format('YYYYMMDD')
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
                    @showTasks 
                        projectId: @currentProjectId()
                return
        
        $.ajax @domain() + "tasklists/" + @selectize.getValue() + "/tasks.json", xhrOptions
        return

    @completeTask = (taskId) =>

        xhrOptions = 
            method: 'PUT'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) =>
                el = $('[data-task-id=' + taskId + ']')
                el.addClass('completed').delay(1000).animate({
                    height: 0,
                    opacity: 0
                }, =>
                    el.remove()
                    @getAllTasks false
                )
                return
        
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

iconColour = ->
    $('.svg-icon').each ->
        $e = $ this
        imgURL = $e.prop('src')
        if $e.hasClass('svg-icon-white')
            color = '#fff'
        else
            color = 'rgba(0,0,0,0.7)'
        
        $.get imgURL, (data) ->
            $svg = $(data).find('svg')
            $svg.find('path').attr('fill', color)
            $e.prop('src', "data:image/svg+xml;base64," + window.btoa($svg.prop('outerHTML')))
    return



ko.applyBindings viewModel