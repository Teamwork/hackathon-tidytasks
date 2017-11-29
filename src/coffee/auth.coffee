class User

    constructor: ->
        @domain = null
        @userId = null
        @userIcon = null
        @userFirstname = null
        return

    auth: (opts) ->
        if typeof opts.success != 'function'
            opts.success = ->
                return

        if typeof opts.fail != 'function'
            opts.fail = ->
                return
        
        xhrOptions = 
            url: 'https://authenticate.teamwork.com/authenticate.json'
            method: 'GET'
            beforeSend: (xhr) ->
                if opts.authHeader
                    authHeader = opts.authHeader
                else if opts.apiKey
                    authHeader = 'Basic ' + btoa(opts.apiKey + ':x')
                xhr.setRequestHeader 'Authorization', authHeader
                return
            success: (data) =>
                if opts.authHeader
                    localStorage.setItem 'auth', opts.authHeader
                else if opts.apiKey
                    localStorage.setItem 'auth', 'Basic ' + btoa(opts.apiKey + ':x')
                @domain = data.account.URL
                @userId = data.account.userId
                @userIcon = data.account['avatar-url']
                @userFirstname = data.account.firstname
                opts.success()
                return
            error: (err) ->
                console.log err
                opts.fail()
                return

        $.ajax xhrOptions
        return