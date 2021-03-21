'use strict'

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
api.signIn = ({username, password, success, error}) => {
	$.ajax({
		method: 'post',
		url: 'api/signin',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			success();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API that can be used to login given valid username and password.
 * It also renews the token.
 * @param {string} username registered username
 * @param {string} password
 */
api.logIn = ({username, password, success, error}) => {
	$.ajax({
		method: 'post',
		url: 'api/login',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			success();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API call that can be used to login given a valid token.
 * It also renews the token. 
 */
api.loginWithToken = ({success, error}) => {
	$.ajax({
		method: 'post',
		url: 'api/login-token',
		success: function (data, textStatus) {
			success();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	});
}

api.getProjects = ({success, error}) => {
	$.ajax({
		method: "get",
		url: "api/projects",
		success: function (data, textStatus) {
			const projects = data;
			success(projects);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	});
}

api.getProject = ({id, success, error}) => {
	$.ajax({
		method: "get",
		url: "api/project/" + id,
		success: function (data, textStatus) {
			const project = data;
			success(project);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	});
}

api.getRecords = ({id, success, error}) => {
	$.ajax({
		method: "get",
		url: "api/project/" + id + "/records",
		success: function (data, textStatus) {
			const records = data;
			success(records);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	});
}

api.getRecord = ({id, success, error}) => {
	$.ajax({
		method: "get",
		url: "api/record/" + id,
		success: function (data, textStatus) {
			const record = data;
			success(record);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	});
}

api.addProject = ({project_name, success, error}) => {
	$.ajax({
		method: "post",
		url: "api/project",
		success: function (data, textStatus) {
			const project = data;
			success(project);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			error();
		}
	})
}