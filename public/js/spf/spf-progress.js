(function($){
	'use strict';

	var $neo = $('noscript.neo'),
		$progressBar = $('.spf-progress');

	if(!$neo.length || !$neo.data('spf')) {
		// return since SPF not enabled
		return;
	}

	if($progressBar.length) {
		// return since already present and events attached
		return;
	}

	$progressBar = $('<div class="spf-progress"></div>').appendTo('body');

	var animationDuration = (($neo.data('mediantime') || 1000)/1000) + 's', // Default 1000ms
		getAnimationDurationStyle = function(duration){
			return {
				"-webkit-animation-duration": duration,
				"-moz-animation-duration": duration,
				"-o-animation-duration": duration,
				"animation-duration": duration
			};
		};


	// Start animation
	document.addEventListener('spfrequest', function() {
		// Add the animationDuration
		$progressBar.css(getAnimationDurationStyle(animationDuration));
		$progressBar.addClass('spf-progress-animate');		
	});

	// Complete animation
	document.addEventListener('spfdone', function() {
		$progressBar.width($progressBar.width()) // Set width to preserve it
					.css(getAnimationDurationStyle('')) // Reset animation-duration
					.removeClass('spf-progress-animate')
					.addClass('spf-progress-animate-final');
	});

	// Reset animation
	$progressBar.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){ 
		if($progressBar.hasClass('spf-progress-animate-final')) {
			// reset width to 0
			$progressBar.width(0);			
			// remove the animation class
			$progressBar.removeClass('spf-progress-animate-final');
		}
	});

})(window.jQuery);