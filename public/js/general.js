'use strict';
var lastActive = null;
var count = 1;

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
    $("#addExercise").click(addExercise);
}

function navigate(e) {
	lastActive.removeClass("active");
	console.log(lastActive);
	$("this").addClass("active");
	lastActive = $("this");
}

function addExercise(e) {
    e.preventDefault();

    console.log("Registered Click");
    var form = "<div><input type='text' class='form-control' placeholder='Name' name='excersiseName"+count+"'></div>"
    var newExercise = "<div class='text-left'>"+count+'.'+form+"</div>";

    $("#exercisesCreated").append(newExercise);


    count++;
}
