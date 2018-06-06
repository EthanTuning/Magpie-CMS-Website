/* Assign the button clicks and Get Hunts List */
$(document).ready( function()
{	
	getSubmittedHunts();
	getApprovedHunts();
});


/* Build and send API request */
function getApprovedHunts()
{		
	// get the token and add it to the ajax call
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/hunts?blah",
	  "method": "GET",
	  "headers": {
		  "Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"error": function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
	  makeTable(response, "tableApproved");
	});
		
}



/* Build and send API request */
function getSubmittedHunts()
{		
	// get the token and add it to the ajax call	
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://magpiehunt.com/api/v1/admin",
	  "method": "GET",
	  "headers": {
		  "Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"error": function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
	  makeTable(response, "tableSubmitted");
	});
		
}


/* Make the table from ajax response*/
function makeTable(response, tableName)
{
	clearTable(tableName);
		
	//if response is empty or null, return
	//console.log(response);
	if (response == null || response == "")
	{
		return;
	}
	
	var table = document.getElementById(tableName);
	
	//try to parse the response as JSON, if fail send to table in single cell
	try{
		var results = JSON.parse(response);
	}
	catch (ex)
	{
		var row = table.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.innerHTML = response;
		return;
	}
	
	
	// if this is for the "approved hunts" table, filter out non-approved hunts
	if (tableName == "tableApproved")
	{
		var newResults = []; // new results conatiner
		
		for ( let hunt of results)
		{
			if (hunt.data.approval_status == "approved")
			{
				newResults.push(hunt);
			}
		}
		results = newResults;
	}
	
	
	for (var i = 0; i < results.length; i++)
	{
		//add row
		var row = table.insertRow(-1);
		var obj = results[i].data;
		
		//this sets the order of the elements as they will appear in the table
		var order = ["uid", "name", "abbreviation", "city", "state", "date_start", "date_end"];
		
		// for every field in the above array, shove the corresponding data into the table
		for (var k = 0; k < order.length; k++)
		{
			var item = order[k];
			
			//insert data
			var cell = row.insertCell(-1);
			cell.innerHTML = obj[item];
		}
		
		//make the Action Buttons in the last column
		var cell = row.insertCell(-1);
		var btnView = '<a href="admin-hunt.html?huntID=' + obj['hunt_id'] + '" class="button is-rounded btn-standard icon ion-md-eye"></a>';
		//var btnApprove = '<a class="button is-rounded btn-standard icon ion-md-checkmark"></a>';
		var btnDelete =  $("<a>", {
			"class" : "button is-rounded btn-standard icon icon ion-md-trash",
			"data" : {"huntID": obj['hunt_id']},
			"click" : deleteHunt
		});
		//var btnReject = '<a class="button is-rounded btn-standard icon">X</a>';
		cell.innerHTML = btnView;
		$(cell).append(btnDelete);	// so to sort of explain this, btnView is just a text string, btnDelete is a jQuery object.  I coudn't get click() to work.  Fucking javascript.
	}
	
}


/* Clear table */
function clearTable(tableID)
{
	/* Remove all table rows */
	table = document.getElementById(tableID);
	var totalRows = table.rows.length - 1;	//-1 for the header row
	
	for (i = 0; i < totalRows; i++)
	{
		table.deleteRow(-1);
	}
}



/*** DELETE A HUNT *****/
function deleteHunt(event)
{
	var bool = confirm("Are you sure you want to delete this Hunt?");
	
	if (!bool)
	{
		return false;
	}

	//add on the huntID
	var huntID = $(event.target).data("huntID");

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + huntID,
		"method": "DELETE",
		"headers": {
			"Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"error": function(e) {alert(e.getResponseText)},
		"processData": false,
		"contentType": false,
	};

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  //refresh the page
	  window.location.reload();
	});

}




