
var huntID;

$(document).ready(init);



function init() {
    $("#hunt-form-submit-btn").click(submitHuntForm);		// Submit a hunt
    $("#hunt-form-back-btn").click(goBack);					// go back
        
    // if GET parameters passed, load the page with an AJAX call.
    huntID = findGetParameter('huntID');
    
    if (huntID != null)
    {
		populateHuntForm(huntID);
	}
}



// How to retrieve get parameters
//https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}


// Replicate the browser's back button
function goBack()
{
	window.history.back();
	return false;
}


function submitHuntForm() {
    postHuntData();		// the boolean returned determines if the page moves on or not
    return false;
}


function populateHuntForm(huntID) {
	getHuntData(huntID);
	return false;
}


/**
 * Get an existing Hunt and populate the web page.
 * 
 * Takes a hunt_id number.
 */

function getHuntData(huntID) {
	
	// get the token and add it to the ajax call
	var token = localStorage.getItem("token");
	
	if (token == null)
	{
		alert("token is null");
	}
		
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + huntID,
		"method": "GET",
		"headers": {
		  "Authorization" : "Bearer " + token
		}
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		
		var hunt = JSON.parse(response).data;

		// disable input fields if the Hunt is anything other than non-approved
		if (hunt.approval_status != "non-approved")
		{
			$(".input").prop('disabled', true);
		}
		
		$("#hunt-name").val(hunt.name);
		$("#hunt-abbreviation").val(hunt.abbreviation);
		//form.append("audience", "string");
		$("#hunt-end-date").val(hunt.date_end);
		$("#hunt-start-date").val(hunt.date_start);
		$("#hunt-description").val(hunt.summary);
		$("#hunt-sponsor").val(hunt.sponsor);
		//$("#hunt-super-badge").val(hunt.super_badge);
		$("#hunt-city").val(hunt.city);
		$("#hunt-state").val(hunt.state);
		$("#hunt-zip").val(hunt.zipcode);
		
	});
	
	
}


/**
 * Submit a Hunt for creation
 */
function postHuntData() {
    
    // get the token and add it to the ajax call
	var token = localStorage.getItem("token");
	
	if (token == null)
	{
		alert("token is null");
	}
    
	// get all the data from the user input fields
	var form = new FormData();
	
	form.append("name", $("#hunt-name").val());
	form.append("abbreviation", $("#hunt-abbreviation").val());
	//form.append("audience", "string");
	form.append("date_end", $("#hunt-end-date").val());
	form.append("date_start", $("#hunt-start-date").val());
	form.append("summary", $("#hunt-description").val());
	form.append("sponsor", $("#hunt-sponsor").val());
	form.append("super_badge", $("#hunt-super-badge").val());
	form.append("city", $("#hunt-city").val());
	form.append("state", $("#hunt-state").val());
	form.append("zipcode", $("#hunt-zip").val());

	console.log(form);

	// add on the /hunt_id if it exists
	var huntExt = "";
	
	if (huntID != null)
	{
		huntExt = "/" + huntID;
		
	}

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts" + huntExt,
	  "method": "POST",
	  "headers": {
		  "Authorization" : "Bearer " + token
		},
		"success": function(data){
			console.log(data);
		},
		"error" : function(data){
			return false;
		},
		"statusCode": {
			404: function() {
			  alert('Hunt not found!');
			},

			400: function() {
			   alert('bad request!');
		   }
	   },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form
	};

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  //go to the next page
	  var huntID = JSON.parse(response).data.hunt_id;
	  var nextPage = 'review-hunt.html?huntID=' + huntID;
	  window.location.replace(nextPage);
	});

}
