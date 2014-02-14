'use strict';
var lastActive = null;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("init");
	lastActive = $(".navbar a .home-btn");
	lastActive.addClass("active");
	$("#genNav .navbar .btn").click(navigate);	
}

function navigate(e){
	lastActive.removeClass("active");
	console.log(lastActive);
	$("this").addClass("active");
	lastActive = $("this");
}