/* javascript */


/* NOTE: The delete button functionality relies on a 'deleteButton.css' file in the css/ folder
 */


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
		  "Authorization" : "Bearer " + token,
		  "Cache-Control": "no-cache"
		},
		"error" : createAddHuntButton
	}

	$.ajax(settings).done(function (response) {
		//console.log(response);
		
		var hunts = JSON.parse(response);

		// for each hunt in list, make a tile and add it
		for( let hunt of hunts)
		{
			addTile(hunt);
		}
		
		createAddHuntButton();
			
	});
	
}



//kinda hacky
function createAddHuntButton()
{
	// add the "Create Hunt" tile
		var createHunt = $("<div/>", {
		  id: "add-new-hunt-btn-container",
		  "class": "column is-one-quarter",      // ('class' is still better in quotes
		});
		createHunt.append('<a id="add-new-hunt-btn" href="hunt-form.html">+<br>CREATE HUNT</a>');
		$('#divNonApproved').append(createHunt);
}




/** Add a tile to the Tile area(s) **/
function addTile(hunt)
{
	huntID = hunt.data.hunt_id;
	
	var tile = $("<div/>", {

		  // PROPERTIES HERE
		  id: huntID,
		  "class": "column is-one-quarter",      // ('class' is still better in quotes)
		  on: {
			click: function() {
			  //window.location='./review-hunt.html?huntID='+huntID;
			}
		  }		  
		}); // << no need to do anything here as we defined the properties internally.
		
	tile.append("<p id='hunts-hunt-name' class='content'>" + hunt.data.name + "</p>");
	
	// div to wrap the <button>, <a> and <img>
	var div = $("<div>", {"class" : "show-delete-button"});
	
	//make a <a> for the image to have a link
	var linkWrapper = $("<a/>", {href: './review-hunt.html?huntID='+huntID});	//wraps the tile with a link, valid as of HTML5
	
	// generate the <img>
	// if there is no super badge use a placeholder
	var superBadgeImage;
	try
	{
		superBadgeImage = hunt.data.super_badge.href;
		if (superBadgeImage == "")
		{
			throw new Exception();
		}
	}
	catch (error)
	{
		superBadgeImage = 'assets/super_badge/SSW_Badges&MapPins-69.png';
	}
	
	//image
	var image = $('<img>',{id:'hunts-hunt-super-badge-icon',src: superBadgeImage, width: 170, height:170 });
	
	// delete button
	var button = $("<button>", {
		"id" : "review-hunt-badge-delete-btn",
		"class": "button is-rounded btn-standard icon ion-md-trash",
		"data" : {
			"huntID" : huntID
		},
		on: {
				click: deleteHunt
		}
	});
	
	linkWrapper.append(image);	// add <img> to <a>
	
	div.append(button);			// add button to div
	div.append(linkWrapper);	// add <a> to div
	
	// attach the div to tile
	tile.append(div);
	
	// add tile to the holding <div>
	var divString = getStatusDiv(hunt);
	$(divString).append(tile);
	
}


/*** DELETE A HUNT *****/
function deleteHunt(event)
{
	var bool = confirm("Are you sure you want to delete this Hunt?");
	
	if (!bool)
	{
		return false;
	}
	
	var token = localStorage.getItem("token");
	
	if (token == null)
	{
		alert("token is null");
	}

	//add on the huntID
	var huntID = $(event.target).data("huntID");

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts/" + huntID,
	  "method": "DELETE",
	  "headers": {
		  "Authorization" : "Bearer " + token
		},
		"statusCode": {
			404: function() {
				alert('Hunt not found!');
			},
			400: function() {
				alert('Bad request!');
			},
			500: function() {
				alert('Something is wrong!');
			}
	   },
	  "processData": false,
	  "contentType": false,
	};

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  //refresh the page
	  window.location.reload();
	});

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


