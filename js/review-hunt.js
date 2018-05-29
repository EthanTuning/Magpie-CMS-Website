// populate hunt details
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

    document.getElementById("review-hunt-super-badge-image-link").href = "hunt-form.html?badgeID=" + getUrlVars()["huntID"];
});


// populate award details
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

    // TODO: populate award info
    // populate existing award

}).fail(function () {
    // remove edit award box
    document.getElementById("existing-award-container").remove();

    // set link for creating new badge for new award
    document.getElementById("add-new-award-btn").href = "award-form.html?huntID=" + getUrlVars()["huntID"];
});



// populate badges
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

        // create current badge html
        // TODO: set image to that of one of the badge image
        document.getElementById("badges-container").innerHTML +=
            "<div class=\"column is-one-quarter\">\r\n" +
                "<p id=\"review-hunt-badge-name\" class=\"content\">" + badgesJSON[i]["data"]["landmark_name"] + "<\/p>\r\n" +
                "<a href=\"badge-form.html?huntID=" + getUrlVars()["huntID"] + "&badgeID=" + badgesJSON[i]["data"]["badge_id"] + "\">\r\n" +
                    "<img id=\"review-hunt-badge-image\" src=\"assets\/Magpie__Centennial Sculpture.png\">\r\n" +
                "</a>\r\n" +
                "<div class=\"field is-grouped\">\r\n" +
                    "<button id=\"review-hunt-badge-view-btn\" class=\"button is-rounded btn-standard icon ion-md-eye\"><\/button>\r\n                                <button id=\"review-hunt-badge-edit-btn\" class=\"button is-rounded btn-standard icon ion-md-create\"><\/button>\r\n                                <button id=\"review-hunt-badge-delete-btn\" class=\"button is-rounded btn-standard icon ion-md-trash\"><\/button>\r\n" +
                "<\/div>\r\n" +
            "<\/div>"
    }

    newBadgeButton();
}).fail(function (){
    newBadgeButton();
});


// generate and add the new badge button if hunt status allows for it
function newBadgeButton() {
    $.ajax({
        type: "GET",
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
                console.log("enabling new badge button");
                // add new badge button
                document.getElementById("badges-container").innerHTML +=
                    "<div id=\"add-new-badge-btn-container\" class=\"column is-one-quarter\">\r\n" +
                    "<a id=\"add-new-badge-btn\" href=\"badge-form.html\">+<br>ADD BADGE<\/a>\r\n" +
                    "<\/div>"
            } else {
                console.log("disabling new badge button");
            }
        },
        error: function (e) {
            alert("Error encountered while getting the status of hunt: " + getUrlVars()["huntID"]);
        }
    });
}

