/*this will get the status of a hunt.
* Needs hunt id & token from firebase*/
function getHuntStatus(huntId, token) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://magpiehunt.com/api/v1/hunts/" + huntId,
        dataType: "text",
        timeout: 600000,
        "headers": {
            "Authorization": "Bearer " + token,
        },
        success: function (data) {
            var temp = JSON.parse(data);
            var status = temp["data"]["approval_status"];
            console.log(temp["data"]["approval_status"]);
            return status;

        },
        error: function (e) {
            alert("Error encountered while getting the status of hunt: " + huntId);
        }
    });
}

