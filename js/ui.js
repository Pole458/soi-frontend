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
		.attr("class", "main-content-div")
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
								.css("color", " #ffffff")
								.css("background-color", "#1b1b1b")
								.css("border", "1px solid #ffffff")


							const modal = ModalView({
								content: $(create("div"))
									.append(
										$(create("p"))
											.text("Insert new project name:")
											.css("color", "#ffffff")
									)
									.append(
										titleinput
									)
									.append(
										$(create("p"))
											.text("Select type of project")
											.css("color", "#ffffff")
									)
									.append(
										$(create("select"))
											.attr("class", "type-project-selector")
											.append(
												$(create("option"))
													.attr("Value", "Text")
													.text("Text")
													.css("color", "rgb(0, 0, 0.9)")
											)
											.append(
												$(create("option"))
													.attr("Value", "Images")
													.text("Images")
													.css("color", "rgb(0, 0, 0.9)")
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
						},
						onRemoveProject: () => {
							view.showProjects()
						},
						refreshPage: (project_id) => {
							view.showProject(project_id)
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
				projectTags: view.selectedProject.tags,
				onRemoveRecord: () => {
					view.showProjects()
				},
				onTagToRecord: (record) => {
					view.showRecord(record)
				}
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
						.text(token.id)
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

const ProjectView = ({ project, onRecordClick, onRemoveProject, refreshPage }) => {

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
		// .append(
		// 	$(create("div"))
		// 		.attr("class", "fab")
		// 		.append(
		// 			$("<i></i>")
		// 				.attr("class", "eos-icons")
		// 				.text("add")
		// 		)
		// 		.click(ev => {
		// 			ModalView({
		// 				content: $(create("div"))
		// 					.append(
		// 						$(create("h4"))
		// 							.text("Add new tag: ")
		// 					)
		// 					.append(
		// 						$("<input></input>")
		// 							.attr("class", "new-tag-input")
		// 							.attr("type", "text")
		// 							.attr("name", "new-tag-name")
		// 							.attr("value", "")
		// 							.attr("placeholder", "Insert tag name")
		// 					),
		// 				onConfirm: () => {

		// 				}
		// 			})
		// 		})
		// )

	view.setContent = (v) => {
		$(content).empty()
		$(content).append(v)
	}

	const tagsTabButton = $(create("button"))
		.text("Tags")
		.attr("class", "tablink")
		.css("background-color", "#ffa31a")
		.css("color", "rgb(0, 0, 0.9)")
		.click(ev => {
			$(tagsTabButton)
				.css("background-color", "#ffa31a")
				.css("color", "rgb(0, 0, 0.9)")
			$(recordsTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")
			view.showTags()
		})

	const recordsTabButton = $(create("button"))
		.text("Records")
		.attr("class", "tablink")
		.click(ev => {
			$(recordsTabButton)
				.css("background-color", "#ffa31a")
				.css("color", "rgb(0, 0, 0.9)")
			$(tagsTabButton)
				.css("background-color", "#1b1b1b")
				.css("color", "#ffffff")
			view.showRecords();
		})

	$(view)
		.append(
			$(create("div"))
				.css("flex-dirextion", "row")
				.append(
						// Title
						$(create("h2"))
							.text(project.title)
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
								api.removeProject({
									project_id: project.id,
									onSuccess: () => {
										onRemoveProject()
									},
									onError: () => {
										
									}
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
									.append(
										taginput
									),
								onConfirm: () => {
									const tag_name = $(taginput).val()

									if (!tag_name) {
										modal.showErrorMessage("Please insert valid tag")
										return;
									}

									modal.disable()
									api.addTagToProject({
										project_id: project.id,
										tag_name: tag_name,
										onSuccess: () => {
											modal.hide()
											refreshPage(project.id)
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
								.click(ev => {
									api.removeTagFromProject({
										project_id: project.id,
										tag_name: tag.name,
										onSuccess: () => {
											refreshPage(project.id)
											
										},
										onError: () => {
										}
		
									})
								})
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
									api.removeTagValueFromProject({
										project_id: project.id,
										tag_name: tag.name,
										tag_value: value,
										onSuccess: () => {
											refreshPage(project.id)
											
										},
										onError: () => {
										}
									})
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
								project_id: project.id,
								tag_name: tag.name,
								tag_value: tagValue,
								onSuccess: () => {
									modalVal.hide()
									refreshPage(project.id)
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
		view.setContent(LoadingView())

		api.getRecords({
			id: project.id,
			onSuccess: (records) => {

				$(content).empty()

				$(content).append(
					Fab({
						onClick: () => {
							const recordinput = $(create("input"))
								.attr("class", "new-record-input")
								.attr("type", "text")
								.attr("value", "")
								.attr("placeholder", "Insert record input...")
								.css("color", " #ffffff")
								.css("background-color", "#1b1b1b")
								.css("border", "1px solid #ffffff")


							const modal = ModalView({
								content: $(create("div"))
									.append(
										$(create("p"))
											.text("Insert new record:")
											.css("color", "#ffffff")
									)
									.append(
										recordinput
									),
								onConfirm: () => {
									const input = $(recordinput).val()

									if (!input) {
										modal.showErrorMessage("Please insert valid input")
										return;
									}

									modal.disable()
									
									console.log(project.id)
									api.addRecord({
										project_id: project.id,
										input: input,
										onSuccess: () => {
											modal.hide()
											refreshPage(project.id)
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

const RecordView = ({ record, projectTags, onRemoveRecord, onTagToRecord }) => {

	const view = create("div")

	

	const input = create("div");
	$(input)
		.css("flex-direction", "row")
		//.css("display", "flex")
		.append(
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
					const modal = ModalView({
						content: $(create("div"))
							.append(
								$(create("h4"))
									.text("Modify input:")
									.css("color", "#ffffff")
							)
							.append(
								$(create("input"))
									.attr("class", "input-modifier")
									.attr("id", "record-input-modifier")
									.attr("type", "text")
									.attr("name", "record-input-mod")
									.attr("value", record.input)
							),
						onConfirm: () => { 
							const input = $("#record-input-modifier").val()

							if (!input) {
								modal.showErrorMessage("Please insert valid input")
								return;
							}

							modal.disable()

							api.modifyInputRecord({
								record_id: record.id,
								input: input,
								onSuccess: () => {
									$("#record-view-input").text(input);
									modal.hide()
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
					api.removeRecord({
						record_id: record.id,
						onSuccess: () => {
							onRemoveRecord();
						},
						onError: () => {
							
						}
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
				.attr("class", "select-tag-value-record")
				.change(function() {
					const name = tag.name
					const value = $(select).val()
					api.setTagToRecord({
						record_id: record.id,
						tag_name: name,
						tag_value: value,
						onSuccess: () => {				
						},
						onError: () => {
						}
					})
				})
				//.attr("onchange", "if (this.selectedIndex) doSomething();")
			for (const projectTag of projectTags) {
				if (projectTag.name == tag.name) {
					for (const value of projectTag.values) {
						const option = $(create("option"))
							.attr("value", value)
							.css("color", "rgb(0, 0, 0.9)")
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
						.click(ev => {
							api.removeTagFromRecord({
								record_id: record.id,
								tag_name: tag.name,
								onSuccess: () => {
									api.getRecord({
										id: record.id,
										onSuccess: (record2) => {
											onTagToRecord(record2)
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

	$(view).append(
		Fab({
			onClick: () => {

				const tagNameselect = $(create("select"))

				for (const projectTag of projectTags) {
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
				
				$(tagValueSelect).attr("class","new-record-tag-value-selector")

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
										.css("color", "rgb(0, 0, 0.9)")
								)
							}
							break;
						}
					}
				})

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
										onTagToRecord(record2)
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
			}
		})
	)

	return view
}