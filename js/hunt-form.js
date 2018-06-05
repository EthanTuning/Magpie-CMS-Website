
var huntID;

$(document).ready(init);



function init() {
    $("#hunt-form-submit-btn").click(submitHuntForm);		// Submit a hunt
    $("#hunt-form-back-btn").click(goBack);					// go back
    $("#hunt-super-badge").change(superbadgeFileChange);
    // if GET parameters passed, load the page with an AJAX call.
    huntID = findGetParameter('huntID');
    
    $("select").imagepicker();	//imagepicker stuff, makes superbadge grid
    
    
    
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


/***  Populate the Superbadge selection grid ***/
function makeSuperbadgeGrid()
{
	
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
		},
		"error" : function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
		//console.log(response);
		
		var hunt = JSON.parse(response).data;

		// disable input fields if the Hunt is anything other than non-approved
		if (hunt.approval_status != "non-approved")
		{
			$("input").prop('disabled', true);
			$("textarea").prop('disabled', true);
			$("select").prop('disabled', true);
		}
		
		$("#hunt-name").val(hunt.name);
		$("#hunt-abbreviation").val(hunt.abbreviation);
		$("input[name=audience][value=" + hunt.audience + "]").prop('checked', true);
		$("#hunt-end-date").val(hunt.date_end);
		$("#hunt-start-date").val(hunt.date_start);
		$("#hunt-description").val(hunt.summary);
		$("#hunt-sponsor").val(hunt.sponsor);
		$("#hunt-city").val(hunt.city);
		$("#hunt-state").val(hunt.state);
		$("#hunt-zip").val(hunt.zipcode);
		
		// for superbadge, use session storage to store the image URL.
		// this gets sent back to the database in place of an image, if no image is selected.
		sessionStorage.setItem('superbadgeURL', hunt.super_badge.href);
		
		// add superbadge preview to page
		$("#super-badge-image").prop("src" , hunt.super_badge.href);
		
	});
	
}


// Change the superbadge preview icon when selecting a new image
function superbadgeFileChange(event)
{
	var output = document.getElementById('super-badge-image');
    output.src = URL.createObjectURL(event.target.files[0]);
}


/**
 * Submit a Hunt for creation
 */
function postHuntData() {
    
    //if the page is locked for editing don't do an API call, just go to the next page
    if ($("#hunt-name").prop('disabled') == true)
    {
		var nextPage = 'review-hunt.html?huntID=' + huntID;
		window.location.replace(nextPage);
	}
    
    // otherwise,
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
	form.append("audience", $('#hunt-audience input[type=radio]:checked').val());
	form.append("date_end", $("#hunt-end-date").val());
	form.append("date_start", $("#hunt-start-date").val());
	form.append("summary", $("#hunt-description").val());
	form.append("sponsor", $("#hunt-sponsor").val());
	form.append("city", $("#hunt-city").val());
	form.append("state", $("#hunt-state").val());
	form.append("zipcode", $("#hunt-zip").val());

	/// superbadge block ///
	
	var picker = $("#hunt-super-badge-picker").val();
	
	if (picker != "")
	{
		//Picker selected, use that value as URL for superbadge
		form.append("super_badge", picker);
	}
	else
	{
		// File upload
		var file = document.getElementById("hunt-super-badge").files[0];
		
		if (file != null)
		{
			// append the file
			form.append("super_badge", file);
		}
		else
		{
			// get the already existing superbadge URL that was saved
			var sburl = sessionStorage.getItem('superbadgeURL');
			form.append("super_badge", sburl);
		}
	}
	/// end superbadge block ///

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
		"statusCode": {
			404: function(e) {
				alert(e.responseText);
			},
			400: function(e) {
				alert(e.responseText);
			},
			500: function(e) {
				alert(e.responseText);
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
