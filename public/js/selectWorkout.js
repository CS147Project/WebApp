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