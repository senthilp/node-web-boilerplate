(function($){
	'use strict';

	var DEFAULT_RESERVED_NAMESPACE = 'gh',
		$neo = $('noscript.neo');

	if($neo.length && $neo.data('eventing')) {
		var reservedNamespace = ($neo.data('reservedns') || DEFAULT_RESERVED_NAMESPACE).replace(/\s/g, '');
		// Check if the DEFAULT_RESERVED_NAMESPACE is part of the passed namespaces
		if(!new RegExp(DEFAULT_RESERVED_NAMESPACE + '(\\.|,|$)').test(reservedNamespace)) {
			reservedNamespace += ',' + DEFAULT_RESERVED_NAMESPACE;
		} 
		$._eventinit({
			"pageContainer": $neo.data('container'),
			"delegateToPage": $neo.data('delegatetopage'),
			"reservedNamespace": reservedNamespace
		});		
	}
})(window.jQuery);