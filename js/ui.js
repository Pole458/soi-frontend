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

	$("#username").text(token.username);

	$("#main-page-content").empty();

	// Show
	$("#main-page").removeAttr("hidden");

	// API call to fill the page
	api.getProjects();
}

ui.showProjects = (projects) => {

	//if (!projects) 
		
	

	if (projects) {
		projects.forEach(project => {

			// Create an item for the project
			const item = document.createElement("div");

			$(item)
				.attr("class", "project")
				.append($("<h3></h3>").text(project.title))
				.click(ev => {
					api.getProject(project.id);
				})

			$("#main-page-content").append(item);
		});

	}

	const item2 = document.createElement("div");
	$(item2)
		.attr("class", "project")
		.append($("<h3></h3>").text("+ Add new project"))
		.click(ev => {
			ui.openModalBox();
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
	
	$("#main-page-content").append(item2);

}

ui.openModalBox = () => {
	const modal = document.createElement("div");
	$(modal)
		.attr("class", "modal-box")
		.append(
			$("<div></div>")
				.attr("id", "modal-content-id")
				.attr("class", "modal-content")
				.css("position", "relative")
				.append(
					$("<form></form>")
						.attr("class", "modal-buttons")
						.append(
							$("<button></button>")
								.text("Confirm")
								.attr("class", "modal-button")
								.click(ev => {
									$(modal).remove();
								})
						)
						.append(
							$("<button></button>")
								.text("Cancel")
								.attr("class", "modal-button")
								.click(ev => {
									$(modal).remove();
								})
								.css("margin-left", "4px")
						)
				)
		)

	$("#main-page-content").append(modal);

	
}

ui.showProject = (project) => {

	// Change path
	$("#path-project").children("span").text(project.title);
	$("#path-project").removeAttr("hidden");
	$("#path-dataset").attr("hidden", true);
	$("#path-record").attr("hidden", true);

	// Change main page content
	$("#main-page-content").empty();

	const title = document.createElement("h2");
	$(title)
		.text(project.title);
	$("#main-page-content").append(title);

	const tabs1 = document.createElement("div");
	$(tabs1)
		.css("display", "flex")
		.css("flex-direction", "row")
		.css("height", "100%")
		.append(
			$("<div></div>")
				.attr("class", "tabs")
				.append(
					$("<button></button>")
						.text("Tags")
						.attr("id","tags-tab-button")
						.attr("class", "tablink")
						.css("background-color", "#ccc")
						.click(ev => {
							ui.openTabs("Tags");
						})
				)
				.append(
					$("<button></button>")
						.text("Records")
						.attr("id","records-tab-button")
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
						.attr("class", "tags-list")
						.text("Tag pog")
				)
				.append(
					$("<div></div>")
						.attr("class", "tags-list")
						.append($("<h3></h3>").text("+ Add new tag"))
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
						.attr("class", "records-list")
						.text("Record maghemme")
				)
				.append(
					$("<div></div>")
						.attr("class", "records-list")
						.append($("<h3></h3>").text("+ Add new record"))
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
	api.getRecords(project.id)

}

ui.showTags = (tags) => {
	var i = 0;

	if (tags) {
 		tags.forEach(tag => {
			const item1 = document.createElement("div")

			$(item1)
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
			
			const div1 = document.createElement("div")
			$(div1)
				.css("display", "flex")


			if(tag.values){
				while(i<tag.values.length){
					console.log(tag.values[i])
					const item2 = document.createElement("div")

					$(item2)
						.attr("class", "project-tags-val")
						.text(tag.values[i])
						.append(
							$("<i></i>")
								.attr("class", "eos-icons")
								.text("remove_circle")
								.attr("id", "eos-remove-project-tag")
								.css("margin-left", "10px")
								.css("margin-right", "10px")
								.css("margin-top", "6px")
								.css("text-align", "center")
								.click(ev => {
									$(item2).remove();
								})
						)
					$(div1).append(item2);
					i++;
				}
			}

			const item2 = document.createElement("div")
			$(item2)
				.attr("class", "project-tags-val")
				.attr("id", "add-tag-value-project")
				.css("cursor", "pointer")
				.text("+ Add new val")
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
					
			$(div1).append(item2);

			$(item1).append(div1)

			$("#tags-tabcontent").append(item1);
		 })
		
		}

}

ui.showRecords = (records) => {
	if (records) {
 		records.forEach(record => {
			const item1 = document.createElement("div")

			$(item1)
				.attr("class", "records-list")
				.css("flex-direction", "row")
				.css("display", "block")
				.click(ev => {
					api.getRecord(record.id);
				})
				.append(
					$("<h3></h3>")
						.text(record.input)
					)
			
			const div1 = document.createElement("div")
			$(div1)
				.css("display", "flex")

			if(record.tags){

				record.tags.forEach(tag =>{
					console.log(tag.name)
					const item2 = document.createElement("div")

					$(item2)
						.attr("class", "records-tags-val")
						.text(tag.name + ": " + tag.value)
					
					$(div1).append(item2);
				})
			}

			$(item1).append(div1)

			$("#records-tabcontent").append(item1);
		 })
		
		}

}

ui.openTabs = (text) => {

	if(text == "Tags"){
		$("#records-tabcontent")
			.css("display", "none")
		$("#records-tab-button")
			.css("background-color", "#f1f1f1")
		$("#tags-tabcontent")
			.css("display", "block")
		$("#tags-tab-button")
			.css("background-color", "#ccc")
	}

	if(text == "Records"){
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

ui.showRecord = (record) => {
	$("#path-record").children("span").text(record.title);
	$("#path-record").removeAttr("hidden");
	$("#path-dataset").attr("hidden", true);


	$("#path-project").click(ev => {
		ev.preventDefault();
		api.getProject(record.project_id);
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

	if(record.tags){

		record.tags.forEach(tag =>{
			//console.log(tag.name)
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
						.append(
							$("<option></option>")
								.attr("Value", "pog")
								.text("pog")
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


}

ui.hideProjectPage = () => {
	// Hide
	$("#project-form").attr("hidden", true);
}

ui.logIn = () => {
	// Update token value stored in cookie
	token = getCookieJSON("token");
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

		console.log(username);
		console.log(password);

		// Check user input
		if (!username || !password) {
			ui.showLogInError("Please insert valid username and password");
			return;
		};

		if (value == 'login') {
			api.logIn(username, password)
		} else if (value == 'signin') {
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