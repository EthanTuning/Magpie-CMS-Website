$(document).ready(init);

function init() {
    $("#award-form-back-btn").on("click", goBack);
    $("#award-form-save-btn").on('click', submitHuntForm)
}

function goBack(evt) {
    evt.preventDefault();
    history.back();
}
function submitHuntForm(evt) {
    evt.preventDefault();
    var token = localStorage.getItem("token");



    if (token == null) {
        alert("token is null");
    }
    // validate input
    var name = $("#award-name").val();
    var has_value = $("input[name=value]:checked").val();
    var award_value = $("#award-value").val();
    var address = $("#award-location-name").val();
    var lat = $("#award-latitude").val();
    var lon = $("#award-longitude").val();
    var terms = $("#award-terms").val();

    var form = new FormData();
    if(isApprovedData(name, has_value, award_value, address, lat, lon, terms)) {
        form.append("address", address);
        form.append("description", "no description");
        form.append("lat", lat);
        form.append("lon", lon);
        form.append("name", name);
        form.append("redeem_code", "no redeem code");
        form.append("award_value", award_value);

        sendForm(form);
    }
    else {
        alert("You entered bad information");
    }
}
/*
 * Performs layman's validation on every field passed in the form
 * Will need to find another way to validate form fields though
 */
function isApprovedData(name, has_value, address, lat, lon, terms) {
    // if(!name.trim() && !has_value.trim() && !address.trim() && !lat.trim() && !lon.trim() && !terms.trim()) {
    //     return true;
    // }
    // return false;
    return true;
}

/*
 * Send the form data to the API
 */
function sendForm(form) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://magpiehunt.com/api/v1/hunts",
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
        alert('going to next page');
        window.location.replace(nextPage);
    });
}