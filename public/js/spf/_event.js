(function($, require, raptor) {
    'use strict';

    var eventConfig = {
            pageContainer: null,
            delegateToPage: false,
            reservedNamespace: null
        },
        preventScrollTop = false, // Flag to avoid scrolling to top      
        performance =  window.performance,
        clearResourceTimings = (performance && (performance.clearResourceTimings ||
            performance.webkitClearResourceTimings ||
            performance.mozClearResourceTimings ||
            performance.msClearResourceTimings ||
            performance.oClearResourceTimings)) ||
            function noop() {},

        isString = function(value) {
            if(!value) {
                return false;
            }
            return  Object.prototype.toString.call(value) === '[object String]';
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
        // Checks if the value is present in the list
        checkDuplicate = function(list, value) {
            if(!list) {
                return false;
            }
            // Convert to array if string
            if(isString(list)) {
                list = [list];
            }
            // Convert list to string if needed
            var i,
                l,
                isDuplicate = false,
                listValue;
            for(i = 0, l = list.length; i < l; i++) {
                // Check and add a dot in the beginning
                listValue = '.' + list[i].replace(/^\./, '');                
                isDuplicate = new RegExp(listValue + '(\\.|$)').test(value);
                if(isDuplicate) {
                    break;
                }
            }
            return isDuplicate;
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
        scrollToHash = function(hash) {
            // if no hash return immediately
            if(!hash) {
                return;
            }
            var hashElem = document.getElementById(hash.substr(1));
            if(hashElem) {
                hashElem.scrollIntoView(true);
            }
        },
        resetHeight = function(body) {
            if(!body) {
                return;
            }
            for(var elem in body) {
                $('#' + elem).css('height', '');
            }
        },
        profile = function(timing) {
            if(!timing || !raptor) {
                return;
            }
            var profiler = raptor.find('ebay.profiler.Profiler'),
                startTime = timing.startTime,
                endTime = timing.spfProcessFoot || timing.spfProcessBody || timing.responseEnd;
                     
            if (profiler && typeof oGaugeInfo !== "undefined"){
                profiler.addParam("i_30i", endTime - startTime);
            } 
            clearResourceTimings.call(window.performance);        
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
                // Duplicate checks
                if(!checkDuplicate(pageNamespace, eventName) && // First check - namespace is already present in event name
                    !checkDuplicate(eventConfig.reservedNamespace, eventName)) { // Second check - namespace is already present in reservedNamespace
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
        // If reservedNamespace is string convert to array
        if(isString(eventConfig.reservedNamespace)) {
            eventConfig.reservedNamespace = eventConfig.reservedNamespace.replace(/\s/g, '').split(',');
        }
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

        // Handle spfhistory event
        document.addEventListener('spfhistory', function() {
            // prevent scroll to top
            preventScrollTop = true;
        });
        
        // Handle spferror event
        document.addEventListener('spferror', function() {
            // reset preventScrollTop
            preventScrollTop = false;
        });        

        // Handle spfprocess event
        document.addEventListener('spfprocess', function() {
            // Before response processing jump to the top
            if(!preventScrollTop) {
                window.scrollTo(0, 0);
            }
        });

        // Handle spfbeforerender event
        document.addEventListener('spfbeforerender', function(e) {
            var id = e.detail && e.detail.id,
                $elem,
                height;
            if (id) {
                $elem = $('#' + id);
                height = $elem.height();
                // Destory the widget
                destroyWidget(id);
                // set height if height greater that window height
                if(height > window.innerHeight) {
                    $elem.height(height);
                }
                // Empty the content so jQuery events get destroyed
                $elem.empty();
            }
        }, false);

        // Handle spfdone event
        document.addEventListener('spfdone', function(evt) {
            // Reset height
            resetHeight(evt.detail.response.body);
            // Fire document ready event
            $(document).trigger('ready');
            // Scroll to hash location
            if(!preventScrollTop) {
                scrollToHash(window.location.hash);
            }
            // Fire widnow load event
            $(window).trigger('load');
            // reset preventScrollTop
            preventScrollTop = false;
            // Do profiling
            profile(evt.detail.response.timing);
        }, false);
    }

})(window.jQuery, window.require, window.raptor);