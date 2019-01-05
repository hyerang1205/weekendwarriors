$(document).ready(function() {

  $("#createA").click(function() {
    $("#signIn").hide(0);
    $("#signUp").fadeIn(500);
  });

  $("#back").click(function() {
    $("#signUp").hide(0);
    $("#signIn").fadeIn(500);
  });
})
