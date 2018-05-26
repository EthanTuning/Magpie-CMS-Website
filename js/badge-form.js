//lock the QR buttons since they aren't being used
lockQRButtons();

var _token = getTok();
var _huntId = getUrlVars()["huntID"];
var _badgeId = getUrlVars()["badgeID"];

huntStatus();

/*sets the badge-form to read only*/
function setToReadOnly() {
    $('#badge-form :input').attr('readonly','readonly');
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
            var temp = JSON.parse(data).data;
            var status = temp["approval_status"];
            setFields("status");
        },
        error: function (e) {
            alert("Error encountered while getting the status of hunt: " + _huntId);
        }
    });
}

function setFields(status) {
    if (status == "submitted") {
        //populate & set to read only
        setBadgeData();
        setToReadOnly();
    } else if(status == "published"){
        setToReadOnly();
    }
}

/*lock the QR code radio buttons*/
function lockQRButtons() {
    $("#badge-form :input[type=radio]").attr('disabled', true);

}

function getTok() {
    var tok = localStorage.getItem("token");
    return tok;
}

function populateFields(badgeData) {
    /*populates: badge name, description, location*/
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

