viewModel = ->
    @currentPage = ko.observable 'splash'
    @allTasks = ko.observableArray()
    @projects = ko.observableArray()
    @currentProject = ko.observable()
    @currentProjectId = ko.observable()
    @currentTasklist = ko.observable()
    @loginError = ko.observable()
    @User = new User()
    @domain = ko.observable()
    @userId = ko.observable()
    @userIcon = ko.observable()
    @userFirstname = ko.observable()
    @previousPage = ko.observable()
    @showNav = ko.observable false
    @lightNav = ko.observable false
    @backButton = ko.observable false
    @totalTasks = ko.observable()

    @currentPage.subscribe (value) ->
        @previousPage value
    , this, "beforeChange"

    @currentPage.subscribe (value) =>
        if ['dashboard'].indexOf(@currentPage()) > -1
            @showNav true
            @lightNav true
            @backButton false
        else if ['add-task','project','project-view'].indexOf(@currentPage()) > -1
            @showNav true
            @lightNav false
            @backButton true
        else   
            @showNav false
        iconColour()

    @goBack = =>
        if @currentPage() == 'add-task'
            @currentPage 'project-view'
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
        @projects []
        @allTasks []
        xhrOptions = 
            method: 'GET'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            data: 
                'filter': 'today'
                'getFiles': false
                'responsible-party-ids': @userId()
                'stamp': new Date().getTime()
            success: (data) =>
                console.log data
                tasks = data['todo-items']
                @totalTasks tasks.length
                projectsAssoc = {}
                $.each tasks, (i, task)->
                    if projectsAssoc['p-' + task['project-id']] is undefined
                        projectsAssoc['p-' + task['project-id']] = {}
                        projectsAssoc['p-' + task['project-id']].taskCount = 0
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc = {}
                        projectsAssoc['p-' + task['project-id']].projectName = task['project-name']
                        projectsAssoc['p-' + task['project-id']].projectId = task['project-id']
                    if projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] is undefined
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']] = {}
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks = []
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistName = task['todo-list-name']
                        projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasklistId = task['todo-list-id']
                    cleanTask = 
                        taskName: task.content
                        taskId: task.id
                        taskDescription: task.description
                    projectsAssoc['p-' + task['project-id']].tasklistsAssoc['tl-' + task['todo-list-id']].tasks.push cleanTask

                    projectsAssoc['p-' + task['project-id']].taskCount++
                for project of projectsAssoc
                    projectsAssoc[project].tasklists = []
                    for tasklist of projectsAssoc[project].tasklistsAssoc
                        projectsAssoc[project].tasklists.push projectsAssoc[project].tasklistsAssoc[tasklist]
                    @projects.push projectsAssoc[project]
                console.log @projects()
                if goToDash
                    @currentPage 'dashboard'
                if typeof callback == 'function'
                    callback()
                return
            
        $.ajax @domain() + 'tasks.json', xhrOptions

    @showProject = (projectId) =>
        @currentProjectId projectId
        for project in @projects()
            if project.projectId == projectId
                @currentPage 'project-view'
                @currentProject project
        console.log @currentProject()
        return

    @createTask = =>
        console.log @currentTasklist()
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
                    @showProject @currentProjectId()
                return
        $.ajax @domain() + "tasklists/" + @currentTasklist() + "/tasks.json", xhrOptions
        return

    @completeTask = (taskId) =>
        xhrOptions = 
            method: 'PUT'
            beforeSend: (xhr) ->
                xhr.setRequestHeader 'Authorization', localStorage.getItem 'auth'
                return
            success: (data) ->
                console.log data
                $('[data-task-id=' + taskId + ']').addClass('completed').delay(1000).animate({
                    height: 0,
                    opacity: 0
                }, ->
                    $(this).remove()
                )
                return
        $.ajax @domain() + "tasks/" + taskId + "/complete.json", xhrOptions
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