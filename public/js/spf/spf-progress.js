(function($, spf){
	'use strict';

	spf = spf || {};

	var $progressBar = $('.spf-progress'),
		transitionDuration = '1000ms', // Default 1000ms
		getAnimationDurationStyle = function(duration){
			return {
				"-webkit-transition-duration": duration,
				"-moz-transition-duration": duration,
				"-o-transition-duration": duration,
				"transition-duration": duration
			};
		},
		startAnim = function() {
			// Remove if present and create one
			if($progressBar.length) {
				$progressBar.remove();				
			}						
			$progressBar = $('<div class="spf-progress"></div>').appendTo('body');
			var timer = window.setTimeout(function() {
				window.clearTimeout(timer);
				// Add the transitionDuration
				$progressBar.css(getAnimationDurationStyle(transitionDuration));
				// Set the width
				$progressBar.css({
					"width": "80%"
				});
			}, 0);		
		},
		completeAnim = function() {
			// Finish the transition
			$progressBar.css(getAnimationDurationStyle('200ms'));
			$progressBar.css({
				"width": "101%"
			});
			// Attach the transition end event to reset animation
			$progressBar.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", resetAnim);					
		},
		resetAnim = function() {
			$progressBar.remove();
		},
		init = function(duration) {
			// Set the duration
			if(duration) {
				transitionDuration = duration + 'ms';
			}		
		};

	// Start animation
	document.addEventListener('spfrequest', startAnim);

	// Complete animation
	document.addEventListener('spfdone', completeAnim);	

	// Assign init to spf
	spf.progressInit = init;

})(window.jQuery, window.spf);