(function($, require) {
    'use strict';

    var eventConfig = {
            pageContainer: null,
            delegateToPage: false
        },
        getPageNamespace = function(pageContainer) {
            if (!pageContainer) {
                return;
            }
            // Remove the first selector character
            var namespace = pageContainer.replace(/^(\.|#)/, '');
            // Add the namespace separator .   
            return '.' + namespace;
        },
        destroyWidget = function(elId) {
            // If require not present return immediately
            if (!require) {
                return;
            }
            var widget = require('raptor/widgets'),
                widgetObj = widget && widget.get(elId);
            if (widgetObj) {
                widgetObj.destroy();
            }
        },
        /**
         * Sets data in the cache if the both the specified lifetime and the
         * globally configured maximum allow it.
         *
         * @param {Function} originalFn The original function to override. 
         * @param {number} maxArguments The maximun arguments the original function expects.
         * @param {Array} args The original argument list to the original function.
         */        
        override = function(originalFn, maxArguments, args) {
            // if no originalFn return immediately
            if(!originalFn) {
                return this;
            }
            // normalize maxArguments & args
            if(Object.prototype.toString.call(maxArguments) === '[object Array]') {
                args = maxArguments;
                maxArguments = args.length;    
            }
            args = args || [];
            maxArguments = maxArguments || args.length;

            var argLen = args.length,
                pageContainer = eventConfig.pageContainer,
                canOverride = argLen && !!pageContainer,
                delegateParent = eventConfig.delegateToPage? pageContainer: this._widgetRootId,
                $delegateParent = null,
                eventData = null,
                eventName = null,
                targetElement = null,
                eventHandler = null,
                pageNamespace,
                i;

            //If this event pertains to the window, document or body, let jquery handle it.
            if (canOverride && delegateParent && this.parents(delegateParent).length) {
                eventName = args[0];
                $delegateParent = $(delegateParent);

                // cap argLen to 4, to adhere to jQuery API
                argLen = argLen > maxArguments ? maxArguments : argLen;

                for (i = 1; i < argLen; i++) {
                    //case of $("selector").on("click", "p", handler)
                    switch (typeof args[i]) {
                        case 'string':
                            targetElement = args[i];
                            break;
                        case 'function':
                            eventHandler = args[i];
                            break;
                        case 'object':
                            eventData = args[i];
                            break;
                        default:
                            break;
                    }
                }

                /*
                    Case where there is no delegation
                    $("selector").on("click", handler)
                */

                if ($delegateParent.length && !targetElement && this._selector) {
                    targetElement = this._selector;
                    // normalize the eventData object
                    if(!eventData) {
                        eventData = eventHandler;
                        eventHandler = null;
                    }
                    originalFn.call($delegateParent, eventName, targetElement, eventData, eventHandler);
                } else {
                    originalFn.apply(this, args);
                }
            } else if (canOverride && (this[0] === document || this[0] === window)) {
                pageNamespace = getPageNamespace(pageContainer);
                eventName = args[0];
                /*
                    If the event is being delegated to the document by the pages,
                    we need to namespace the events so that the evetns can be switched off
                    on navigation away from the current page.
                */
                if(!new RegExp(pageNamespace + '(\\.|$)').test(eventName)) { // First check if namespace if not already present
                    args[0] = eventName + pageNamespace;
                }
                originalFn.apply(this, args);
            } else {
                originalFn.apply(this, args);
            }
            // Returning the jquery object to continue chaining
            return this;            
        },
        originalOn = $.fn.on,
        originalOff = $.fn.off;

    /*
        Each page using the Event Wrapper will have to initialize the
        namespace in which the events are being bound.

        Call:
        $._eventinit(config);

        config = {
            pageContainer: ".vi-container or .srp-container" //REQUIRED
        }
    */
    $._eventinit = function(config) {
        $.extend(true, eventConfig, config);
    };

    // Extending the jQuery namespace
    $.fn.extend({
        _on: function() {
            return override.call(this, originalOn, 4, arguments);
        },
        _off: function() {
            if(arguments.length) {
                return override.call(this, originalOff, 3, arguments);
            } else {
                return originalOff.apply(this, arguments);
            }
        },
        // Overriding the defaul on & off for 3rd parties
        on: function() {
            return this._on.apply(this, arguments);
        },
        off: function() {
            return this._off.apply(this, arguments);
        }
    });

    // Attach SPF custom event listeners
    if (document.addEventListener) {
        // Handle spfxhrsent event
        document.addEventListener('spfrequest', function() {
            var $window = $(window),
                $document = $(document),
                pageNamespace = getPageNamespace(eventConfig.pageContainer);

            // Fire beforeunload and load events
            $window.trigger('beforeunload');
            $window.trigger('unload');

            // Remove all window events, to reset to clean slate
            $window._off(pageNamespace);

            // Remove all document events
            $document._off(pageNamespace);
        }, false);

        // Handle spfbeforerender event
        document.addEventListener('spfbeforerender', function(e) {
            var id = e.detail && e.detail.id;
            if (id) {
                // Destory the widget
                destroyWidget(id);
                // Empty the content so jQuery events get destroyed
                $('#' + id).empty();
            }
        }, false);

        // Handle spfscriptloaded event
        document.addEventListener('spfdone', function() {
            // Fire ready and load events
            $(document).trigger('ready');
            $(window).trigger('load');
        }, false);
    }

})(window.jQuery, window.require);