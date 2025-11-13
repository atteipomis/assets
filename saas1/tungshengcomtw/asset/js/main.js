/*--------------------------TOP--------------------------*/

       jQuery(function($){
           $('.to-top').toTop({
               autohide: true,  
               offset: 420,     
               speed: 500,      
               right: 15,       
               bottom: 150       
           });
       });
/*--------------------------兩層下拉--------------------------*/
(function($) {
    var defaults={
        sm : 540,
        md : 720,
        lg : 960,
        xl : 1140,
        navbar_expand: 'lg',
        animation: true,
        animateIn: 'fadeIn',
    };
    $.fn.bootnavbar = function(options) {

        var screen_width = $(document).width();
        settings = $.extend(defaults, options);

        if(screen_width >= settings.lg){
            $(this).find('.dropdown').hover(function() {
                $(this).find('.nav-link, .dropdown-item').on('click', function (e) {
                    e.stopPropagation()
                })
                $(this).addClass('show');
                $(this).find('.dropdown-menu').first().addClass('show');
                if(settings.animation){
                    $(this).find('.dropdown-menu').first().addClass('animated ' + settings.animateIn);
                }
            }, function() {
                $(this).removeClass('show');
                $(this).find('.dropdown-menu').first().removeClass('show');
            });
        } else {

        $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
          if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
          }
          var $subMenu = $(this).next(".dropdown-menu");
          $subMenu.toggleClass('show');

          $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
            $('.dropdown-submenu .show').removeClass("show");
          });

          return false;
        });
        }
    };
})(jQuery);

! function (o) {
    "use strict";
    o.fn.toTop = function (t) {
        var e = this,
            i = o(window),
            s = o("html, body"),
            n = o.extend({
                autohide: !0,
                offset: 420,
                speed: 500,
                right: 15,
                bottom: 50
            }, t);
        e.css({
            position: "fixed",
            right: n.right,
            bottom: n.bottom,
            cursor: "pointer"
        }), n.autohide && e.css("display", "none"), e.click(function () {
            s.animate({
                scrollTop: 0
            }, n.speed)
        }), i.scroll(function () {
            var o = i.scrollTop();
            n.autohide && (o > n.offset ? e.fadeIn(n.speed) : e.fadeOut(n.speed))
        })
    }
}(jQuery);


/*--------------------------主選單高度變色--------------------------*/
$(document).on("scroll",function(){
			if($(document).scrollTop()>100){ 
				$("header").removeClass("bg-dark").addClass("bg-dark2");
				}
			else{
				$("header").removeClass("bg-dark2").addClass("bg-dark");
				}
			});




 