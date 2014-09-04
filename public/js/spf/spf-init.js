(function($, spf){
	'use strict';

	var $neo = $('noscript.neo');

	if($neo.length && $neo.data('spf')) {
		spf.init();		
	}
})(window.jQuery, window.spf);