$(document).ready(init);

function init() {
    $("#hunt-form-submit-btn").click(submitHuntForm);
}

function submitHuntForm() {
    postHuntData();
    return false;		// 
}
/**
 * ajax call for creation of new hunt
 */
function postHuntData() {
    
	// get all the data from the user input fields
	var data = new Object();

	data["name"] = $("#hunt-name").val();
	data["abbreviation"] = $("#hunt-abbreviation").val();
	data["description"] = $("#hunt-description").val();
	data["city"] = $("#hunt-city").val();
	data["state"] = $("#hunt-state").val();
	data["zip"] = $("#hunt-zip").val();
	data["date_start"] = $("#hunt-start-date").val();
	data["date_end"] = $("#hunt-end-date").val();
	data["superbadge"] = $("#hunt-super-badge").val();
	//data["audience"] = $("#hunt-  ").val();
	data["sponsor"] = $("#hunt-sponsor").val();

	var form = new FormData();
	
	form.append("name", $("#hunt-name").val());
	form.append("audience", "string");
	form.append("date_end", "1902-01-10");
	form.append("date_start", "2120-12-25");
	form.append("name", "string");
	form.append("ordered", "0");
	form.append("summary", "string");
	form.append("sponsor", "string");
	form.append("super_badge", "string");
	form.append("city", "City");
	form.append("state", "WA");
	form.append("zipcode", "99227");

	console.log(form);
	
	// get the token and add it to the ajax call
	var token = localStorage.getItem("token");
	
	if (token == null)
	{
		alert("token is null");
	}
	
	// send to server

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts",
	  "method": "POST",
	  "headers": {
		  "Authorization" : "Bearer " + token
		},
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});
	
	// if response is status 200 then go to next page
	
	
	// else display an alert and do not go to next page
	
	
	//return false;
}
