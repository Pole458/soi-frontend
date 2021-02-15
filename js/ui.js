'use strict'

/**
 * JSON object containing UI helper methods.
 */
const ui = {}

//#region Loading Page

ui.hideLoadingPage = () => {
	// Hide
	$("#loading-page").attr("hidden", true);
}

//#endregion

//#region LogIn Page

ui.hideLogInPage = () => {
	// Hide
	$("#login-form").attr("hidden", true);
}

ui.showLoginPage = () => {
	// Hide other pages
	ui.hideMainPage();
	ui.hideLoadingPage();
	
	// Show
	$("#login-form").removeAttr("hidden");

	ui.hideLogInError();
}

ui.showLogInError = (error) => {
	$("#login-error-message").css("visibility", "visible");
	$("#login-error-message").text(error); 
}

ui.hideLogInError = () => {
	$("#login-error-message").css("visibility", "hidden");
}

//#endregion LogInPage

//#region Main Page

ui.hideMainPage = () => {
	// Hide
	$("#main-page").attr("hidden", true);
}

ui.showMainPage = () => {
	// Hide other pages
	ui.hideLoadingPage();
	ui.hideLogInPage();

	// Change Path
	$("#path-project").attr("hidden", true);
	$("#path-dataset").attr("hidden", true);
	$("#path-record").attr("hidden", true);

	$("#username").text(token.username);

	$("#main-page-content").empty();

	// Show
	$("#main-page").removeAttr("hidden");

	// API call to fill the page
	api.getProjects();
}

ui.showProjects = (projects) => {
	
	if(!projects) return;

	projects.forEach(project => {

		// Create an item for the project

		const item = document.createElement("div");
		
		$(item)
		.attr("class", "project")
		.text(project.title)
		.click(ev => {
			api.getProject(project.title);
		})

		$("#main-page-content").append(item);
	});
}

ui.showProject = (project) => {

	// Change path
	$("#path-project").children("span").text(project.title);
	$("#path-project").removeAttr("hidden");
	$("#path-dataset").attr("hidden", true);
	$("#path-record").attr("hidden", true);

	// Change main page content
	$("#main-page-content").empty();
	
	const item = document.createElement("div");
	$(item).text(project.info)
	$("#main-page-content").append(item);

}

ui.logIn = () => {
	// Update token value stored in cookie
	token = getCookieJSON("token");
	ui.showMainPage();
}

ui.init = () => {

	// Add click event to login/signin buttons
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

	// Add click event to logout button
  $("#button-logout").click(ev => {
    ev.preventDefault();
    deleteCookie("token");

    ui.showLoginPage();
	});
	
	// Add click event to home path button
	$("#path-home").click(ev => {
		ev.preventDefault();
		ui.showMainPage();
	})
}

//#endregion Main Page