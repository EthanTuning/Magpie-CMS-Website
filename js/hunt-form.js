$(document).ready(init);

function init() { 
    $("#hunt-form-save-btn").on("click", saveHuntForm); 
    $("hunt-form-submit-btn").on("click", submitHuntForm);
}

function saveHuntForm() { 
    postHuntData();

}

function submitHuntForm() {
    postHuntData();

}
/**
 * ajax call for creation of new hunt
 */
function postHuntData() {
    

}