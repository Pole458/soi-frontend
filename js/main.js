'use strict';

(function () {

  var token;
 
  function uiShowLoginPage() {
    // Hide
    $("#main-page").attr("hidden", true);
    
    // Show
    $("#login-form").removeAttr("hidden");

    uiHideLogInError();
  }

  function uiShowLogInError(error) {
    $("#login-error-message").css("visibility", "visible");
    $("#login-error-message").text(error); 
  }

  function uiHideLogInError() {
    $("#login-error-message").css("visibility", "hidden");
  }

  function uiShowMainPage() {
    console.debug(token);
    // Hide
    $("#login-form").attr("hidden", true);

    // Prepare
    $("#username").text(token.username);
    
    // Show
    $("#main-page").removeAttr("hidden");
  }

  function apiLogIn(username, password) {
    $.ajax({
      method: 'post',
      url: 'api/login',
      data: {'username': username, 'password': password},
      success: function(data, textStatus) {
        token = data.token;
        uiShowMainPage();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        uiShowLogInError(jqXHR.responseJSON.error);
      }
    });
  }

  function apiSignIn(username, password) {
    $.ajax({
      method: 'post',
      url: 'api/signin',
      data: {'username': username, 'password': password},
      success: function(data, textStatus) {
        console.debug(data);
        token = data.token;
        uiShowMainPage();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        uiShowLogInError(jqXHR.responseJSON.error);
      }
    });
  }

  function init() {

    $("#login-form button").click(function(ev) {
      
      ev.preventDefault();
      uiHideLogInError();

      const value = $(this).attr("value");

      const form = $('#login-form');
      const username = $(form).children("input[name='Username']").val()
      const password = $(form).children("input[name='Password']").val()
      form.trigger("reset");

      // Check user input
      if(!username || !password) {
        uiShowLogInError("Please insert valid username and password");
        return;
      };

      if(value == 'login') {
        apiLogIn(username, password)
      } else if(value == 'signin') {
        apiSignIn(username, password)
      }
    });
  };

  init();

})();