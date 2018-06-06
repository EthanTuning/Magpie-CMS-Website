/* Assign the button clicks and Get Hunts List */

var _huntID;		// hunt id

$(document).ready( function()
{	
	_huntID = getUrlVars()['huntID'];
	clearTable('tableHunt');
	clearTable('tableBadge');
	clearTable('tableAward');
	$("#btnReject").click(approveHunt);
	$("#btnApprove").click(approveHunt);
	
	getData();
});



function getData()
{
	// get the token and add it to the ajax call
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/hunts/" + _huntID,
		"method": "GET",
		"headers": {
			"Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"error": function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
		var results = JSON.parse(response);
		// make Hunt table
		var tableArray = ["uid", "name", "abbreviation", "summary", "city", "state", "zipcode", "date_start", "date_end", "super_badge", "ordered", "audience", "sponsor"];
		makeTable([results], "tableHunt", tableArray);
	  
		// do children AJAX calls
		for (let child of results.subresources)
		{
			getChildData(child.href);
		}
	});
	
}


function getChildData(url)
{
	console.log("URL", url);
	// get the token and add it to the ajax call
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": url,
		"method": "GET",
		"headers": {
			"Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"error": function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
		
		var results = JSON.parse(response);
		var tableName;
		var tableArray;
		
		if (results[0]["class"] == "badge")
		{
			tableName = "tableBadge";
			tableArray = ["name", "description", "lat", "lon", "qr_code", "image", "icon"];
		}
		else if (results[0]["class"] == "award")
		{
			tableName = "tableAward";
			tableArray = ["name", "award_value", "lat", "lon", "description"];
		}
		
		makeTable(results, tableName, tableArray);
	});
	
}



function makeTable(resultList, tableID, tableArray)
{
	console.log(resultList, tableID, tableArray);
	
	//select the table
	var table = document.getElementById(tableID);

	// make the rows of data
	for (var i = 0; i < resultList.length; i++)
	{
		//add row
		var row = table.insertRow(-1);
		var obj = resultList[i].data;
		
		// for every field in the above array, shove the corresponding data into the table
		for (var k = 0; k < tableArray.length; k++)
		{
			var item = tableArray[k];
			
			//insert data
			var cell = row.insertCell(-1);
			
			// if there's a link, make an image
			try
			{
				if (obj[item].href != null)
				{
					$(cell).append($("<img>", {src: obj[item].href, width:100, height:100}));
				}
				else
				{
					cell.innerHTML = obj[item];
				}
			}
			catch (e)
			{
				cell.innerHTML = obj[item];
			}
		}
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



/* Approve Hunt 
 * 
 * Takes a boolean - true for approved, false for rejected
 * */
function approveHunt(event)
{
	var originator = $(event.target).prop("id");
	var approvalStatus;
	
	if (originator == "btnApprove")
	{
		approvalStatus = "approved";
	}
	else
	{
		approvalStatus = "non-approved";
	}
	
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://magpiehunt.com/api/v1/admin/" + _huntID,
		"method": "PUT",
		"headers": {
			"Authorization" : "Bearer " + localStorage.getItem("token")
		},
		"data" : {
			"approval_status": approvalStatus
		},
		"error": function (e) {alert(e.responseText);}
	}

	$.ajax(settings).done(function (response) {
		window.location.replace("admin-hunts.html")
	});
}


