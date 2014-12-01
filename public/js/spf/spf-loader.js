(function(spf) {
	'use strict';

	spf = spf || {};

	var resources = {}, // hash to hold the resources
		checkResource = function(url) {
			if(resources[url]) {
				return true;
			}
			resources[url] = 1;
			return false;
		};

	spf.loadScript = function(url, callback) {
		if(!url) {
			return;
		}
		// make callback a noop (for now) if not present
		callback = callback || function() {};
		if(checkResource(url)) { // if resource already executed, then just execute callback
			callback();
			return;
		}

		var doc = document,
			scriptNode = doc.createElement('script'),
			refNode = doc.getElementsByTagName('script')[0];

		scriptNode.src = url;
		scriptNode.type = 'text/javascript';
		scriptNode.async = true; // Make it always async

		if (scriptNode.readyState) { // For IE
			scriptNode.onreadystatechange = function() {
				var state = this.readyState;
				if (state === "loaded" || state === "complete" || state === "completed") {
					this.onreadystatechange = null;
					callback();
				}
			};
		} else { // For all other browsers
			scriptNode.onload = scriptNode.onerror = function() {
				callback();	
			};
		}

		// Add to DOM
		refNode.parentNode.insertBefore(scriptNode, refNode);
	};

	spf.loadStyle = function(url) {
		if(!url || checkResource(url)) {
			return;
		}
        var linkNode = window.document.createElement('link'),
            refNode = window.document.getElementsByTagName('head')[0];

        linkNode.rel = 'stylesheet';
        linkNode.href = url;

        // temporarily, set media to something non-matching to ensure it'll
        // fetch without blocking render
        linkNode.media = 'only x';

        refNode.parentNode.insertBefore(linkNode, refNode);

        setTimeout( function(){
			// set media back to `all` so that the stylesheet applies once it loads
			linkNode.media = 'all';
        }, 0);		
	};
})(window.spf);