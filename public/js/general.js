'use strict';
var count = 1;

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();

  //CREATE WORKOUT FORM VALIDATION
  $('#createWorkoutForm').validate({
    rules: {
       title: {
        required: true,
        minlength: 2
      },
    
       description: {
      }

      //Dynamically Added Exercises
      //Require dynamically added rules (see addExercise)
    
    },
    highlight: function(element) {
      $(element).closest('.control-group').removeClass('success').addClass('error');
    },
    success: function(element) {
      element
      .text('OK!').addClass('valid')
      .closest('.control-group').removeClass('error').addClass('success');
    }
  });

  $('#goExerciseForm').validate({
    rules: {
      inputWeight: {
        required: true,
        min: 1
      },
      inputSpeed: {
        required: true,
        min: 1
      },
      inputDist: {
        required: true,
        min: 1
      },
      inputTime: {
        required: true,
        min: 1
      }

      //Dynamically Added Exercises
      //Require dynamically added rules (see addExercise)
    
    },
    highlight: function(element) {
      $(element).closest('.control-group').removeClass('success').addClass('error');
      if(workoutSwiper == NULL){
        console.log("swiper NULL!@#)$(!");
        //workoutSwiper.swipeTo
      }
        
    },
    success: function(element) {
      element
      .text('OK!').addClass('valid')
      .closest('.control-group').removeClass('error').addClass('success');
    }
  });

})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
  $('#selectWorkout tr#workout').first().addClass('success');
  //$('#genNav .navbar .btn').first().addClass('active');
  $("#addExercise").click(addExercise);
	//$('#genNav .navbar .btn').click(navigate);
  $('.navExercise').click(submitData);

}

// function navigate(e) {
//   console.log('clicked!');
//   $('.btn.active').removeClass('active');
//   $(this).addClass('active');
// }



function addExercise(e) {
    e.preventDefault();
    console.log("Registered Click");
    var form =   "<div class='text-left' id='newExercise"+count+"'>Exercise "+count+": "+
                    "<button class='btn btn-primary' id='removeExercise"+count+"' type='button'><span class='glyphicon glyphicon-trash glyphicons-lg pull-right'></span></button>"+
                    "<input type='text' class='form-control' placeholder='Name' id='excersiseName"+count+"' name='excersiseName"+count+"'>"+
                    "<input type='number' class='form-control' placeholder='Number of Sets' id='excersiseSets"+count+"' name='excersiseSets"+count+"'>"+
                    "<input type='number' class='form-control' placeholder='Number of Reps' id='excersiseReps"+count+"' name='excersiseReps"+count+"'>"+
                    "<input type='text' class='form-control' placeholder='Additional Notes' id='excersiseNotes"+count+"' name='excersiseNotes"+count+"'>"+
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
    var newExercise = form;
    $("#numExercises")[0].value = count;
    $("#exercisesCreated").append(newExercise);
    $("#removeExercise"+count).bind('click', { parentObj: "#newExercise"+count}, function(e) {
      console.log(e.data.parentObj);
      $(e.data.parentObj).remove();
    });

    //Adding Validation Dynamically:
    $('#excersiseName'+count).rules("add", {
      required: true,
      minlength: 2
    });


    //increment count
    count++;
}

// Home_Grid Swiper
// SWIPER FUNCTIONALITY
$(function(){
  var selectWSwiper = $('#selectW.swiper-container').swiper({
    //Your options here:
    pagination: '.pagination',
    paginationClickable: true,
    mode:'horizontal',
    slidesPerView: 1,
    onSlideChangeStart: function(){
        // save current workout data
    }
  });
})


//Select Workout
///////////////////////////////////
$("#selectWorkout tr#workout td.btn").click(function(){
    event.preventDefault();

    var elem = $(this).parent();

    console.log("select - workout:" + $(this).id);

    if ( elem.is( "tr" )) {
        $('tr.success').removeClass('success');
        elem.addClass('success');
    }else{
        consol.log("error: cannot find tr parent element: " + elem);
    }
});

$("#beginWorkoutBtn").click(function(){
    event.preventDefault();
    console.log("begin workout btn pressed");
  var selection = $(".success td");
    if(!selection){

    }
  console.log(selection);
    var url = '/goWorkout0';
  console.log(url);
  $.get(url, function() {
            window.location.href = url; // reload the page
        });
});



//Go Workout
//////////////////////////////////////////
/*
 * Function that is called when the document is ready.
 */

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

// GOWORKOUT SWIPER FUNCTIONALITY
$(function(){
  var workoutSwiper = $('#goWorkout.swiper-container').swiper({
    //Your options here:
    pagination: '.pagination',
    paginationClickable: true,
    mode:'horizontal',
    loop: false,
    onSlideChangeStart: function(){
        // save current workout data
        $('#goExerciseForm').validate();
    }
  });
})


$('#goWorkout.arrow-left').on('click', function(e){
  e.preventDefault()
  mySwiper.swipePrev()
})
$('#goWorkout.arrow-right').on('click', function(e){
  e.preventDefault()
  mySwiper.swipeNext()
})




//Assign Workout
///////////////////////////////////////////////

//ASSIGNWORKOUT SWIPER FUNCTIONALITY
$(function(){
  var assignSwiper = $('#assignWorkout.swiper-container').swiper({
    //Your options here:
    pagination: '.pagination',
    paginationClickable: true,
    mode:'horizontal',
    loop: false
  });
})

$("#assignWorkout.swiper-container #workout .btn").click(function(){
    event.preventDefault();
    console.log("success - workout:");

    var elem = $(this).parent();
    if ( elem.is( "tr" ) ) {
        elem.toggleClass("success");
    } else {
        consol.log("error: cannot find tr element parent: " + elem);
    }
});

$("#assignWorkout.swiper-container #player .btn").click(function(){
    event.preventDefault();
    console.log("success - player:");

    var elem = $(this).parent();
    if ( elem.is( "tr" ) ) {
        elem.toggleClass("success");
    } else {
        consol.log("error: cannot find tr element parent: " + elem);
    }
});

$("#assignWorkout.swiper-container button#assign").click(function(){
    event.preventDefault();
    console.log("success - assign: ");

    //var toAssign = document.getElementById("workout").getElementsByClassName("success");
    $(".success").each(function(){
        console.log("id: " + this.id);
    });

    // var players = document.getElementById('player').getElementsByClassName('success');
    // console.log("players:" + players);

});
