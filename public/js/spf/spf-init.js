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
			"url-identifier": "?neo=__type__" + versionParam,
			"validator": function(url) {
				var	itemUrlPattern = /https?:\/\/[^\/]+\.ebay\.[^\/]+\/(soc\/)?itm\//,
					cgiUrlPattern = /https?:\/\/[^\/]+\.ebay\.[^\/]+\/ws\/eBayISAPI.dll\?ViewItem&item=(\d+)/;

				return itemUrlPattern.test(url) || cgiUrlPattern.test(url);
			}
		});		
	}
})(window.jQuery, window.spf);