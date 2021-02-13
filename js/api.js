const api = {}

api.signIn = (username, password) => {
	$.ajax({
		method: 'post',
		url: 'api/signin',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			token = getCookieJSON("token");
			api.checkToken(false);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLogInError(jqXHR.responseJSON.error);
		}
	});
}

api.logIn = (username, password) => {
	$.ajax({
		method: 'post',
		url: 'api/login',
		data: { 'username': username, 'password': password },
		success: function (data, textStatus) {
			token = getCookieJSON("token");
			api.checkToken(false);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLogInError(jqXHR.responseJSON.error);
		}
	});
}

api.checkToken = (renew) => {
	$.ajax({
		method: 'post',
		url: 'api/check-token',
		data: { 'renew': renew, },
		success: function (data, textStatus) {
			token = getCookieJSON("token");
			ui.showMainPage();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			ui.showLoginPage();
		}
	});
}