var apiKey, auth, getUserInfo;

apiKey = 'twp_i18f5vbTkrPN6TshHN85vcktq3Lo';

auth = function(apiKey, callback) {
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
      localStorage.setItem('twurl', data.account.URL);
      return callback();
    },
    error: function(err) {
      return console.log(err);
    }
  };
  $.ajax("https://authenticate.teamwork.com/authenticate.json", opts);
};

getUserInfo = function(callback) {
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
  $.ajax(localStorage.getItem('twurl') + "/me.json", opts);
};
