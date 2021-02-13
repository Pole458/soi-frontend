'use strict'

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

	// Prepare
	$("#username").text(token.username);
	
	// Show
	$("#main-page").removeAttr("hidden");
}

//#endregion Main Page