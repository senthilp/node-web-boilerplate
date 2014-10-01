(function($){
	'use strict';

	var DEFAULT_RESERVED_NAMESPACE = 'gh,ghn',
		$neo = $('noscript.neo');

	if($neo.length && $neo.data('eventing')) {
		var reservedNamespaceList = $neo.data('reservedns') || [],
			reservedNamespace = [],
			i,
			l;
		if(reservedNamespaceList.length) {
			reservedNamespaceList = reservedNamespaceList.replace(/\s/g, '').split(',');
		}
		for(i = 0, l = reservedNamespaceList.length;i < l; i++) {
			// Check if the DEFAULT_RESERVED_NAMESPACE is part of the passed namespaces - RegExp "(gh(\.|,|$)|ghn(\.|,|$))"		
			if(!new RegExp('(' + DEFAULT_RESERVED_NAMESPACE.concat(',')
															.split(',')
															.join('(\\.|,|$)|')
															.slice(0, -1)
															.concat(')')).test(reservedNamespaceList[i])) {
				reservedNamespace.push(reservedNamespaceList[i]);
			} 
		}
		// Finally add default to the reserved namespace
		reservedNamespace.push(DEFAULT_RESERVED_NAMESPACE);
		$._eventinit({
			"pageContainer": $neo.data('container'),
			"delegateToPage": $neo.data('delegatetopage'),
			"reservedNamespace": reservedNamespace.join(',')
		});		
	}
})(window.jQuery);