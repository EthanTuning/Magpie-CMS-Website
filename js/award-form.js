//lock the QR buttons since they aren't being used

$(document).ready(init);

var _token;
var _huntId;
var _awardId;
var _marker;		// google maps marker


function init() {
    lockQRButtons();

	_token = getTok();
	_huntId = getUrlVars()["huntID"];
	_awardId = getUrlVars()["awardID"];
	
	huntStatus();  // set the input disable/enable based on hunt status
	
	// if a awardID was passed, load in that award
	if (_awardId != null)
	{
		setawardData();
	}
	
	$("#btn-location").click(getCurrentLocation);
	$("#award-form-back-btn").click(goBack);
	$("#award-form-save-btn").click(foo);
}


function foo()
{
	postaward();
	return false;
}

// Replicate the browser's back button
function goBack()
{
	window.history.back();
	return false;
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


/*lock the QR code radio buttons*/
function lockQRButtons() {
    $("#award-form :input[type=radio]").attr('disabled', true);

}


function getTok() {
    var tok = localStorage.getItem("token");
    return tok;
}


/** Get a award, populate fields **/
function populateFields(awardData) {
    /*populates: award name, description, location. will need to hide last 3 fields*/
    $("#award-name").val(awardData.name);
    $("#award-value").val(awardData.award_value);
    $("#award-location-name").val(awardData.address);
    $("#award-latitude").val(awardData.lat);
    $("#award-longitude").val(awardData.lon);
    $("#award-terms-and-conditions").val(awardData.description);
}


function setawardData() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://magpiehunt.com/api/v1/hunts/" + _huntId +"/awards/" + _awardId,
        dataType: "text",
        timeout: 600000,
        "headers": {
            "Authorization": "Bearer " + _token,
        },
        success: function (data) {
            var award = JSON.parse(data);
            populateFields(award.data);
        },
        error: function (e) {
            alert("Error encountered while getting award: #" + _awardId);
        }
    });
}


/** Submit a award **/

//if the page is locked for editing don't do an API call, just go to the next page
function postaward()
{
    if ($("#award-name").prop('disabled') == true)
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
	
	form.append("name", $("#award-name").val());
	form.append("award_value", $("#award-value").val());
	form.append("address", $("#award-location-name").val());
	form.append("description", $("#award-terms-and-conditions").val());
	form.append("lat", $("#award-latitude").val());
	form.append("lon", $("#award-longitude").val());

	console.log(form);

	// add on the /award_id if it exists
	var awardExt = "";
	
	if (_awardId != null)
	{
		awardExt = "/" + _awardId;
	}

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts/" + _huntId + "/awards" + awardExt,
	  "method": "POST",
	  "headers": {
		  "Authorization" : "Bearer " + token
		},
		"statusCode": {
			404: function() {
			  alert('award not found!');
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

function initMap() {
    var lat = document.getElementById("award-latitude").value;
    var lon = document.getElementById("award-longitude").value;

    if(lat == null || lon == null || lat == "" || lon == "") {
        //EWU coordinates used as default
        lat = 47.4906;
        lon = -117.5855;
    }

    console.log("lat is " + lat + " long is " + lon);
    var myLatLng = {lat: parseFloat(lat), lng: parseFloat(lon)};

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: myLatLng
    });

    _marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable: true,
        title: 'Hello World!'
    });
    google.maps.event.addListener(_marker, 'dragend', function(event) {
        document.getElementById("award-latitude").value = this.getPosition().lat();
        document.getElementById("award-longitude").value = this.getPosition().lng();
    })
}


//gets the current location from the browser (should work in FF/Chrome, only tested in Chrome)
function getCurrentLocation()
{
	navigator.geolocation.getCurrentPosition(setLatLong);
	return false;
}


//call function for getCurrentLocation()
function setLatLong(position)
{
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	
	$("#award-latitude").val(lat);
    $("#award-longitude").val(lon);
    
    _marker.setPosition( new google.maps.LatLng( lat,lon ) );
    map.panTo( new google.maps.LatLng( lat,lon ) );
}


