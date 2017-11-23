class User

    constructor: ->
        @apiKey = 'twp_i18f5vbTkrPN6TshHN85vcktq3Lo'
        @domain = null
        @userId = null
        @userIcon = null

    auth: (apiKey,callback) ->
        if typeOf callback != 'function'
            callback = ->
                return
        
        opts = 
            method: 'GET'
            beforeSend: (xhr) ->
                authHeader = 'Basic ' + btoa(apiKey + ':x')
                xhr.setRequestHeader 'Authorization', authHeader
            crossDomain: true
            success: (data) ->
                localStorage.setItem 'auth', 'Basic ' + btoa(apiKey + ':x')
                @domain = data.account.URL
                @userId = data.account.id
                @userIcon = data.account['avatar-url']
                callback()
            error: (err) ->
                console.log err

        $.ajax "https://authenticate.teamwork.com/authenticate.json", opts
        return

    getUserInfo: (callback) ->
        if typeOf callback != 'function'
            callback = ->
                return
        opts =
            method: 'GET'
            beforeSend: (xhr) -> 
                xhr.setRequestHeader 'Authorization', localStorage.getItem('auth')
            crossDomain: true
            success: (data) ->
                callback()
            error: (data) ->
                console.log data

        $.ajax @domain + "/me.json", opts
        return