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
    var form = "<div>"+
                    "<input type='text' class='form-control' placeholder='Name' name='excersiseName"+count+"'>"+
                    "<input type='text' class='form-control' placeholder='Number of Sets' name='excersiseSets"+count+"'>"+
                    "<input type='text' class='form-control' placeholder='Number of Reps' name='excersiseReps"+count+"'>"+
                    "<input type='text' class='form-control' placeholder='Additional Notes' name='excersiseNotes"+count+"'>"+
                    "<p class='text-center'>How do you want this to be recorded?</p>"+
                    "<select name='excersiseRecordType"+count+"' id='excersiseRecordType"+count+"''>"+
                      "<option value='weight'>Weight</option>"+
                      "<option value='speed'>Speed</option>"+
                      "<option value='distance'>Distance</option>"+
                      "<option value='time'>Time</option>"+
                      "<option value='none'>None of the above</option>"+
                    "</select>"+
                    "<hr>"+
                "</div>"
    var newExercise = "<div class='text-left'>Exercise "+count+':'+form+"</div>";
    $("#numExercises")[0].value = count;
    $("#exercisesCreated").append(newExercise);
    count++;
}
