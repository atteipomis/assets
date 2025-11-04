$('li.has-ul').click(function() {
  $(this).children('.sub-ul').slideToggle(500);
  $(this).toggleClass('active');
  //  event.preventDefault();
});
$('.sidebar__title--active').click(function() {
  $(".sidebar-nav").slideToggle(500);
  $(this).toggleClass('open');
});