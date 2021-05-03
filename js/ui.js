'use strict'

const create = (name) => {
	return document.createElement(name);
}

const icon = (name) => {
	return $(create("i")).attr("class", "eos-icons").text(name)
}

/**
 * JS object containing UI helper methods.
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

const ImageView = ({ src, width, height }) => {

	const view = $(create("img"))
		.css("height", height)
		.css("width", width)
		.css("object-fit", "contain")
		.css("background-color", "#333")
		.css("border-radius", "8px")

	view.setSrc = (src) => {
		$(view).attr("src", src)
	}

	if (src) view.setSrc(src)

	return view;
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

	const view = $(create("div"))
		.css("display", "flex")
		.css("overflow-y", "hidden")

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
		},
		onClickName: (user) => {
			view.showUser(user)
		}
	});

	const content = $(create("div"))
		.attr("class", "main-content-div")
		.attr("id", "main-content-view")
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
		.append(topBar)
		.append(content)

	view.showProjects = () => {

		topBar.hidePathProject()
		topBar.hidePathRecord()

		view.setContent(LoadingView())

		api.getProjects({
			onSuccess: (projects) => {

				if (!projects) return;

				const listView = $(create("div"))
					.css("flex", "1")
					.css("display", "flex")
					.css("flex-direction", "column")
					.css("overflow-y", "auto")

				listView.append(
					$(create("h2"))
						.text("Projects")
						.css("color", "#f90")
						.css("padding-left", "20px")
				)

				// Add Fab button
				$(listView).append(
					Fab({
						onClick: () => {
							const titleinput = $(create("input"))
								.attr("class", "new-project-input")
								.attr("type", "text")
								.attr("value", "")
								.attr("placeholder", "Insert project name...")
								.css("color", " #ffffff")
								.css("background-color", "#1b1b1b")
								.css("border", "1px solid #ffffff")

							const recordTypeSelect = $(create("select"))
								.attr("class", "type-project-selector")
								.append(
									$(create("option"))
										.attr("Value", "Text")
										.text("Text")
										.css("color", "rgb(0, 0, 0.9)")
								)
								.append(
									$(create("option"))
										.attr("Value", "Image")
										.text("Image")
										.css("color", "rgb(0, 0, 0.9)")
								)

							const modal = ModalView({
								content: $(create("div"))
									.append(
										$(create("p"))
											.text("Insert new project name:")
											.css("color", "#ffffff")
									)
									.append(titleinput)
									.append(
										$(create("p"))
											.text("Select record type")
											.css("color", "#ffffff")
									)
									.append(recordTypeSelect),
								onConfirm: () => {
									const title = $(titleinput).val()
									const recordType = $(recordTypeSelect).val()

									if (!title) {
										modal.showErrorMessage("Please insert valid title")
										return;
									}

									modal.disable()

									api.addProject({
										title: title,
										recordType: recordType,
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

				projects.forEach(project => {
					$(listView).append(
						ProjectListView({
							project: project,
							onClick: (project_id) => {
								view.showProject(project_id)
							}
						}))
				})

				view.setContent(listView)
			},
			onError: () => { }
		});
	}

	view.showProject = (project_id) => {
		view.setContent(
			ProjectView({
				project_id: project_id,
				onRecordClick: (record) => {
					view.showRecord(record)
				},
				onRemoveProject: () => {
					topBar.hidePathProject()
					view.showProjects()
				},
				onProjectLoaded: (project) => {
					view.selectedProject = project
					topBar.hidePathRecord()
					topBar.showPathProject(project.title)
				}
			})
		)
	}

	view.showRecord = (record) => {
		view.selectedRecord = record
		topBar.showPathRecord()
		view.setContent(
			RecordView({
				record: record,
				project: view.selectedProject,
				onRemoveRecord: () => {
					view.showProject(view.selectedProject.id)
				},
				onRecordUpdate: (record) => {
					view.showRecord(record)
				}
			})
		)
	}

	view.showUser = (user) => {
		topBar.hidePathProject()
		topBar.hidePathRecord()
		view.setContent(
			UserView({
				user: user,
				onReturn: () => {
					view.showProjects()
				}
			})
		)
	}

	view.showProjects();

	return view;
}

const TopBar = ({ onClickHome, onClickProject, onClickName }) => {

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
						.attr("id", "user-name-button")
						.append(
							icon("account_circle")
						)
						.click(ev => {
							api.getUser({
								id: token.id,
								onSuccess: (user) => {
									onClickName(user)
								},
								onError: () => {

								}
							})


						})
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

	api.getUser({
		id: token.id,
		onSuccess: (user) => {
			const name = user.username;
			$("#user-name-button").text(name);
		},
		onError: () => {

		}
	})

	return view;
}

const UserView = ({ user, onReturn }) => {

	const view = $(create("div"))
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "hidden")

	console.log("ciaooovgyvygo")

	const content = $(create("div"))
		.attr("class", "tabcontent")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "auto")

	view.setContent = (v) => {
		$(content).empty()
		$(content).append(v)
	}

	const infoTabButton = $(create("button"))
		.text("Informations")
		.attr("class", "tablink")
		.css("background-color", "#ffa31a")
		.css("color", "rgb(0, 0, 0.9)")
		.click(ev => {
			$(infoTabButton)
				.css("background-color", "#ffa31a")
				.css("color", "rgb(0, 0, 0.9)")
			$(eventsTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")
			$(otherTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")

			view.showInfo();
		})

	const eventsTabButton = $(create("button"))
		.text("Events")
		.attr("class", "tablink")
		.click(ev => {
			$(eventsTabButton)
				.css("background-color", "#ffa31a")
				.css("color", "rgb(0, 0, 0.9)")
			$(infoTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")
			$(otherTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")

			view.showEvents()
		})

	const otherTabButton = $(create("button"))
		.text("Other")
		.attr("class", "tablink")
		.click(ev => {
			$(otherTabButton)
				.css("background-color", "#ffa31a")
				.css("color", "rgb(0, 0, 0.9)")
			$(infoTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")
			$(eventsTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")

			view.showOther();
	})

	const infoView = $(create("div"))
		.attr("class", "tabcontent")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "auto")
		.css("align-items", "center")
		.css("min-width", "100%")
			
	$(infoView).append(
		$(create("div"))
			.css("flex-direction", "row")
			.css("display", "flex")
			.css("padding-left", "12px")
			.css("border-bottom", "1px solid #333")
			.css("min-width", "96%")
			.append(
				$(create("h4"))
					.text("Username: ")
					.css("color", "#ffffff")
			)
			.append(
				$(create("h4"))
					.text(user.username)
					.css("padding-left", "4px")
					.css("color", "#ffffff")
			)
	)
	api.getEventsForUser({
		user_id: user.id,
		onSuccess: (events) => {
	
			if (!events) return;
	
			$(infoView).append(
				$(create("div"))
					.css("flex-direction", "row")
					.css("display", "flex")
					.css("padding-left", "12px")
					.css("border-bottom", "1px solid #333")
					.css("min-width", "96%")
					.append(
						$(create("h4"))
							.text("Sign in date: ")
							.css("color", "#ffffff")
					)
					.append(
						$(create("h4"))
							.text(new Date(events[0].date).toLocaleString())
							.css("padding-left", "4px")
							.css("color", "#ffffff")
					)
			)

			$(content).append(infoView)
		},
		onError: () => {
			ui.showLoginPage();
		}
	});


	$(view)
		.append(
			$(create("div"))
				.css("flex-dirextion", "row")
				.append(
					// User
					$(create("h2"))
						.text(user.username)
						.css("color", "#f90")
						.css("padding-left", "20px")
						.css("display", "inline-block")
				)
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
							infoTabButton
						)
						.append(
							eventsTabButton
						)
						.append(
							otherTabButton
						)
				)
				.append(content)
		)
		

	view.showInfo = () => {
		console.log(user.id)

		$(content).empty()

		const infoView = $(create("div"))
		.attr("class", "tabcontent")
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "auto")
		.css("align-items", "center")
		.css("min-width", "100%")

		const infoList = $(create("div"))
			.css("flex-direction", "row")
			.css("display", "flex")
			.css("padding-left", "12px")
			.css("border-bottom", "1px solid #333")
			.css("min-width", "96%")

		$(infoList)
			.append(
				$(create("h4"))
					.text("Username: ")
					.css("color", "#ffffff")
			)
			.append(
				$(create("h4"))
					.text(user.username)
					.css("padding-left", "4px")
					.css("color", "#ffffff")
			)
			
		$(infoView).append(infoList)

		api.getEventsForUser({
			user_id: user.id,
			onSuccess: (events) => {

				if (!events) return;

				$(infoView).append(
					$(create("div"))
						.css("flex-direction", "row")
						.css("display", "flex")
						.css("padding-left", "12px")
						.css("border-bottom", "1px solid #333")
						.css("min-width", "96%")
						.append(
							$(create("h4"))
								.text("Sign in date: ")
								.css("color", "#ffffff")
						)
						.append(
							$(create("h4"))
								.text(new Date(events[0].date).toLocaleString())
								.css("padding-left", "4px")
								.css("color", "#ffffff")
						)
				)
				$(content).append(infoView)
			},
			onError: () => {
				ui.showLoginPage();
			}
		});

	}

	view.showEvents = () => {
	 	view.setContent(LoadingView())
	
		api.getEventsForUser({
		 		user_id: user.id,
		 		onSuccess: (events) => {
	
					$(content).empty()
	
		 			if (!events) return;
	
		 			events.forEach(e => {
		 				$(content).append(EventView({ e: e }));
		 			})
		 		},
		 		onError: () => {
		 			ui.showLoginPage();
		 		}
		 	});
		
	}

	view.showOther = () => {

		view.setContent(LoadingView())

		$(content).empty()

		const other = $(create("div"))
			.css("flex-direction", "row")
			.css("display", "flex")
			.css("padding-left", "12px")

		$(other)
			.append(
				$(create("h3"))
					.text("Placehoder...")
					.css("color", "#ffffff")
			)

		$(content).append(other)

	}

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

const ProjectView = ({ project_id, onRecordClick, onRemoveProject, onProjectLoaded }) => {

	const state = {
		project: null,
		tabSelected: "Records"
	}

	const view = $(create("div"))
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("flex", "1")
		.css("overflow-y", "hidden")

	const content = $(create("div"))
		.attr("class", "tabcontent")
		.css("flex", "1")
		.css("overflow-y", "auto")

	view.setContent = (v) => {
		$(content).empty()
		$(content).append(v)
	}

	view.reload = () => {
		view.setContent(LoadingView())
		api.getProject({
			id: project_id,
			onSuccess: (project) => {
				onProjectLoaded(project)
				view.setState({
					project: project
				})
			},
			onError: () => { }
		})
	}

	view.showTags = () => {

		$(view.recordsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")
		$(view.tagsTabButton)
			.css("background-color", "#ffa31a")
			.css("color", "rgb(0, 0, 0.9)")
		$(view.eventsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")

		$(content).empty()

		$(content).append(
			Fab({
				onClick: () => {
					const taginput = $(create("input"))
						.attr("class", "new-project-tag-input")
						.attr("type", "text")
						.attr("value", "")
						.attr("placeholder", "Insert tag name...")
						.css("color", " #ffffff")
						.css("background-color", "#1b1b1b")
						.css("border", "1px solid #ffffff")

					const modal = ModalView({
						content: $(create("div"))
							.append(
								$(create("p"))
									.text("Insert new tag name:")
									.css("color", "#ffffff")
							)
							.append(taginput),
						onConfirm: () => {
							const tag_name = $(taginput).val()

							if (!tag_name) {
								modal.showErrorMessage("Please insert valid tag")
								return;
							}

							modal.disable()
							api.addTagToProject({
								project_id: state.project.id,
								tag_name: tag_name,
								onSuccess: () => {
									modal.hide()
									view.reload();
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

		if (!state.project.tags) return;

		state.project.tags.forEach(tag => {

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
								.click(ev => {
									api.removeTagFromProject({
										project_id: state.project.id,
										tag_name: tag.name,
										onSuccess: () => { view.reload() },
										onError: () => { view.reload() }
									})
								})
						)
				)

			const valuesList = create("div")
			$(valuesList)
				.css("display", "flex")

			if (tag.values) {
				tag.values.forEach(value => {
					$(valuesList).append(
						$(create("p"))
							.attr("class", "project-tags-val")
							.text(value)
							.append(
								$(icon("remove_circle"))
									.css("margin-left", "10px")
									.click(ev => {
										api.removeTagValueFromProject({
											project_id: state.project.id,
											tag_name: tag.name,
											tag_value: value,
											onSuccess: () => { view.reload() },
											onError: () => { view.reload() }
										})
									})
							)
					)
				})
			}

			const addValueView = $(create("p"))
				.attr("class", "project-tags-val")
				.css("cursor", "pointer")
				.text("+ Add new value")
				.click(ev => {

					const input = $(create("input"))
						.attr("type", "text")
						.attr("name", "new-tag-value")
						.attr("value", "")
						.attr("placeholder", "Insert tag value")
						.css("color", " #ffffff")
						.css("background-color", "#1b1b1b")
						.css("border", "1px solid #ffffff")

					const modalVal = ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Add tag value: ")
									.css("color", "#ffffff")
							)
							.append(input),
						onConfirm: () => {
							const tagValue = $(input).val()

							if (!tagValue) {
								modal.showErrorMessage("Please insert valid tag value")
								return;
							}

							modalVal.disable()
							api.addTagValueToProject({
								project_id: state.project.id,
								tag_name: tag.name,
								tag_value: tagValue,
								onSuccess: () => {
									modalVal.hide()
									view.reload();
								},
								onError: (errorMessage) => {
									modalVal.showErrorMessage(errorMessage)
									modalVal.enable()
								}
							})

						}
					})
				})

			$(valuesList).append(addValueView);

			$(tagView).append(valuesList)

			$(content).append(tagView);
		})
	}

	view.showRecords = () => {

		$(view.recordsTabButton)
			.css("background-color", "#ffa31a")
			.css("color", "rgb(0, 0, 0.9)")
		$(view.tagsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")
		$(view.eventsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")

		view.setContent(LoadingView())

		api.getRecords({
			id: state.project.id,
			onSuccess: (records) => {

				$(content).empty()

				$(content).append(
					Fab({
						onClick: () => {

							let Image = null;
							let Text = null;

							let recordInput;

							if (state.project.recordType === "Image") {

								const img = ImageView({
									height: "256px",
									width: "256px"
								})

								$(img)
									.click(e => {
										$(fileInput).trigger("click");
									})
									.on("error", e => { Image = null; })

								const previewReader = new FileReader();
								previewReader.onload = e => {
									img.setSrc(e.target.result)
								}

								const fileInput = $(create("input"))
									.attr("type", "file")
									.css("display", "none")
									.attr("accept", "image/*")
									.on("change", e => {
										const file = e.target.files[0];
										Image = file;
										previewReader.readAsDataURL(file);
										$(fileInput).val("")
									})

								recordInput = $(create("div"))
									.css("display", "flex")
									.css("flex-direction", "column")
									.append(img)
									.append(fileInput)
							} else {
								recordInput = $(create("input"))
									.attr("class", "new-record-input")
									.attr("type", "text")
									.attr("value", "")
									.attr("placeholder", "Insert record input...")
									.css("color", " #ffffff")
									.css("background-color", "#1b1b1b")
									.css("border", "1px solid #ffffff")
									.on("change", e => {
										Text = $(e.target).val();
									})
							}

							const modal = ModalView({
								content: $(create("div"))
									.append(
										$(create("p"))
											.text("Insert new record:")
											.css("color", "#ffffff")
									)
									.append(
										recordInput
									),
								onConfirm: () => {

									if (!Text && !Image) {
										modal.showErrorMessage("Please insert valid input")
										return;
									}

									modal.disable();

									console.log("post" + " project_id " + state.project.id + " input " + Image)

									api.addRecord({
										project_id: state.project.id,
										Text: Text,
										Image: Image,
										onSuccess: () => {
											modal.hide()
											view.showRecords();
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

				if (!records) return;

				records.forEach(record => {

					let inputView;

					if (state.project.recordType === "Image") {
						inputView = ImageView({
							src: "api/images/" + record.input,
							width: "64px",
							height: "64px"
						})
					} else {
						inputView = $(create("h3"))
							.text(record.input)
					}

					const recordView = $(create("div"))
						.attr("class", "records-list")
						.css("flex-direction", "row")
						.css("display", "flex")
						.css("padding", "8px")
						.append(inputView)
						.click(ev => {
							onRecordClick(record)
						})

					const tagList = create("div")
					$(tagList)
						.css("display", "flex")
						.css("flex-direction", "row")
						.css("flex-wrap", "wrap")

					if (record.tags) {

						record.tags.forEach(tag => {
							$(tagList).append(
								$(create("p"))
									.attr("class", "records-tags-val")
									.text(tag.name + ": " + tag.value)
							);
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

	view.showEvents = () => {

		$(view.eventsTabButton)
			.css("background-color", "#ffa31a")
			.css("color", "rgb(0, 0, 0.9)")
		$(view.tagsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")
		$(view.recordsTabButton)
			.css("background-color", "#1b1b1b")
			.css("color", "#ffffff")

		view.setContent(LoadingView())

		api.getEventsForProject({
			project_id: state.project.id,
			onSuccess: (events) => {

				$(content).empty()

				if (!events) return;

				events.forEach(e => {
					$(content).append(EventView({ e: e }));
				})
			},
			onError: () => {
				ui.showLoginPage();
			}
		});
	}

	view.render = () => {

		view.recordsTabButton = $(create("button"))
			.text("Records")
			.attr("class", "tablink")
			.click(ev => {
				view.setState({
					tabSelected: "Records"
				})
			})

		view.tagsTabButton = $(create("button"))
			.text("Tags")
			.attr("class", "tablink")
			.css("background-color", "#ffa31a")
			.css("color", "rgb(0, 0, 0.9)")
			.click(ev => {
				view.setState({
					tabSelected: "Tags"
				})
			})

		view.eventsTabButton = $(create("button"))
			.text("Events")
			.attr("class", "tablink")
			.click(ev => {
				view.setState({
					tabSelected: "Events"
				})
			})

		$(view).empty()

		$(view)
			.append(
				$(create("div"))
					.css("flex-dirextion", "row")
					.append(
						// Title
						$(create("h2"))
							.text(state.project.title)
							.css("color", "#f90")
							.css("padding-left", "20px")
							.css("display", "inline-block")
					)
					.append(
						$(create("button"))
							.attr("class", "remove-project-button")
							.text("Remove project")
							.append(
								$(create("i"))
									.attr("class", "eos-icons")
									.css("margin-left", "8px")
									.text("remove_circle")
							)
							.click(ev => {
								const modal = ModalView({
									content: $(create("h4"))
										.text("Are you sure you want to delete this project?")
										.css("color", "#f90"),
									onConfirm: () => {
										modal.disable()
										api.removeProject({
											project_id: state.project.id,
											onSuccess: () => {
												modal.hide()
												onRemoveProject()
											},
											onError: () => {
												modal.enable()
												modal.hide()
											}
										})
									},
								})
							})
					)
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
							.append(view.recordsTabButton)
							.append(view.tagsTabButton)
							.append(view.eventsTabButton)
					)
					.append(content)
			)

		if (state.tabSelected === "Records") {
			view.showRecords()
		} else if (state.tabSelected === "Tags") {
			view.showTags();
		} else if (state.tabSelected === "Events") {
			view.showEvents();
		}
	}

	view.setState = (newState) => {
		Object.keys(newState).forEach(key => {
			state[key] = newState[key]
		})
		view.render();
	}

	view.reload();

	return view;
}

const RecordView = ({ record, project, onRemoveRecord, onRecordUpdate }) => {

	const view = $(create("div"))
		.css("display", "flex")
		.css("flex-direction", "column")
		.css("overflow-y", "hidden")

	view.render = () => {
		view.empty();

		const input = $(create("div"))
			.css("display", "flex")
			.css("flex-direction", "row")
			.css("align-items", "center")
			.css("margin", "16px")
			.append(project.recordType === "Image" ?
				ImageView({
					src: "api/images/" + record.input,
					height: "128px",
					width: "128px"
				})
				:
				$(create("h1"))
					.attr("id", "record-view-input")
					.text(record.input)
					.css("padding-left", "20px")
					.css("color", "#f90")
					.css("display", "inline-block")
			)
			.append(
				$(create("button"))
					.attr("class", "modify-input-button")
					.append(
						$(create("i"))
							.attr("class", "eos-icons")
							.text("mode_edit")
					)
					.click(ev => {

						let Image = null;
						let Text = null;

						let recordInput;

						if (project.recordType === "Image") {

							const img = ImageView({
								src: "api/images/" + record.input,
								width: "256px",
								height: "256px"
							})

							$(img)
								.click(e => {
									$(fileInput).trigger("click");
								})
								.on("error", e => { Image = null; })

							const previewReader = new FileReader();
							previewReader.onload = e => {
								img.setSrc(e.target.result)
							}

							const fileInput = $(create("input"))
								.attr("type", "file")
								.css("display", "none")
								.attr("accept", "image/*")
								.on("change", e => {
									const file = e.target.files[0];
									Image = file;
									previewReader.readAsDataURL(file);
									$(fileInput).val("")
								})

							recordInput = $(create("div"))
								.css("display", "flex")
								.css("flex-direction", "column")
								.append(img)
								.append(fileInput)
						} else {
							recordInput = $(create("input"))
								.attr("class", "new-record-input")
								.attr("type", "text")
								.attr("placeholder", "Insert record input...")
								.css("color", " #ffffff")
								.css("background-color", "#1b1b1b")
								.css("border", "1px solid #ffffff")
								.attr("value", record.input)
								.on("change", e => {
									Text = $(e.target).val();
								})
						}

						const modal = ModalView({
							content: $(create("div"))
								.append(
									$(create("h4"))
										.text("Modify input:")
										.css("color", "#ffffff")
								)
								.append(recordInput),
							onConfirm: () => {

								if (!Text && !Image) {
									modal.showErrorMessage("Please insert valid input")
									return;
								}

								modal.disable();

								api.updateInputRecord({
									record_id: record.id,
									Text: Text,
									Image: Image,
									onSuccess: (record2) => {
										modal.hide();
										onRecordUpdate(record2)
									},
									onError: (errorMessage) => {
										modal.showErrorMessage(errorMessage)
										modal.enable()
									}
								})
							}
						})
					})
			)
			.append($(create("div")).css("flex", "1"))
			.append(
				$(create("button"))
					.attr("class", "remove-record-button")
					.text("Remove record")
					.append(
						$(create("i"))
							.attr("class", "eos-icons")
							.css("margin-left", "8px")
							.text("remove_circle")
					)
					.click(ev => {
						const modal = ModalView({
							content: $(create("h4"))
								.text("Are you sure you want to delete this record?")
								.css("color", "#f90"),
							onConfirm: () => {
								modal.disable()
								api.removeRecord({
									record_id: record.id,
									onSuccess: () => {
										modal.hide()
										onRemoveRecord();
									},
									onError: () => {
										modal.enable()
										modal.hide()
									}
								})
							},
						})
					})
			)

		$(view).append(input)

		$(view).append(
			$(create("div"))
				.css("display", "flex")
				.css("flex-direction", "row")
				.css("align-items", "center")
				.append(
					$(create("h2"))
						.text("Tags")
						.css("color", "#f90")
						.css("margin-left", "16px")
				)
				.append(
					$(create("button"))
						.attr("class", "remove-record-button")
						.css("margin-left", "16px")
						.text("+ Add Tag")
						.click(() => {
							const tagNameselect = $(create("select"))

							for (const projectTag of project.tags) {
								$(tagNameselect)
									.attr("class", "new-record-tag-selector")
									.append(
										$(create("option"))
											.attr("value", projectTag.name)
											.text(projectTag.name)
											.css("color", "rgb(0, 0, 0.9)")
									)
							}

							const tagValueSelect = $(create("select"))

							$(tagValueSelect).attr("class", "new-record-tag-value-selector")

							$(tagNameselect).change(() => {

								$(tagValueSelect).empty()

								const tagName = $(tagNameselect).val()

								for (const projectTag of project.tags) {
									if (projectTag.name == tagName) {
										for (const value of projectTag.values) {
											$(tagValueSelect).append(
												$(create("option"))
													.attr("value", value)
													.text(value)
													.css("color", "rgb(0, 0, 0.9)")
											)
										}
										break;
									}
								}
							})

							$(tagNameselect).trigger("change")

							const modal2 = ModalView({
								content: $(create("div"))
									.append(
										$(create("h4"))
											.text("Insert tag name and value:")
											.css("color", "#ffffff")
									)
									.append(tagNameselect)
									.append(tagValueSelect)
								,
								onConfirm: () => {
									const name = $(tagNameselect).val()
									const value = $(tagValueSelect).val()

									if (!value || !name) {
										modal2.showErrorMessage("Please select name and value")
										return;
									}

									modal2.disable()

									api.setTagToRecord({
										record_id: record.id,
										tag_name: name,
										tag_value: value,
										onSuccess: () => {
											modal2.hide()
											api.getRecord({
												id: record.id,
												onSuccess: (record2) => {
													onRecordUpdate(record2)
												},
												onError: () => {
												}
											})

										},
										onError: (errorMessage) => {
											modal2.showErrorMessage(errorMessage)
											modal2.enable()
										}
									})
								}
							})
						})
				)
		)

		const tagsList = $(create("div"))
			.css("display", "flex")
			.css("flex-direction", "column")
			// .css("align-items", "stretch")
			.css("flex-grow", "1")
			.css("min-height", "128px")
			.css("overflow-y", "auto")
			.css("background-color", "#333")
			.css("border-radius", "8px")
			.css("margin", "16px")

		if (record.tags) {
			record.tags.forEach(tag => {

				const select = $(create("select"))
					.attr("class", "select-tag-value-record")
					.change(function () {
						const name = tag.name
						const value = $(select).val()
						api.setTagToRecord({
							record_id: record.id,
							tag_name: name,
							tag_value: value,
							onSuccess: () => { },
							onError: () => { }
						})
					})

				for (const projectTag of project.tags) {
					if (projectTag.name == tag.name) {
						for (const value of projectTag.values) {
							const option = $(create("option"))
								.attr("value", value)
								.css("min-width", "128px")
								.text(value)

							if (value === tag.value)
								$(option).attr("selected", "selected")

							$(select).append(option)
						}
						break;
					}
				}

				const tagView = $(create("div"))
					.css("display", "flex")
					.css("flex-direction", "row")
					.attr("class", "tag-record")
					.css("align-self", "stretch")
					.append(
						$(create("div"))
							.append(
								$(create("h3"))
									.text(tag.name + ": ")
									.css("min-width", "128px")
									.css("color", "#ffffff")
							)
					)
					.append(select)
					.append($(create("div")).css("flex", 1))
					.append(
						$(create("button"))
							.attr("class", "remove-tags-records")
							.append(icon("remove_circle"))
							.click(ev => {
								api.removeTagFromRecord({
									record_id: record.id,
									tag_name: tag.name,
									onSuccess: () => {
										api.getRecord({
											id: record.id,
											onSuccess: (record2) => {
												onRecordUpdate(record2)
											},
											onError: () => {
											}
										})

									},
									onError: () => {
									}

								})
							})
					)

				$(tagsList).append(tagView);
			})
		}

		$(view).append(tagsList)

		const eventsList = $(create("div"))
			.css("display", "flex")
			.css("flex-grow", "1")
			.css("min-height", "128px")
			.css("flex-direction", "column")
			.css("overflow-y", "auto")
			.css("background-color", "#333")
			.css("border-radius", "8px")
			.css("margin", "16px")

		$(view).append(
			$(create("h2"))
				.text("Events")
				.css("color", "#f90")
				.css("margin-left", "16px")
		)

		$(view).append(eventsList)

		api.getEventsForRecord({
			record_id: record.id,
			onSuccess: (events) => {
				$(eventsList).empty()

				if (!events) return;

				events.forEach(e => {
					$(eventsList).append(EventView({ e: e }))
				});
			},
			onError: () => { }
		})
	}

	view.render();

	return view
}

const EventView = ({ e }) => {

	const view = $(create("div"))
		.attr("class", "events-list")

	const description = $(create("h3"))

	const username = $(create("span"))

	$(description)
		.append("User ")
		.append(
			$(username)
				//.text("#" + e.user_id)

		)

	api.getUser({
		id: e.user_id,
		onSuccess: (user) => {
			$(username).text(user.username);
		},
		onError: () => {

		}
	})


	if (e.action === "") {
		$(description)
			.append(" " + e.action + " ")
			.append(
				$(create("span"))
					.text(e.info)
			)
	} else if (e.action === "signed in") {
		$(description)
			.append(" signed in")
	} else if (e.action === "created project") {

		$(description)
			.append(" created Project ")
			.append(
				$(create("span"))
					.text(e.info.project_title)
			)
			//.append(" with title: " + e.info.project_title)

	} else if (e.action === "added record to project") {
		const projectName = $(create("span"))
		
		$(description)
			.append(" added Record ")
			.append(
				$(create("span"))
					.text("#" + e.info.record_id)
			)
			.append(" to Project ")
			.append(
				$(projectName)
					//.text("#" + e.info.project_id)
			)

			api.getProject({
				id: e.info.project_id,
				onSuccess: (project) => {

					$(projectName).text(project.title);
				},
				onError: () => {
	
				}
			})
	} else if (e.action === "deleted project") {
		$(description)
			.append(" deleted Project ")
			.append(
				$(create("span"))
					.text(e.info.title)
			)
	} else if (e.action === "deleted record") {
		$(description)
			.append(" deleted Record ")
			.append(
				$(create("span"))
					.text("#" + e.info.record_id)
			)
	} else if (e.action === "added tag to project") {
		const projectName = $(create("span"))
		$(description)
			.append(" added Tag ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(" to Project ")
			.append(
				$(projectName)
					//.text("#" + e.info.project_id)
			)

			api.getProject({
				id: e.info.project_id,
				onSuccess: (project) => {
					$(projectName).text(project.title);
				},
				onError: () => {
	
				}
			})
	} else if (e.action === "added value to project") {
		const projectName = $(create("span"))
		$(description)
			.append(" added Tag Value ")
			.append(
				$(create("span"))
					.text(e.info.tag_value)
			)
			.append(" for Tag ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(" to Project ")
			.append(
				$(projectName)
					//.text("#" + e.info.project_id)
			)

			api.getProject({
				id: e.info.project_id,
				onSuccess: (project) => {
					$(projectName).text(project.title);
				},
				onError: () => {
	
				}
			})
	} else if (e.action === "removed tag from project") {
		const projectName = $(create("span"))
		$(description)
			.append(" removed Tag ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(" from Project ")
			.append(
				$(projectName)
					//.text("#" + e.info.project_id)
			)

			api.getProject({
				id: e.info.project_id,
				onSuccess: (project) => {
					$(projectName).text(project.title);
				},
				onError: () => {
	
				}
			})
	} else if (e.action === "removed tag value from project") {
		const projectName = $(create("span"))
		$(description)
			.append(" removed Tag Value ")
			.append(
				$(create("span"))
					.text(e.info.tag_value)
			)
			.append(" for Tag ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(" from Project ")
			.append(
				$(projectName)
				//.text("#" + e.info.project_id)
		)

		api.getProject({
			id: e.info.project_id,
			onSuccess: (project) => {
				$(projectName).text(project.title);
			},
			onError: () => {

			}
		})
	} else if (e.action === "set tag to record") {

		$(description)
			.append(" set Tag ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(":")
			.append(
				$(create("span"))
					.text(e.info.tag_value)
			)
			.append(" to Record ")
			.append(
				$(create("span"))
					.text("#" + e.info.record_id)
		)
	} else if (e.action === "removed tag from record") {
		$(description)
			.append(" removed ")
			.append(
				$(create("span"))
					.text(e.info.tag_name)
			)
			.append(" from Record ")
			.append(
				$(create("span"))
					.text("#" + e.info.record_id)
		)
	} else if (e.action === "modified input of record") {
		const recordName = $(create("span"))
		$(description)
			.append(" modified Input for Record ")
			.append(
				$(create("span"))
					.text("#" + e.info.record_id)
		)
	}

	$(view).append(description)

	$(view).append(
		// Space
		$(create("div")).css("flex", "1")
	)

	$(view).append(
		$(create("h3"))
			.append(new Date(e.date).toLocaleString())
	)

	return view;
}