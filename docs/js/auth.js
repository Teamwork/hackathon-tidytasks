var User;

User = class User {
  constructor() {
    this.domain = null;
    this.userId = null;
    this.userIcon = null;
    this.userFirstname = null;
    return;
  }

  auth(opts) {
    var xhrOptions;
    if (typeof opts.success !== 'function') {
      opts.success = function() {};
    }
    if (typeof opts.fail !== 'function') {
      opts.fail = function() {};
    }
    xhrOptions = {
      method: 'GET',
      beforeSend: function(xhr) {
        var authHeader;
        if (opts.authHeader) {
          authHeader = opts.authHeader;
        } else if (opts.apiKey) {
          authHeader = 'Basic ' + btoa(opts.apiKey + ':x');
        }
        xhr.setRequestHeader('Authorization', authHeader);
      },
      crossDomain: true,
      success: (data) => {
        if (opts.authHeader) {
          localStorage.setItem('auth', opts.authHeader);
        } else if (opts.apiKey) {
          localStorage.setItem('auth', 'Basic ' + btoa(opts.apiKey + ':x'));
        }
        this.domain = data.account.URL;
        this.userId = data.account.userId;
        this.userIcon = data.account['avatar-url'];
        this.userFirstname = data.account.firstname;
        opts.success();
      },
      error: function(err) {
        console.log(err);
        opts.fail();
      }
    };
    $.ajax("https://authenticate.teamwork.com/authenticate.json", xhrOptions);
  }

};
