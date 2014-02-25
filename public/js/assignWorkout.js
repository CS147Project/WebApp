$(function(){
  var mySwiper = $('#assignWorkout.swiper-container').swiper({
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
    }else{
        consol.log("error: cannot find tr element parent: " + elem);
    }
});

$("#assignWorkout.swiper-container #player .btn").click(function(){
    event.preventDefault();
    console.log("success - player:");

    var elem = $(this).parent();
    if ( elem.is( "tr" ) ) {
        elem.toggleClass("success");
    }else{
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
