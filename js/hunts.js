/* javascript */

$(document).ready(init);


function init()
{
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
		//console.log(response);
		
		var hunts = JSON.parse(response);

		// for each hunt in list, make a tile and add it
		for( let hunt of hunts)
		{
			addTile(hunt);
		}
		
		// add the "Create Hunt" tile
		var createHunt = $("<div/>", {
		  id: "add-new-hunt-btn-container",
		  "class": "column is-one-quarter",      // ('class' is still better in quotes
		});
		createHunt.append('<a id="add-new-hunt-btn" href="hunt-form.html">+<br>CREATE HUNT</a>');
		$('#divNonApproved').append(createHunt);
			
	});
	
	
}


/** Add a tile to the Tile area(s) **/
function addTile(hunt)
{
	huntID = hunt.data.hunt_id;
	
	var tile = $("<div/>", {

		  // PROPERTIES HERE
		  
		  //text: "Click me",
		  id: huntID,
		  "class": "column is-one-quarter",      // ('class' is still better in quotes)
		  on: {
			click: function() {
			  //window.location='./review-hunt.html?huntID='+huntID;
			}
		  }		  
		}); // << no need to do anything here as we defined the properties internally.
		
	tile.append("<p id='hunts-hunt-name' class='content'>" + hunt.data.name + "</p>");
	
	//make a <a> for the image to have a link
	var linkWrapper = $("<a/>", {href: './review-hunt.html?huntID='+huntID});	//wraps the tile with a link, valid as of HTML5

	// if there is no super badge use a placeholder
	if (hunt.data.super_badge.href == "")
	{
		hunt.data.super_badge.href = 'assets/super_badge/SSW_Badges&MapPins-69.png';
	}
	
	//attach image to linkWrapper
	linkWrapper.append($('<img>',{id:'theImg',src: hunt.data.super_badge.href }));
	
	// attach linkWrapper to tile
	tile.append(linkWrapper);
	
	// add tile to the holding <div>
	var divString = getStatusDiv(hunt);
	$(divString).append(tile);
	
}



/** Takes a hunt, returns the <div> id to attach to **/
function getStatusDiv(hunt)
{
	var status = hunt.data.approval_status;	//hunt's approval_status
	var divID;		// the <div> to attach to
	
	if (status == "non-approved")
	{
		divID = "#divNonApproved";
	}
	else if (status == "submitted")
	{
		divID = "#divSubmitted";
	}
	else
	{
		//approved
		divID = "#divApproved";
	}
	
	return divID;
}


