(function($, spf) {
	'use strict';

	var $neo = $('noscript.neo');

	if($neo.length && $neo.data('spf') && spf) {
		// init progress
		spf.progressInit($neo.data('mediantime'));
	}

})(window.jQuery, window.spf);