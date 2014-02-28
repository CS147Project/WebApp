$("#selectWorkout tr#workout td.btn").click(function(){
    event.preventDefault();
    console.log("select - workout:");

    var elem = $(this).parent();
    if ( elem.is( "tr" )) {
        $('tr.success').removeClass('success');
        elem.addClass('success');
    }else{
        consol.log("error: cannot find tr parent element: " + elem);
    }
});
