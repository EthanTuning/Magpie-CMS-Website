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
    console.log(response);

    var huntJSON = JSON.parse(response);
    console.log(huntJSON["data"]["abbreviation"]);
    console.log(huntJSON["data"]["name"]);
    console.log(huntJSON["data"]["summary"]);

    // fill in hunt info
    document.getElementById("review-hunt-abbreviation").innerText = huntJSON["data"]["abbreviation"];
    document.getElementById("review-hunt-name").innerText = huntJSON["data"]["name"];
    document.getElementById("review-hunt-description").innerText = huntJSON["data"]["summary"];
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

}).fail(function () {
    // award does not exists
    document.getElementById("existing-award-container").remove();
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
}).fail(function (){
    // badges do not exists

});


