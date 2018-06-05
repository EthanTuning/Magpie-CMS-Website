//lock the QR buttons since they aren't being used

$(document).ready(init);

var _token;
var _huntId;
var _badgeId;
var _marker;		// google maps marker


function init() {
    lockQRButtons();

	_token = getTok();
	_huntId = getUrlVars()["huntID"];
	_badgeId = getUrlVars()["badgeID"];
	
	huntStatus();  // set the input disable/enable based on hunt status
	
	// if a badgeID was passed, load in that badge
	if (_badgeId != null && _badgeId != "")
	{
		setBadgeData();
	}
	
	$("#dropPin").click(function (event) {return false;});
	$("#badge-landmark-image").change(landmarkFileChange);		// when file selector changes, update preview
	$("#badge-icon").change(iconFileChange);
	$("#btn-location").click(getCurrentLocation);
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


// Change the preview when selecting a new image
function landmarkFileChange(event)
{
	var output = document.getElementById('badge-landmark-image-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
}



// Change the preview icon when selecting a new image
function iconFileChange(event)
{
	var output = document.getElementById('badge-icon-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
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
    
    //store image URLs
    sessionStorage.setItem('iconURL', badgeData.icon.href);
    sessionStorage.setItem('imageURL', badgeData.image.href);
		
	// add image preview to page
	$("#badge-icon-preview").prop("src" , badgeData.icon.href);
	$("#badge-landmark-image-preview").prop("src" , badgeData.image.href);
    
	initMap();	// initialize the map here, because otherwise the map thinks there's no lat/long
}


function setBadgeData() {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://magpiehunt.com/api/v1/hunts/" + _huntId +"/badges/" + _badgeId,
        dataType: "text",
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
	form.append("name", $("#badge-name").val());
	form.append("lat", $("#badge-latitude").val());
	form.append("lon", $("#badge-longitude").val());

	// Icon File upload
	var icon = document.getElementById("badge-icon").files[0];
	
	if (icon != null)
	{
		// append the file
		form.append("icon", icon);
	}
	else
	{
		// get the already existing superbadge URL that was saved
		form.append("icon", sessionStorage.getItem('iconURL'));
	}
	
	// Landmark Image File upload
	var image = document.getElementById("badge-landmark-image").files[0];
	
	if (image != null)
	{
		// append the file
		form.append("image", image);
	}
	else
	{
		// get the already existing superbadge URL that was saved
		form.append("image", sessionStorage.getItem('imageURL'));
	}

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


function initMap() {
    var lat = $("#badge-latitude").val();
    var lon = $("#badge-longitude").val();

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

	//var marker
    _marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        draggable: true,
        title: 'Hello World!'
    });
    
    google.maps.event.addListener(_marker, 'dragend', function(event) {
        document.getElementById("badge-latitude").value = this.getPosition().lat();
        document.getElementById("badge-longitude").value = this.getPosition().lng();
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
	
	$("#badge-latitude").val(lat);
    $("#badge-longitude").val(lon);
    
    _marker.setPosition( new google.maps.LatLng( lat,lon ) );
    map.panTo( new google.maps.LatLng( lat,lon ) );
}
