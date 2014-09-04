(function($){
	'use strict';

	var $neo = $('noscript.neo');

	if($neo.length && $neo.data('eventing')) {
		$._eventinit({
			"pageContainer": $neo.data('container'),
			"delegateToPage": $neo.data('delegatetopage')
		});		
	}
})(window.jQuery);