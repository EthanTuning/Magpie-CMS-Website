
$(document).ready(init);



function init() {
    
    getHunts();
}



/**
 * Get all the Hunts
 */

function getHunts() {
	
	// get the token and add it to the ajax call
	var token = localStorage.getItem("token");
	
	if (token == null)
	{
		alert("token is null");
	}
		
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts",
		"method": "GET",
		"headers": {
		  "Authorization" : "Bearer " + token
		}
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		
		var hunts = JSON.parse(response);

		// for each hunt in list, make a tile
		for( let hunt of hunts)
		{
			console.log(hunt);		// $().val(hunt.data.name), $("#hunt-super-badge").val(hunt.super_badge);
		}
		
		// set the onclick() for super_badge so it goes to that Hunt's page (review-hunt)
		
		$("#divNonApproved").val(hunt.name);
		$("#divSubmitted").val(hunt.abbreviation);
		$("#divApproved").val(hunt.zipcode);
		
	});
	
	
}


}
