var User;

User = class User {
  constructor() {
    this.apiKey = 'twp_i18f5vbTkrPN6TshHN85vcktq3Lo';
    this.domain = null;
    this.userId = null;
    this.userIcon = null;
  }

  auth(apiKey, callback) {
    var opts;
    if (typeOf(callback !== 'function')) {
      callback = function() {};
    }
    opts = {
      method: 'GET',
      beforeSend: function(xhr) {
        var authHeader;
        authHeader = 'Basic ' + btoa(apiKey + ':x');
        return xhr.setRequestHeader('Authorization', authHeader);
      },
      crossDomain: true,
      success: function(data) {
        localStorage.setItem('auth', 'Basic ' + btoa(apiKey + ':x'));
        this.domain = data.account.URL;
        this.userId = data.account.id;
        this.userIcon = data.account['avatar-url'];
        return callback();
      },
      error: function(err) {
        return console.log(err);
      }
    };
    $.ajax("https://authenticate.teamwork.com/authenticate.json", opts);
  }

  getUserInfo(callback) {
    var opts;
    if (typeOf(callback !== 'function')) {
      callback = function() {};
    }
    opts = {
      method: 'GET',
      beforeSend: function(xhr) {
        return xhr.setRequestHeader('Authorization', localStorage.getItem('auth'));
      },
      crossDomain: true,
      success: function(data) {
        return callback();
      },
      error: function(data) {
        return console.log(data);
      }
    };
    $.ajax(this.domain + "/me.json", opts);
  }

};
