'use strict';

var token;

function getCookie(name) {
  var i, x, y, ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == name) {
          return unescape(y);
      }
  }
}

function getCookieJSON(name) {
  const cookie = getCookie(name);
  if(!cookie) return undefined;
  return (cookie.charAt(0) === '{') ? JSON.parse(cookie) : ((cookie.indexOf('j:{') === 0) ? JSON.parse(cookie.substr(2)) : cookie);
}

function deleteCookie(name) {
  if(getCookie(name)) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function init() {

  $("#login-form button").click(function(ev) {
    
    ev.preventDefault();
    ui.hideLogInError();

    const value = $(this).attr("value");

    const form = $('#login-form');
    const username = $(form).children("input[name='Username']").val()
    const password = $(form).children("input[name='Password']").val()
    form.trigger("reset");

    // Check user input
    if(!username || !password) {
      ui.showLogInError("Please insert valid username and password");
      return;
    };

    if(value == 'login') {
      api.logIn(username, password)
    } else if(value == 'signin') {
      api.signIn(username, password)
    }
  });

  $("#button-logout").click(ev => {
    ev.preventDefault();
    deleteCookie("token");

    ui.showLoginPage();
  });

  token = getCookieJSON("token");

  if(token) {
    api.checkToken(true);
  } else {
    ui.showLoginPage();
  }
};

init();
