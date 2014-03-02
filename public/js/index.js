'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("init");
}

function navigate(e){
	console.log("/static/" + $(this).attr("value")+ ".html");
	$("#content").load("/static/" + $(this).attr("value") + ".html");
}
