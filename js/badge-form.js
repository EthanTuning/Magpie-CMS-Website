//lock the QR buttons since they aren't being used

$(document).ready(init);

var _token;// = getTok();
var _huntId;// = getUrlVars()["huntID"];
var _badgeId;// = getUrlVars()["badgeID"];

function init() {
    lockQRButtons();

	_token = getTok();
	_huntId = getUrlVars()["huntID"];
	_badgeId = getUrlVars()["badgeID"];
	
	huntStatus();  // set the input disable/enable based on hunt status
	
	// if a badgeID was passed, load in that badge
	if (_badgeId != null)
	{
		setBadgeData();
	}
	
	$("#badge-form-back-btn").click(goBack);
	$("#badge-form-save-btn").click(foo);
}


function foo()
{
	postBadge();
	return false;
}

// Replicate the browser's back button
function goBack()
{
	window.history.back();
	return false;
}


/*sets the badge-form to read only*/
function setToReadOnly() {
    
}

function huntStatus() {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://magpiehunt.com/api/v1/hunts/" + _huntId,
        dataType: "text",
        timeout: 600000,
        "headers": {
            "Authorization": "Bearer " + _token,
        },
        success: function (data) {
            var status = JSON.parse(data).data.approval_status;

            //disable inputs if hunt isn't approved
			if (status != "non-approved")
			{
				$(".input").prop('disabled', true);
			}
        },
        error: function (e) {
            alert("Error encountered while getting the status of hunt: " + _huntId);
        }
    });
}

/*
function setFields(status) {
    if (status == "submitted") {
        //populate & set to read only
        setBadgeData();
        setToReadOnly();
    } else if(status == "published"){
        setToReadOnly();
    }
}
*/
/*lock the QR code radio buttons*/
function lockQRButtons() {
    $("#badge-form :input[type=radio]").attr('disabled', true);

}

function getTok() {
    var tok = localStorage.getItem("token");
    return tok;
}

/** Get a Badge, populate fields **/
function populateFields(badgeData) {
    /*populates: badge name, description, location. will need to hide last 3 fields*/
    $("#badge-name").val(badgeData.name);
    $("#badge-description").val(badgeData.landmark_name);
    $("#badge-latitude").val(badgeData.lat);
    $("#badge-longitude").val(badgeData.lon);
}

function setBadgeData() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://magpiehunt.com/api/v1/hunts/" + _huntId +"/badges/" + _badgeId,
        dataType: "text",
        timeout: 600000,
        "headers": {
            "Authorization": "Bearer " + _token,
        },
        success: function (data) {
            var badge = JSON.parse(data);
            populateFields(badge.data);
        },
        error: function (e) {
            alert("Error encountered while getting badge: #" + _badgeId);
        }
    });
}


/** Submit a badge **/

//if the page is locked for editing don't do an API call, just go to the next page
function postBadge()
{
    if ($("#badge-name").prop('disabled') == true)
    {
		var nextPage = 'review-hunt.html?huntID=' + _huntId;
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
	
	form.append("description", $("#badge-description").val());
	form.append("icon", $("#badge-icon").val());
	//form.append("audience", "string");
	form.append("image", $("#badge-landmark-image").val());
	form.append("name", $("#badge-name").val());
	form.append("lat", $("#badge-latitude").val());
	form.append("lon", $("#badge-longitude").val());

	console.log(form);

	// add on the /hunt_id if it exists
	var badgeExt = "";
	
	if (_badgeId != null)
	{
		badgeExt = "/" + _badgeId;
	}

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts/" + _huntId + "/badges" + badgeExt,
	  "method": "POST",
	  "headers": {
		  "Authorization" : "Bearer " + token
		},
		"statusCode": {
			404: function() {
			  alert('Badge not found!');
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
	  var nextPage = 'review-hunt.html?huntID=' + _huntId;
	  window.location.replace(nextPage);
	});
}

