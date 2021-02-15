'use strict';

/**
 * Auth token required in order to login and use the API.
 * It's stored as a cookie and is a json object that contains
 * {username, time, hash}.
 * Can be requested/renewed from the server with the following api calls
 *  /login
 *  /signin
 *  /check-token
 */
var token;

/**
 * Returns a cookie from its name.
 * @param {string} name
 */
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

/**
 * Returns a cookie as a json object given its name.
 * May return undefined if no cookie is found.
 * @param {string} name
 */
function getCookieJSON(name) {
  const cookie = getCookie(name);
  if(!cookie) return undefined;
  return (cookie.charAt(0) === '{') ? JSON.parse(cookie) : ((cookie.indexOf('j:{') === 0) ? JSON.parse(cookie.substr(2)) : cookie);
}

/**
 * Deletes a cookie given its name.
 * @param {string} name
 */
function deleteCookie(name) {
  if(getCookie(name)) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function init() {

  // Init UI
  ui.init()

  // Retrieve auth token stored in cookie
  token = getCookieJSON("token");

  if(token) {
    // If a token is found, try to login with it
    api.loginToken();
  } else {
    // If no token is found, show login page
    ui.showLoginPage();
  }
};

init();
