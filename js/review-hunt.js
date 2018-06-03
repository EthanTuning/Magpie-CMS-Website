$(document).ready(function(){
    if (!isEditable) {
        // remove hunt submission button
        document.getElementById("submit-hunt-form-approval-btn").remove();
    }
    
    loadHunt();
    loadBadges();
    loadAwards();
    
});

// check if hunt is editable or not
var isEditable;
$.ajax({
    type: "GET",
    "async": false,
    contentType: "application/json",
    url: "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"],
    dataType: "text",
    timeout: 600000,
    "headers": {
        "Authorization": "Bearer " + localStorage.getItem("token"),
    },
    success: function (data) {
        var temp = JSON.parse(data);
        var status = temp["data"]["approval_status"];

        if (status === "non-approved") {
            isEditable = true;
        } else {
            isEditable = false;
        }
    },
    error: function (e) {
        alert("Error encountered while getting the status of hunt: " + getUrlVars()["huntID"]);
    }
});


function loadHunt()
{
	///////////////////////////
	// populate hunt details //
	///////////////////////////
	var huntSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"],
		"method": "GET",
		"headers": {
			"Authorization": "Bearer " + localStorage.getItem("token"),
			"Cache-Control": "no-cache",
		}
	};
	$.ajax(huntSettings).done(function (response) {
		var huntJSON = JSON.parse(response);

		// fill in hunt info
		document.getElementById("review-hunt-abbreviation").innerText = huntJSON["data"]["abbreviation"];
		document.getElementById("review-hunt-name").innerText = huntJSON["data"]["name"];
		document.getElementById("review-hunt-description").innerText = huntJSON["data"]["summary"];
		
		// set the superbadge
		var superbadge;
		
		try
		{
			var superbadge = huntJSON["data"]["super_badge"]["href"];
		}
		catch (error)
		{
			superbadge = "";
		}
		
		if (superbadge != "")
		{
			$("#review-hunt-super-badge").attr("src", huntJSON["data"]["super_badge"]["href"]);
		}
		
		// set hunt links
		
		var link = "hunt-form.html?huntID=" + getUrlVars()["huntID"];
		
		$("#review-hunt-super-badge-image-link").prop("href", link);
		$("#review-hunt-badge-view-btn").prop("href", link);
		$("#review-hunt-badge-edit-btn").prop("href", link);
		// delete is removed from this page and will be on hunts.html page
	});
}

function loadBadges()
{
	/////////////////////
	// populate badges //
	/////////////////////
	var badgeSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"] + "/badges",
		"method": "GET",
		"headers": {
			"Authorization": "Bearer " + localStorage.getItem("token"),
			"Cache-Control": "no-cache",
		},
	};
	$.ajax(badgeSettings).done(function (response) {
		// badges exists
		var badgesJSON = JSON.parse(response);

		// loop through json badges
		for (var i = 0; i < badgesJSON.length; i++) {
			console.log(badgesJSON[i]["data"]["badge_id"]);

			// create current badge html w/ delete button
			var badgeHTML = "<div class=\"column is-one-quarter\">\r\n" +
				"<p id=\"review-hunt-badge-name\" class=\"content\">" + badgesJSON[i]["data"]["name"] + "<\/p>\r\n" +
				"<a href=\"badge-form.html?huntID=" + getUrlVars()["huntID"] + "&badgeID=" + badgesJSON[i]["data"]["badge_id"] + "\">\r\n" +
				"<img id=\"review-hunt-badge-image\" src=\"" + badgesJSON[i]["data"]["icon"]["href"] + "\">\r\n" +
				"</a>\r\n" +
				"<div class=\"field is-grouped\">\r\n" +
				"<a id=\"review-hunt-badge-view-btn\" class=\"button is-rounded btn-standard icon ion-md-eye\" href=\"badge-form.html?huntID=" + getUrlVars()["huntID"] + "&badgeID=" + badgesJSON[i]["data"]["badge_id"] + "\"><\/a>\r\n" +
				"<a id=\"review-hunt-badge-edit-btn\" class=\"button is-rounded btn-standard icon ion-md-create\" href=\"badge-form.html?huntID="+ getUrlVars()["huntID"] + "&badgeID=" + badgesJSON[i]["data"]["badge_id"] + "\"><\/a>\r\n";
				if (isEditable) {
					badgeHTML += "<button id=\"review-hunt-badge-delete-btn\" class=\"button is-rounded btn-standard icon ion-md-trash\" onclick=\"delBadgeButton(" + badgesJSON[i]["data"]["badge_id"] + ")\"><\/button>\r\n";
				}
				badgeHTML += "<\/div>\r\n" + "<\/div>";

			document.getElementById("badges-container").innerHTML += badgeHTML;

		}

		// check and add new badge based on hunt state
		newBadgeButton();
	}).fail(function (){
		newBadgeButton();
	});
}


// generate and add the new badge button if hunt status allows for it
function newBadgeButton() {
    if (isEditable) {
        console.log("enabling new badge button");

        // add new badge button
        document.getElementById("badges-container").innerHTML +=
            "<div id=\"add-new-badge-btn-container\" class=\"column is-one-quarter\">\r\n" +
            "<a id=\"add-new-badge-btn\" href=\"badge-form.html?huntID=" + getUrlVars()["huntID"] + "\">+<br>ADD BADGE<\/a>\r\n" +
            "<\/div>"
    } else {
        console.log("disabling new badge button");
    }
}

// delete badge function
function delBadgeButton(badgeID) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"] + "/badges/" + badgeID,
        "method": "DELETE",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Cache-Control": "no-cache",
        },
    };
    $.ajax(settings).done(function (response) {
        console.log("badge deleted");
        location.reload();
    }).fail(function () {
        alert("Failed to delete badge");
    });
}


function loadAwards()
{
	////////////////////////////
	// populate award details //
	////////////////////////////
	var awardSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"] + "/awards",
		"method": "GET",
		"headers": {
			"Authorization": "Bearer " + localStorage.getItem("token"),
			"Cache-Control": "no-cache",
		},
	};
	$.ajax(awardSettings).done(function (response) {
		// award exists
		var awardJSON = JSON.parse(response);

		// remove new award box
		document.getElementById("add-new-award-btn-container").remove();

		// populate existing award
		document.getElementById("review-hunt-award-name").innerText = awardJSON[0]["data"]["name"];
		document.getElementById("review-hunt-award-value").innerText = "Award value: " + awardJSON[0]["data"]["award_value"];
		document.getElementById("review-hunt-award-description").innerText = awardJSON[0]["data"]["description"];

		// set award links
		document.getElementById("review-hunt-award-view-btn").href = "award-form.html?huntID=" + getUrlVars()["huntID"] + "&awardID=" + awardJSON[0]["data"]["award_id"];
		document.getElementById("review-hunt-award-edit-btn").href = "award-form.html?huntID=" + getUrlVars()["huntID"] + "&awardID=" + awardJSON[0]["data"]["award_id"];
		if (isEditable) {
			document.getElementById("review-hunt-award-delete-btn").setAttribute( "onClick", "javascript: delAwardButton(" + awardJSON[0]["data"]["award_id"] + ");");
		} else {
			document.getElementById("review-hunt-award-delete-btn").remove();
		}
	}).fail(function () {
		// remove existing award div since one doesn't exist
		document.getElementById("existing-award-container").remove();

		// check if hunt is editable
		if (isEditable) {
			console.log("adding new award link");

			// set link for creating new badge for new award
			document.getElementById("add-new-award-btn").href = "award-form.html?huntID=" + getUrlVars()["huntID"];
		} else {
			console.log("removing new award button");

			// remove edit award box since hunt is under review
			document.getElementById("add-new-award-btn-container").remove();
		}
	});
}

// delete award
function delAwardButton(awardID) {
    console.log("deleting award... " + awardID);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"] + "/awards/" + awardID,
        "method": "DELETE",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Cache-Control": "no-cache",
        },
    };

    $.ajax(settings).done(function (response) {
        console.log("award deleted");
        // location.reload();
    }).fail(function () {
        alert("Failed to delete award.")
    });
}

////////////////////////////
// submit hunt for review //
////////////////////////////


function submitHuntForReview() {
    var submitSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magpiehunt.com/api/v1/hunts/" + getUrlVars()["huntID"],
        "method": "PATCH",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Cache-Control": "no-cache"
        }
    };
    $.ajax(submitSettings).done(function (response) {
        console.log("submission successful");
        // alert("Hunt submission success");
        // console.log(response);
        var urlTemp = "thank-you.html?huntID=" + getUrlVars()["huntID"];
        window.location.href = urlTemp;
    }).fail(function () {
        console.log("submission FAILED");
        alert("Hunt submission failed. Has it already been submitted?")
    })
}
