
/**
 * JSON object containing api helper methods.
 */
const api = {}

/**
 * API that can be used to sign in as a new user and then login.
 * It requires valid username and password.
 * It also renews the token.
 * @param {string} username new username not yet registered
 * @param {string} password
 */
api.signIn = (username, password) => {
	$.ajax({
		method: 'post',
		url: 'api/signin',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			ui.logIn();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLogInError(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API that can be used to login given valid username and password.
 * It also renews the token.
 * @param {string} username registered username
 * @param {string} password
 */
api.logIn = (username, password) => {
	$.ajax({
		method: 'post',
		url: 'api/login',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			ui.logIn();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLogInError(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API call that can be used to login given a valid token.
 * It also renews the token. 
 */
api.loginToken = () => {
	$.ajax({
		method: 'post',
		url: 'api/login-token',
		success: function (data, textStatus) {
			ui.logIn();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLoginPage();
		}
	});
}

api.getProjects = () => {
	$.ajax({
		method: "get",
		url: "api/projects",
		success: function (data, textStatus) {
			const {projects} = data;
			ui.showProjects(projects);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLoginPage();
		}
	});
}

api.getProject = (title) => {
	$.ajax({
		method: "post",
		url: "api/project",
		data: { "title": title },
		success: function (data, textStatus) {
			const {project} = data;
			ui.showProject(project);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLoginPage();
		}
	});
}