

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.navExercise').click(submitData);
	console.log("linked!");
}

function submitData(e){
	console.log("clicked");
	var currData = {
	    "weight": $('#goExerciseForm #inputWeight').val(),
	    "set":  $('#goExerciseForm #inputSet').val(),
	    "rep":  $('#goExerciseForm #inputReps').val(),
	    "distance":  $('#goExerciseForm #inputDist').val(),
	    "time":  $('#goExerciseForm #inputTime').val()
    };

    console.log("currData: " + currData);
    $.post('/goWorkout/save', {
    	'currData' : currData,
    	'nav-clicked' : $('this').val()
    });

}



$(function(){
  var mySwiper = $('#goWorkout.swiper-container').swiper({
    //Your options here:
    pagination: '.pagination',
    paginationClickable: true,
    mode:'horizontal',
    loop: true,
    onSlideChangeStart: function(){
        // save current workout data
    }
  });
})