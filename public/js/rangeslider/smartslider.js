(function($) {
	'use strict';

	window.appInit = function() {
		$('.app-container')._on('smartslider.slide', '.slider-container', function(e, data) {
			var leftPos = data * 74;
			$('.imglist').css({left: -leftPos});
			$('.imglist img').removeClass('is-selected');
			$($('.imglist img')[data]).addClass('is-selected');
		});
		$('.slider-container')._on('smartslider.change', function(e, data) {
			/*var leftPos = data * 74;
			$('.imglist').css({left: -leftPos});
			$('.imglist img').removeClass('is-selected');
			$($('.imglist img')[data]).addClass('is-selected');*/
			console.log("change - " + data);
		});

		$('.sliderwrap').on('mouseover', function() {
			$('.imglistwrap').css('visibility', 'visible');
		});

		$('.sliderwrap').on('mouseout', function() {
			$('.imglistwrap').css('visibility', 'hidden');
		});

		$(window)._on('load', function() {			
			console.log('this is window load');
		});

		$(document)._on('ready', function() {
	      	console.log('this is explict document ready');
		});
		
		$(window)._on('unload', function() {
			console.log('this is window UNLOAD');
		});		
		$(window)._on('beforeunload', function() {
			console.log('this is window BEFOREUNLOAD');
		});		

		$('.slider-container')._on('click', '.sliderwrap', function() {
			//alert('delegated');
		});		
		$('.slider-container')._on('click', function() {
			//alert('direct');
		});	
		$(document).on('click.gh', function() {
			alert('doc click');
			/*window.arr = [];
			var test = [];
			for(var i =0; i< 10000; i++) {
				new Array(10000).join('x');
			}*/
		});
		$('.mod1').on('click', function() {
			$.dispatcher.trigger('mod1clicked', {
				color: Math.floor(Math.random() * 1000000)
			}, this);			
			return false;
		});
		$.dispatcher.on('mod1clicked', function(e, data) {
			var $parent = $('.mod2');
			// If child not present return
			if(!$parent.find(e.target).length){
				return;
			}
			$parent.find('.mod2-text').text('#' + data.color).css({ 
				"background-color": '#' + data.color,
				"color": "#fff" 
			});
		});
	};
})(window.jQuery);
