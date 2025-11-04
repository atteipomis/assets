$(document).ready(function() {
		$drawerRight = $('.cart-drawer-right');
		$cart_list = $('.cart-btn, .close-btn');
		
		$cart_list.click(function() {
			$(this).toggleClass('active');
			$('.cart-drawer-push').toggleClass('cart-drawer-pushtoleft');
			$drawerRight.toggleClass('cart-drawer-open');
		});
	});