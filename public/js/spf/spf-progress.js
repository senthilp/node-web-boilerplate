(function($, spf){
	'use strict';

	spf = spf || {};

	var $progressBar = $('.spf-progress'),
		animationDuration = '1s', // Default 1s
		getAnimationDurationStyle = function(duration){
			return {
				"-webkit-animation-duration": duration,
				"-moz-animation-duration": duration,
				"-o-animation-duration": duration,
				"animation-duration": duration
			};
		},		
		startAnim = function() {
			// Add the animationDuration
			$progressBar.css(getAnimationDurationStyle(animationDuration));
			$progressBar.addClass('spf-progress-animate');	
		},
		completeAnim = function() {
			$progressBar.width($progressBar.width()) // Set width to preserve it
						.css(getAnimationDurationStyle('')) // Reset animation-duration
						.removeClass('spf-progress-animate')
						.addClass('spf-progress-animate-final');
		},
		resetAnim = function() {
			if($progressBar.hasClass('spf-progress-animate-final')) {
				// remove the animation class
				$progressBar.removeClass('spf-progress-animate-final');				
				// reset width to 0
				$progressBar.width(0);			
			}
		}, 
		init = function(duration) {
			// Set the duration
			if(duration) {
				animationDuration = (duration / 1000) + 's';
			}			
			// Check the progressBar element
			if(!$progressBar.length) {
				$progressBar = $('<div class="spf-progress"></div>').appendTo('body');
				// Attach the animation end event to reset animation
				$progressBar.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", resetAnim);								
			}
		};

	// Start animation
	document.addEventListener('spfrequest', startAnim);

	// Complete animation
	document.addEventListener('spfdone', completeAnim);	

	// Assign init to spf
	spf.progressInit = init;

})(window.jQuery, window.spf);