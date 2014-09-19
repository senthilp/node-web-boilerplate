(function($, spf){
	'use strict';

	var $neo = $('noscript.neo'),
		versionParam;

	if($neo.length && $neo.data('spf')) {
		versionParam = $neo.data('version');
		// Wrapping it as a paramater
		versionParam = versionParam? '&v=' + versionParam:''; 		
		spf.init({
			"navigate-limit": 6,
			"url-identifier": "?neo=__type__" + versionParam
		});		
	}
})(window.jQuery, window.spf);