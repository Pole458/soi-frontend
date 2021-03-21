'use strict'

/**
 * JSON object containing UI helper methods.
 */
const ui = {}


const ModalView = ({confirm, cancel}) => {
	
	const view = document.createElement("div");

	view.confirm = confirm;
	view.cancel = cancel;

	$(view)
		.attr("class", "modal-box")
		.append(
			$("<div></div>")
				.attr("id", "modal-content-id")
				.attr("class", "modal-content")
				.append(
					$("<form></form>")
						.attr("class", "modal-buttons")
						.append(
							$("<button></button>")
								.text("Confirm")
								.attr("class", "modal-button")
								.click(ev => {
									view.confirm();
									$(view).remove();
								})
						)
						.append(
							$("<button></button>")
								.text("Cancel")
								.attr("class", "modal-button")
								.click(ev => {
									view.cancel();
									$(view).remove();
								})
								.css("margin-left", "4px")
						)
				)
		)
		.click(ev => {
			if (ev.target === view)
				$(view).remove();
		})

	$("#main-page-content").append(view);

	return view;
}


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

const LoginPage = () => {
	

{/* <form hidden id="login-form" class="login-group">
    <input class="login-group-element" name="Username" type="text" value="" placeholder="Insert your username here...">
    <input class="login-group-element" name="Password" type="password" value="" placeholder="****">
    <button class="login-group-element" type="submit" name="login" value="login">
      <!-- <i class="eos-icons">login</i> -->
      <span>Log In</span>
    </button>// Hide other pages
	ui.hideMainPage();
	ui.hideLoadingPage();
	ui.hideProjectPage();isibility: hidden; color: maroon;">Error Message</p>
  </form> */}

	// Hide other pages
	ui.hideMainPage();
	ui.hideLoadingPage();
	ui.hideProjectPage();

	// Show
	$("#login-form").removeAttr("hidden");

	ui.hideLogInError();


	// Add click event to login/signin buttons
	$("#login-form button").click(function (ev) {

		ev.preventDefault();
		ui.hideLogInError();

		const value = $(this).attr("value");

		const form = $('#login-form');
		const username = $(form).children("input[name='Username']").val()
		const password = $(form).children("input[name='Password']").val()
		form.trigger("reset");

		// console.log(username);
		// console.log(password);

		// Check user input
		if (!username || !password) {
			ui.showLogInError("Please insert valid username and password");
			return;
		};

		const successCallback = () => {
			ui.logIn();
		}

		const errorCallback = (errorCode) => {
			ui.showLogInError(errorCode);
		}

		if (value == 'login') {
			api.logIn({
				username: username,
				password: password,
				success: successCallback,
				error: errorCallback
			});
		} else if (value == 'signin') {
			api.signIn({
				username,
				password,
				success: successCallback,
				error: errorCallback
			});
		}
	});

	// Add click event to logout button
	$("#button-logout").click(ev => {
		ev.preventDefault();
		model.token = null;
		deleteCookie("token");

		ui.showLoginPage();
	});
}

ui.showLoginPage = () => {
	// Hide other pages
	ui.hideMainPage();
	ui.hideLoadingPage();
	ui.hideProjectPage();

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
	ui.hideProjectPage();

	// Change Path
	$("#path-project").attr("hidden", true);
	$("#path-dataset").attr("hidden", true);
	$("#path-record").attr("hidden", true);

	$("#username").text(model.token.username);

	$("#main-page-content").empty();

	// Show
	$("#main-page").removeAttr("hidden");

	// API call to fill the page
	api.getProjects({
		success: (projects) => {
			ui.showProjects(projects);
		},
		error: () => {
			ui.showLoginPage();
		}
	});
}

ui.showProjects = (projects) => {

	if (projects) {
		projects.forEach(project => {

			// Create an item for the project
			const item = document.createElement("div");

			$(item)
				.attr("class", "project")
				.append($("<h3></h3>").text(project.title))
				.click(ev => {
					ui.showProject(project.id);
				});

			$("#main-page-content").append(item);
		});
	}

	// Add Fab button
	$("#main-page-content")
		.append(
			$("<div></div>")
				.attr("class", "fab")
				.append(
					$("<i></i>")
						.attr("class", "eos-icons")
						.text("add")
				)
				.click(ev => {
					const modal = ModalView({
						confirm: () => {
							$(this).children("")
						},
						cancel: () => {}
					})

					ui.openModalBox({
						confirm: () => {
							api.addProject({
								project_name: "",
								success: (project) => {
									
								},
								error: () => {

								}
							})
						},
						cancel: () => {

						}
					});
					$("#modal-content-id")
						.append(
							$("<input></input>")
								.attr("class", "new-project-input")
								.attr("type", "text")
								.attr("name", "new-project-name")
								.attr("value", "")
								.attr("placeholder", "Insert project name")
						)
						.append(
							$("<p></p>")
								.text("Select type of project")
						)
						.append(
							$("<select></select>")
								.attr("id", "project-type")
								.append(
									$("<option></option>")
										.attr("Value", "Text")
										.text("Text")
								)
								.append(
									$("<option></option>")
										.attr("Value", "Images")
										.text("Images")
								)

						)
				})
		)
}

// ui.openModalBox = ({confirm, cancel}) => {
// 	const modal = document.createElement("div");
// 	$(modal)
// 		.attr("class", "modal-box")
// 		.append(
// 			$("<div></div>")
// 				.attr("id", "modal-content-id")
// 				.attr("class", "modal-content")
// 				.append(
// 					$("<form></form>")
// 						.attr("class", "modal-buttons")
// 						.append(
// 							$("<button></button>")
// 								.text("Confirm")
// 								.attr("class", "modal-button")
// 								.click(ev => {
// 									$(modal).remove();
// 									confirm();
// 								})
// 						)
// 						.append(
// 							$("<button></button>")
// 								.text("Cancel")
// 								.attr("class", "modal-button")
// 								.click(ev => {
// 									$(modal).remove();
// 									cancel();
// 								})
// 								.css("margin-left", "4px")
// 						)
// 				)
// 		)
// 		.click(ev => {
// 			if (ev.target === modal)
// 				$(modal).remove();
// 		})

// 	$("#main-page-content").append(modal);
// }

ui.showProject = (project_id) => {

	api.getProject({
		id: project_id,
		success: (project) => {

			// Change path
			$("#path-project").children("span").text(project.title);
			$("#path-project").removeAttr("hidden");
			$("#path-dataset").attr("hidden", true);
			$("#path-record").attr("hidden", true);

			// Change main page content
			$("#main-page-content").empty();

			const title = document.createElement("h2");
			$(title).text(project.title);

			$("#main-page-content").append(title);

			const tabs1 = document.createElement("div");
			$(tabs1)
				.css("display", "flex")
				.css("flex-direction", "row")
				.css("flex", "1")
				.css("overflow-y", "hidden")
				.append(
					$("<div></div>")
						.attr("class", "tabs")
						.append(
							$("<button></button>")
								.text("Tags")
								.attr("id", "tags-tab-button")
								.attr("class", "tablink")
								.css("background-color", "#ccc")
								.click(ev => {
									ui.openTabs("Tags");
								})
						)
						.append(
							$("<button></button>")
								.text("Records")
								.attr("id", "records-tab-button")
								.attr("class", "tablink")
								.click(ev => {
									ui.openTabs("Records");
								})
						)
				)
				.append(
					$("<div></div>")
						.css("display", "block")
						.attr("class", "tabcontent")
						.attr("id", "tags-tabcontent")
						.append(
							$("<div></div>")
								.attr("class", "fab")
								.append(
									$("<i></i>")
										.attr("class", "eos-icons")
										.text("add")
								)
								.click(ev => {
									ui.openModalBox();
									$("#modal-content-id")
										.append(
											$("<h4></h4>")
												.text("Add new tag: ")
										)
										.append(
											$("<input></input>")
												.attr("class", "new-tag-input")
												.attr("type", "text")
												.attr("name", "new-tag-name")
												.attr("value", "")
												.attr("placeholder", "Insert tag name")
										)
								})
						)
				)
				.append(
					$("<div></div>")
						.css("display", "none")
						.attr("class", "tabcontent")
						.attr("id", "records-tabcontent")
						.append(
							$("<div></div>")
								.attr("class", "fab")
								.append(
									$("<i></i>")
										.attr("class", "eos-icons")
										.text("add")
								)
								.click(ev => {
									ui.openModalBox();
									$("#modal-content-id")
										.append(
											$("<h4></h4>")
												.text("Add new record: ")
										)
										.append(
											$("<input></input>")
												.attr("class", "new-record-input")
												.attr("type", "text")
												.attr("name", "new-record-name")
												.attr("value", "")
												.attr("placeholder", "Insert record")
										)
								})
						)
				);

			$("#main-page-content").append(tabs1);

			ui.showTags(project.tags);

			ui.showRecords(project.id);
		},
		error: () => {
			ui.showLoginPage();
		}
	});
}

ui.showTags = (tags) => {

	if (!tags) return;

	tags.forEach(tag => {

		const tagView = document.createElement("div")

		$(tagView)
			.attr("class", "tags-list")
			.css("flex-direction", "row")
			.css("display", "block")
			.append(
				$("<div></div>")
					.css("position", "relative")
					.css("margin", "16px")
					.append(
						$("<h3></h3>")
							.text(tag.name)
							.css("display", "inline")
					)
					.append(
						$("<button></button>")
							.attr("class", "remove-tags-project")
							.css("display", "inline")
							.append(
								$("<i></i>")
									.attr("class", "eos-icons")
									.text("remove_circle")
							)
					)
			)

		const valuesList = document.createElement("div")
		$(valuesList)
			.css("display", "flex")

		if (tag.values) {
			tag.values.forEach(value => {
				const valueView = document.createElement("div")

				$(valueView)
					.attr("class", "project-tags-val")
					.text(value)
					.append(
						$("<i></i>")
							.attr("class", "eos-icons")
							.text("remove_circle")
							.attr("id", "eos-remove-project-tag")
							.css("margin-left", "10px")
							.click(ev => {
								$(valueView).remove();
							})
					)

				$(valuesList).append(valueView);
			})
		}

		const addValueView = document.createElement("div")
		$(addValueView)
			.attr("class", "project-tags-val")
			.attr("id", "add-tag-value-project")
			.css("cursor", "pointer")
			.text("+ Add new value")
			.click(ev => {
				ui.openModalBox();
				$("#modal-content-id")
					.append(
						$("<h4></h4>")
							.text("Add tag value: ")
					)
					.append(
						$("<input></input>")
							.attr("class", "new-tag-value-input")
							.attr("type", "text")
							.attr("name", "new-tag-value")
							.attr("value", "")
							.attr("placeholder", "Insert tag value")
					)
			})

		$(valuesList).append(addValueView);

		$(tagView).append(valuesList)

		$("#tags-tabcontent").append(tagView);
	})
}

ui.showRecords = (project_id) => {

	api.getRecords({
		id: project_id,
		success: (records) => {
			// Remove elements from records list before refresh it
			$("#records-tabcontent").empty();

			if (records) {
				records.forEach(record => {

					const recordView = document.createElement("div")

					$(recordView)
						.attr("class", "records-list")
						.css("flex-direction", "row")
						.css("display", "block")
						.css("overflow-y", "hidden")
						.click(ev => {
							ui.showRecord(record.id);
						})
						.append(
							$("<h3></h3>")
								.text(record.input)
						)

					const tagList = document.createElement("div")
					$(tagList)
						.css("display", "flex")

					if (record.tags) {

						record.tags.forEach(tag => {
							const tagView = document.createElement("div")

							$(tagView)
								.attr("class", "records-tags-val")
								.text(tag.name + ": " + tag.value)

							$(tagList).append(tagView);
						})
					}

					$(recordView).append(tagList);

					$("#records-tabcontent").append(recordView);
				})
			}
		},
		error: () => {
			ui.showLoginPage();
		}
	});
}

ui.openTabs = (text) => {

	if (text == "Tags") {
		$("#records-tabcontent")
			.css("display", "none")
		$("#records-tab-button")
			.css("background-color", "#f1f1f1")
		$("#tags-tabcontent")
			.css("display", "block")
		$("#tags-tab-button")
			.css("background-color", "#ccc")
	}

	if (text == "Records") {
		$("#tags-tabcontent")
			.css("display", "none")
		$("#tags-tab-button")
			.css("background-color", "#f1f1f1")
		$("#records-tabcontent")
			.css("display", "block")
		$("#records-tab-button")
			.css("background-color", "#ccc")
	}
}

ui.showRecord = (record_id) => {

	api.getRecord({
		id: record_id,
		success: (record) => {

			$("#path-record").children("span").text(record.title);
			$("#path-record").removeAttr("hidden");
			$("#path-dataset").attr("hidden", true);

			$("#path-project").click(ev => {
				ev.preventDefault();
				ui.showProject(record.project_id);
			})

			// Change main page content
			$("#main-page-content").empty();

			const input = document.createElement("div");
			$(input)
				.css("flex-direction", "row")
				.append(
					$("<h1></h1>")
						.text(record.input)
						.css("padding-left", "20px")
				)
				.append(
					$("<button></button>")
						.css("margin-left", "8px")
						.append(
							$("<i></i>")
								.attr("class", "eos-icons")
								.text("mode_edit")
						)
						.click(ev => {
							ui.openModalBox();
							$("#modal-content-id")
								.append(
									$("<h4></h4>")
										.text("Modify input:")
								)
								.append(
									$("<input></input>")
										.attr("class", "input-modifier")
										.attr("type", "text")
										.attr("name", "record-input-mod")
										.attr("value", record.input)
								)
						})
				)

			$("#main-page-content").append(input);

			$("#main-page-content").append(
				$("<div></div>")
					.attr("id", "record-content-div")
					.css("flex-direction", "column")
			)

			if (record.tags) {

				record.tags.forEach(tag => {
					const item1 = document.createElement("div")

					$(item1)
						.attr("class", "tag-record")
						.text(tag.name + ": ")
						.append(
							$("<select></select>")
								.attr("id", "record-tag-values")
								.append(
									$("<option></option>")
										.attr("Value", "Value")
										.text(tag.value)
								)
								.css("margin-left", "16px")
						)
						.append(
							$("<button></button>")
								.attr("class", "remove-tags-records")
								.append(
									$("<i></i>")
										.attr("class", "eos-icons")
										.text("remove_circle")
								)
						)

					$("#record-content-div").append(item1);
				})
			}

			$("#record-content-div")
				.append(
					$("<div></div>")
						.attr("class", "add-tag-record")
						.append($("<h3></h3>").text("+ Add new tag"))
						.click(ev => {
							ui.openModalBox();
							$("#modal-content-id")
								.append(
									$("<h4></h4>")
										.text("Insert tag name and value:")
								)
								.append(
									$("<input></input>")
										.attr("class", "new-recordtag-input")
										.attr("type", "text")
										.attr("name", "new-recordtag-name")
										.attr("value", "")
										.attr("placeholder", "Insert tag name")
								)
								.append(
									$("<input></input>")
										.attr("class", "new-recordtag-input")
										.attr("type", "text")
										.attr("name", "new-recordtag-value")
										.attr("value", "")
										.attr("placeholder", "Insert tag value")
										.css("margin-left", "10px")
								)
						})
				)

		},
		error: () => {
			ui.showMainPage();
		}
	});
}

ui.hideProjectPage = () => {
	// Hide
	$("#project-form").attr("hidden", true);
}

ui.logIn = () => {
	// Update token value stored in cookie
	model.token = getCookieJSON("token");
	ui.showMainPage();
}

ui.init = () => {

	// Add click event to login/signin buttons
	$("#login-form button").click(function (ev) {

		ev.preventDefault();
		ui.hideLogInError();

		const value = $(this).attr("value");

		const form = $('#login-form');
		const username = $(form).children("input[name='Username']").val()
		const password = $(form).children("input[name='Password']").val()
		form.trigger("reset");

		// console.log(username);
		// console.log(password);

		// Check user input
		if (!username || !password) {
			ui.showLogInError("Please insert valid username and password");
			return;
		};

		const successCallback = () => {
			ui.logIn();
		}

		const errorCallback = (errorCode) => {
			ui.showLogInError(errorCode);
		}

		if (value == 'login') {
			api.logIn({
				username: username,
				password: password,
				success: successCallback,
				error: errorCallback
			});
		} else if (value == 'signin') {
			api.signIn({
				username,
				password,
				success: successCallback,
				error: errorCallback
			});
		}
	});

	// Add click event to logout button
	$("#button-logout").click(ev => {
		ev.preventDefault();
		model.token = null;
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