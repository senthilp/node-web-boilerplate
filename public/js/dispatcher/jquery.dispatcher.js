(function($) {
    'use strict';
    var $document = $(document.documentElement);

    // Create the dispatcher
    $.dispatcher = $.dispatcher || {};

    var dispatcherMethods = {
        trigger: function(event, data, elem) {
            // If element is provided trigger from element
            if(elem) {
                // Wrap in jQuery and call trigger                
                return $(elem).trigger(event, data);
            } else {
                return $document.trigger(event, data);
            }
        },

        on: function(event, callback, scope) {
            return $document.on(event, $.proxy(callback, scope || $document));
        },

        off: function(event) {
            return $document.off(event);
        }
    }; // dispatcherMethods end

    // Attach the dispatcher methods to $.dispatcher
    $.extend(true, $.dispatcher, dispatcherMethods);
})(jQuery);