$(document).ready(init);

function init() {
	var email = localStorage.getItem("email");
	
    $("#google-account").text(email);
}
