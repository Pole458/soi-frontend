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
api.signIn = ({ username, password, onSuccess, onError }) => {
	$.ajax({
		method: 'post',
		url: 'api/signin',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API that can be used to login given valid username and password.
 * It also renews the token.
 * @param {string} username registered username
 * @param {string} password
 */
api.logIn = ({ username, password, onSuccess, onError }) => {
	$.ajax({
		method: 'post',
		url: 'api/login',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError(jqXHR.responseJSON.error);
		}
	});
}

/**
 * API call that can be used to login given a valid token.
 * It also renews the token. 
 */
api.loginWithToken = ({ onSuccess, onError }) => {
	$.ajax({
		method: 'post',
		url: 'api/login-with-token',
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	});
}

api.getProjects = ({ onSuccess, onError }) => {
	$.ajax({
		method: "get",
		url: "api/projects",
		success: function (data, textStatus) {
			const projects = data;
			onSuccess(projects);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	});
}

api.getProject = ({ id, onSuccess, onError }) => {
	$.ajax({
		method: "get",
		url: "api/project/" + id,
		success: function (data, textStatus) {
			const project = data;
			onSuccess(project);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	});
}

api.getRecords = ({ id, onSuccess, onError }) => {
	$.ajax({
		method: "get",
		url: "api/project/" + id + "/records",
		success: function (data, textStatus) {
			const records = data;
			onSuccess(records);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	});
}

api.getRecord = ({ id, onSuccess, onError }) => {
	$.ajax({
		method: "get",
		url: "api/record/" + id,
		success: function (data, textStatus) {
			const record = data;
			onSuccess(record);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	});
}

api.addProject = ({ title, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/project",
		data: { 'title': title },
		success: function (data, textStatus) {
			const project = data;
			onSuccess(project);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError(jqXHR.responseJSON.error);
		}
	})
}

api.getEventsForProject = ({project_id, onSuccess, onError}) => {
	$.ajax({
		method: "get",
		url: "api/project/" + project_id + "/events",
		success: function (data, textStatus) {
			const events = data;
			onSuccess(events);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError(jqXHR.responseJSON.error);
		}
	})
}

api.getEventsForRecord = ({record_id, onSuccess, onError}) => {
	$.ajax({
		method: "get",
		url: "api/record/" + record_id + "/events",
		success: function(data, textStatus) {
			const events = data;
			onSuccess(events);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			onError(jqXHR.responseJSON.error)
		}
	})
}


api.addRecord = ({ project_id, input, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/record",
		data: { 'project_id': project_id, 'input': input },
		success: function (data, textStatus) {
			const record = data;
			onSuccess(record);
		}
	})
}

api.removeProject = ({ project_id, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/remove-project",
		data: { 'project_id': project_id },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.removeRecord = ({ record_id, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/remove-record",
		data: { 'record_id': record_id },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.addTagToProject = ({ project_id, tag_name, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/tag-project",
		data: { 'project_id': project_id, 'tag_name': tag_name },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.addTagValueToProject = ({ project_id, tag_name, tag_value, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/project-tag-value",
		data: { 'project_id': project_id, 'tag_name': tag_name, 'tag_value': tag_value },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.removeTagFromProject = ({ project_id, tag_name, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/project-remove-tag",
		data: { 'project_id': project_id, 'tag_name': tag_name },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.removeTagValueFromProject = ({ project_id, tag_name, tag_value, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/project-remove-tag-value",
		data: { 'project_id': project_id, 'tag_name': tag_name, 'tag_value': tag_value },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.setTagToRecord = ({ record_id, tag_name, tag_value, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/tag-record",
		data: { 'record_id': record_id, 'tag_name': tag_name, 'tag_value': tag_value },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.removeTagFromRecord = ({ record_id, tag_name, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/remove-record-tag",
		data: { 'record_id': record_id, 'tag_name': tag_name },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}

api.modifyInputRecord = ({ record_id, input, onSuccess, onError }) => {
	$.ajax({
		method: "post",
		url: "api/modify-record",
		data: { 'record_id': record_id, 'input': input },
		success: function (data, textStatus) {
			onSuccess();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			onError();
		}
	})
}