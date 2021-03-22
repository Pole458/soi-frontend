'use strict'

const create = (name) => {
	return document.createElement(name);
}

const icon = (name) => {
	return $(create("i")).attr("class", "eos-icons").text(name)
}

/**
 * JSON object containing UI helper methods.
 */
const ui = {}

ui.setContent = (view) => {
	$("body").empty();
	$("body").append(view);
}

const LoadingView = () => {
	return $(create("div"))
		.css("width", "100%")
		.css("flex", "1")
		.css("display", "flex")
		.css("flex-direction", "column")
		.append($(create("div")).css("flex", "1"))
		.append(
			$(create("img"))
				.css("max-height", "64px")
				.attr("src", "img/loading.svg")
		)
		.append($(create("div")).css("flex", "1"))
}

const Fab = ({ onClick }) => {
	return $(create("div"))
		.attr("class", "fab")
		.append(icon("add"))
		.click(onClick)
}

const ModalView = ({ content, onConfirm }) => {

	const view = create("div")

	const errorDialog = $(create("p"))
		.css("color", "maroon")
		.css("visibility", "hidden")
		.css("text-align", "center")
		.text("Error Message")

	const confirmButton = $(create("button"))
		.text("Confirm")
		.attr("class", "modal-button")
		.click(ev => {
			ev.preventDefault()
			view.hideErrorMessage()
			onConfirm()
		})

	const cancelButton = $(create("button"))
		.text("Cancel")
		.attr("class", "modal-button")
		.click(ev => {
			ev.preventDefault()
			$(view).remove();
		})
		.css("margin-left", "4px")

	$(view)
		.attr("class", "modal-box")
		.append(
			$(create("div"))
				.attr("class", "modal-content")
				.append(content)
				.append(errorDialog)
				.append(
					$(create("form"))
						.attr("class", "modal-buttons")
						.append(confirmButton)
						.append(cancelButton)
				)
		)
		.click(ev => {
			if (!view.disabled && ev.target === view)
				view.hide()
		})

	view.show = () => {
		$("body").append(view);
	}

	view.hideErrorMessage = () => {
		$(errorDialog)
			.css("visibility", "hidden")
	}

	view.showErrorMessage = (errorMessage) => {
		$(errorDialog)
			.css("visibility", "visible")
			.text(errorMessage)
	}

	view.disabled = false

	view.enable = () => {
		view.disabled = false
		$(confirmButton).attr("disabled", false)
		$(cancelButton).attr("disabled", false)
	}

	view.disable = () => {
		view.disabled = true
		$(confirmButton).attr("disabled", true)
		$(cancelButton).attr("disabled", true)
	}

	view.hide = () => {
		$(view).remove();
	}

	view.show()

	return view;
}

const LoginPage = () => {

	const view = create("form");

	const userNameInput = $(create("input"))
		.attr("class", "login-group-element")
		.attr("name", "Username")
		.attr("type", "text")
		.attr("value", "")
		.attr("placeholder", "Insert your username here...")

	const passwordInput = $(create("input"))
		.attr("class", "login-group-element")
		.attr("name", "Password")
		.attr("type", "password")
		.attr("value", "")
		.attr("placeholder", "****")

	// Add click event to login/signin buttons
	const click = function (ev) {

		ev.preventDefault();

		view.hideErrorMessage();

		const value = $(this).attr("value");

		const username = $(userNameInput).val()
		const password = $(passwordInput).val()
		$(view).trigger("reset")

		// Check user input
		if (!username || !password) {
			view.showErrorMessage("Please insert valid username and password")
			return;
		};

		const onSuccess = () => {
			token = getCookieJSON("token");
			ui.setContent(MainPage())
		}

		const onError = (errorMessage) => {
			view.showErrorMessage(errorMessage)
			view.enable()
		}

		view.disable();

		if (value == 'login') {
			api.logIn({
				username: username,
				password: password,
				onSuccess: onSuccess,
				onError: onError
			});
		} else if (value == 'signin') {
			api.signIn({
				username,
				password,
				onSuccess: onSuccess,
				onError: onError
			});
		}
	};

	const logInButton = $(create("button"))
		.attr("class", "login-group-element")
		.attr("type", "submit")
		.attr("name", "login")
		.attr("value", "login")
		.append(
			$(create("span")).text("Log In")
		)
		.click(click)

	const signInButton = $(create("button"))
		.attr("class", "login-group-element")
		.attr("type", "submit")
		.attr("name", "signin")
		.attr("value", "signin")
		.append(
			$(create("span")).text("Sign In")
		)
		.click(click)


	const logInErrorView = $(create("p"))
		.css("visibility", "hidden")
		.css("color", "maroon")
		.text("Error Message")


	$(view)
		.attr("class", "login-group")
		.append(userNameInput)
		.append(passwordInput)
		.append(logInButton)
		.append(signInButton)
		.append(logInErrorView)

	view.disable = () => {
		$(logInButton).attr("disabled", true)
		$(signInButton).attr("disabled", true)
	}

	view.enable = () => {
		$(logInButton).attr("disabled", false)
		$(signInButton).attr("disabled", false)
	}

	view.showErrorMessage = (errorMessage) => {
		$(logInErrorView).text(errorMessage);
		$(logInErrorView).css("visibility", "visible")
	}

	view.hideErrorMessage = () => {
		$(logInErrorView).css("visibility", "hidden");
	}

	return view;
}

const MainPage = () => {

	const view = create("div")

	view.selectedProject = null
	view.selectedRecord = null

	view.setContent = (c) => {
		$(content).empty()
		$(content).append(c)
	}

	const topBar = TopBar({
		onClickHome: function () {
			view.selectedProject = null
			view.selectedRecord = null
			view.showProjects()
		},
		onClickProject: () => {
			view.selectedRecord = null
			view.showProject(view.selectedProject.id)
		}
	});

	const content = $(create("div"))
		.css("flex", "1")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("overflow-y", "hidden")

	$(view)
		.css("width", "100%")
		.css("flex", "1")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("overflow-y", "hidden")
		.append(
			topBar
		)
		.append(
			content
		)

	view.showProjects = () => {

		view.setContent(LoadingView())

		api.getProjects({
			onSuccess: (projects) => {

				$(content).empty()

				// Add Fab button
				$(content).append(
					Fab({
						onClick: () => {
							const titleinput = $(create("input"))
								.attr("class", "new-project-input")
								.attr("type", "text")
								.attr("value", "")
								.attr("placeholder", "Insert project name...")

							const modal = ModalView({
								content: $(create("div"))
									.append(
										titleinput
									)
									.append(
										$(create("p"))
											.text("Select type of project")
									)
									.append(
										$(create("select"))
											.append(
												$(create("option"))
													.attr("Value", "Text")
													.text("Text")
											)
											.append(
												$(create("option"))
													.attr("Value", "Images")
													.text("Images")
											)
									),
								onConfirm: () => {
									const title = $(titleinput).val()

									if (!title) {
										modal.showErrorMessage("Please insert valid title")
										return;
									}

									modal.disable()

									api.addProject({
										title: title,
										onSuccess: () => {
											modal.hide()
											view.showProjects()
										},
										onError: (errorMessage) => {
											modal.showErrorMessage(errorMessage)
											modal.enable()
										}
									})
								}
							})
						}
					})
				)

				if (!projects) return;

				projects.forEach(project => {
					$(content).append(
						ProjectListView({
							project: project,
							onClick: (project_id) => {
								view.showProject(project_id)
							}
						}))
				})
			},
			onError: () => {

			}
		});
	}

	view.showProjects();

	view.showProject = (project_id) => {
		view.setContent(LoadingView())
		api.getProject({
			id: project_id,
			onSuccess: (project) => {
				view.selectedProject = project
				topBar.hidePathRecord()
				topBar.showPathProject(project.title)
				view.setContent(
					ProjectView({
						project: project,
						onRecordClick: (record) => {
							view.showRecord(record)
						}
					})
				)
			},
			onError: () => {

			}
		})
	}

	view.showRecord = (record) => {
		view.selectedRecord = record
		topBar.showPathRecord()
		view.setContent(
			RecordView({
				record: record,
				projectTags: view.selectedProject.tags
			})
		)
	}

	return view;
}

const TopBar = ({ onClickHome, onClickProject }) => {

	const view = create("div")

	const projectPathView = $(create("button"))
		.attr("class", "button-path")
		.attr("hidden", true)
		.append(
			icon("keyboard_arrow_right")
		)
		.append(
			$(create("span")).text("Project")
		)
		.click(ev => {
			ev.preventDefault();
			onClickProject();
		})

	const recordPathView = $(create("button"))
		.attr("class", "button-path")
		.attr("hidden", true)
		.append(
			icon("keyboard_arrow_right")
		)
		.append(
			$(create("span")).text("Record")
		)

	view.showPathProject = (project_title) => {
		$(projectPathView).children("span").text(project_title)
		$(projectPathView).attr("hidden", false)
	}

	view.hidePathProject = () => {
		$(projectPathView).attr("hidden", true)
	}

	view.showPathRecord = () => {
		$(recordPathView).attr("hidden", false)
	}

	view.hidePathRecord = () => {
		$(recordPathView).attr("hidden", true)
	}

	$(view)
		.attr("class", "app-bar")
		.append(
			// Path buttons
			$(create("div"))
				.attr("class", "app-bar-path")
				.append(
					$(create("button"))
						.attr("class", "button-path")
						.css("justify-content", "center")
						.append(
							$(create("span")).text("Home")
						)
						.click(ev => {
							ev.preventDefault();
							view.hidePathRecord()
							view.hidePathProject()
							onClickHome();
						})
				)
				.append(
					projectPathView
				)
				.append(
					recordPathView
				)
		)
		.append(
			// Space
			$(create("div")).css("flex", "1")
		)
		.append(
			// User/Log out Buttons
			$(create("div"))
				.attr("class", "app-bar-user-info")
				.append(
					$(create("button"))
						.append(
							icon("account_circle")
						)
						.text(token.username)
				)
				.append(
					$(create("button"))
						.text("Log Out")
						.click(ev => {
							ev.preventDefault();
							token = null;
							deleteCookie("token");
							ui.setContent(LoginPage())
						})
				)
		)

	return view;
}

const ProjectListView = ({ project, onClick }) => {

	const view = create("div")

	view.project = project

	$(view)
		.attr("class", "project")
		.append($(create("h3")).text(project.title))
		.click(ev => {
			onClick(project.id);
		});

	return view;
}

const ProjectView = ({ project, onRecordClick }) => {

	const view = $(create("div"))
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "hidden")

	const content = $(create("div"))
		.attr("class", "tabcontent")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "hidden")
		.append(
			$(create("div"))
				.attr("class", "fab")
				.append(
					$("<i></i>")
						.attr("class", "eos-icons")
						.text("add")
				)
				.click(ev => {
					ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Add new tag: ")
							)
							.append(
								$("<input></input>")
									.attr("class", "new-tag-input")
									.attr("type", "text")
									.attr("name", "new-tag-name")
									.attr("value", "")
									.attr("placeholder", "Insert tag name")
							),
						onConfirm: () => {

						}
					})
				})
		)

	view.setContent = (v) => {
		$(content).empty()
		$(content).append(v)
	}

	const tagsTabButton = $(create("button"))
		.text("Tags")
		.attr("class", "tablink")
		.css("background-color", "#ccc")
		.click(ev => {
			$(tagsTabButton).css("background-color", "#ccc")
			$(recordsTabButton).css("background-color", "#f1f1f1")
			view.showTags()
		})

	const recordsTabButton = $(create("button"))
		.text("Records")
		.attr("class", "tablink")
		.click(ev => {
			$(recordsTabButton).css("background-color", "#ccc")
			$(tagsTabButton).css("background-color", "#f1f1f1")
			view.showRecords();
		})

	$(view)
		.append(
			// Title
			$(create("h2"))
				.text(project.title)
		)
		.append(
			// Tabs
			$(create("div"))
				.css("display", "flex")
				.css("flex-direction", "row")
				.css("flex", "1")
				.css("overflow-y", "hidden")
				.append(
					$(create("div"))
						.attr("class", "tabs")
						.append(
							tagsTabButton
						)
						.append(
							recordsTabButton
						)
				)
				.append(content)
		)

	view.showTags = () => {

		$(content).empty()

		if (!project.tags) return;

		project.tags.forEach(tag => {

			const tagView = create("div")

			$(tagView)
				.attr("class", "tags-list")
				.css("flex-direction", "row")
				.css("display", "block")
				.append(
					$(create("div"))
						.css("position", "relative")
						.css("margin", "16px")
						.append(
							$(create("h3"))
								.text(tag.name)
								.css("display", "inline")
						)
						.append(
							$(create("button"))
								.attr("class", "remove-tags-project")
								.css("display", "inline")
								.append(
									icon("remove_circle")
								)
						)
				)

			const valuesList = create("div")
			$(valuesList)
				.css("display", "flex")

			if (tag.values) {
				tag.values.forEach(value => {
					const valueView = create("div")

					$(valueView)
						.attr("class", "project-tags-val")
						.text(value)
						.append(
							$(icon("remove_circle"))
								.css("margin-left", "10px")
								.click(ev => {
									$(valueView).remove();
								})
						)

					$(valuesList).append(valueView);
				})
			}

			const addValueView = create("div")
			$(addValueView)
				.attr("class", "project-tags-val")
				.css("cursor", "pointer")
				.text("+ Add new value")
				.click(ev => {

					const input = $(create("input"))
						.attr("type", "text")
						.attr("name", "new-tag-value")
						.attr("value", "")
						.attr("placeholder", "Insert tag value")

					ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Add tag value: ")
							)
							.append(input),
						onConfirm: () => {
							const tagName = $(input).val()

							if (!tagName) {

							}

							api.add

						}
					})
				})

			$(valuesList).append(addValueView);

			$(tagView).append(valuesList)

			$(content).append(
				Fab({
					onClick: () => {
						ModalView({
						})
					}
				})
			)

			$(content).append(tagView);
		})
	}

	view.showRecords = () => {
		view.setContent(LoadingView())

		api.getRecords({
			id: project.id,
			onSuccess: (records) => {

				$(content).empty()

				$(content).append(
					Fab({
						onClick: () => {
							ModalView({
							})
						}
					})
				)

				if (!records) return;

				records.forEach(record => {

					const recordView = create("div")

					$(recordView)
						.attr("class", "records-list")
						.css("flex-direction", "row")
						.css("display", "block")
						.css("overflow-y", "hidden")
						.append(
							$(create("h3"))
								.text(record.input)
						)
						.click(ev => {
							onRecordClick(record)
						})

					const tagList = create("div")
					$(tagList)
						.css("display", "flex")

					if (record.tags) {

						record.tags.forEach(tag => {
							const tagView = create("div")

							$(tagView)
								.attr("class", "records-tags-val")
								.text(tag.name + ": " + tag.value)

							$(tagList).append(tagView);
						})
					}

					$(recordView).append(tagList);

					$(content).append(recordView);
				})
			},
			onError: () => {
				ui.showLoginPage();
			}
		});
	}

	view.showTags()

	return view;
}

const RecordView = ({ record, projectTags }) => {

	const view = create("div")

	const input = create("div");
	$(input)
		.css("flex-direction", "row")
		.append(
			$(create("h1"))
				.text(record.input)
				.css("padding-left", "20px")
		)
		.append(
			$(create("button"))
				.css("margin-left", "8px")
				.append(
					$(create("i"))
						.attr("class", "eos-icons")
						.text("mode_edit")
				)
				.click(ev => {
					ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Modify input:")
							)
							.append(
								$(create("input"))
									.attr("class", "input-modifier")
									.attr("type", "text")
									.attr("name", "record-input-mod")
									.attr("value", record.input)
							),
						onConfirm: () => { }
					})
				})
		)

	$(view).append(input)

	const tagsList = $(create("div"))
		.css("flex-direction", "column")

	if (record.tags) {

		record.tags.forEach(tag => {

			const tagView = create("div")

			const select = $(create("select"))
				.css("margin-left", "16px")

			for (const projectTag of projectTags) {
				if (projectTag.name == tag.name) {
					for (const value of projectTag.values) {
						const option = $(create("option"))
							.attr("value", value)
							.text(value)

						if (value === tag.value)
							$(option).attr("selected", "selected")

						$(select).append(option)
					}
					break;
				}
			}

			$(tagView)
				.attr("class", "tag-record")
				.text(tag.name + ": ")
				.append(select)
				.append(
					$(create("button"))
						.attr("class", "remove-tags-records")
						.append(icon("remove_circle"))
				)

			$(tagsList).append(tagView);
		})
	}

	$(tagsList)
		.append(
			$(create("div"))
				.attr("class", "add-tag-record")
				.append($(create("h3")).text("+ Add new tag"))
				.click(ev => {

					const tagNameselect = $(create("select"))

					for (const projectTag of projectTags) {
						$(tagNameselect).append(
							$(create("option"))
								.attr("value", projectTag.name)
								.text(projectTag.name)
						)
					}

					const tagValueSelect = $(create("select"))

					$(tagNameselect).change(() => {

						$(tagValueSelect).empty()

						const tagName = $(tagNameselect).val()

						for (const projectTag of projectTags) {
							if (projectTag.name == tagName) {
								for (const value of projectTag.values) {
									$(tagValueSelect).append(
										$(create("option"))
											.attr("value", value)
											.text(value)
									)
								}
								break;
							}
						}
					})

					ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Insert tag name and value:")
							)
							.append(tagNameselect)
							.append(tagValueSelect)
						,
						onConfirm: () => { }
					})
				})
		)

	$(view).append(tagsList)

	return view
}