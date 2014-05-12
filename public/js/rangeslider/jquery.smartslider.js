(function($) {
	 
	var defaultConf = {
		min: 0,
		max: 100,		// as defined in the standard
		step: 'any',	// granularity of the value. a non-zero float or int (or "any")
		steps: 0,
		value: 0,
		precision: undefined,
		vertical: 0,
		keyboard: true,
		progress: false,
		speed: 100
	};
	
//{{{ fn.drag
		
	/* 
		FULL featured drag and drop. 0.7 kb minified, 0.3 gzipped. done.
		Who told d'n'd is rocket science? Usage:
		
		$(".myelement").drag({y: false}).on("drag", function(event, x, y) {
			// do your custom thing
		});
		 
		Configuration: 
			x: true,		// enable horizontal drag
			y: true,		// enable vertical drag 
			drag: true		// true = perform drag, false = only fire events 
			
		Events: dragStart, drag, dragEnd. 
	*/
	var $doc, draggable;
	
	$.fn.draglight = function(conf) {
		
		// disable IE specialities
		document.ondragstart = function () { return false; };
		
		conf = $.extend({x: true, y: true, drag: true}, conf);
	
		$doc = $doc || $(document).on("mousedown mouseup", function(e) {
				
			var el = $(e.target);
			
			// start 
			if (e.type === "mousedown" && el.data("drag")) {
				
				var offset = el.position(),
					x0 = e.pageX - offset.left,
					y0 = e.pageY - offset.top,
					start = true;
				
				$doc.on("mousemove.drag", function(e) {
					var x = e.pageX -x0,
						y = e.pageY -y0,
						props = {};
					
					if (conf.x) { props.left = x; }
					if (conf.y) { props.top = y; }
					
					if (start) {
						el.trigger("dragStart");
						start = false;
					}
					if (conf.drag) { el.css(props); }
					el.trigger("drag", [y, x]);
					draggable = el;
				});
				
				e.preventDefault();
				
			} else {
				
				try {
					if (draggable) {
						draggable.trigger("dragEnd");
					}
				} finally {
					$doc.off("mousemove.drag");
					draggable = null;
				}
			}
							
		});
		
		return this.data("drag", true);
	};

//}}}
	

	
	function round(value, precision) {
		var n = Math.pow(10, precision);
		return Math.round(value * n) / n;
	}
	
	// get hidden element's width or height even though it's hidden
	function dim(el, key) {
		var v = parseInt(el.css(key), 10);
		if (v) { return v; }
		var s = el[0].currentStyle;
		return s && s.width && parseInt(s.width, 10);
	}
	
	function SmartSlider($elem, conf) {
		
		// private variables
		var self = this,
			$handle = $elem.find("a"),
			$progress = $elem.find("smartlider-progress"),
			vertical,
			value,			// current value
			prevValue,      // previous value
			origo,			// handle's start point
			len,				// length of the range
			pos,				// current position of the handle		
			range,
			step,
			precision;

		function triggerChange(val) {
			$elem.trigger('smartslider.change', val);
		}

		function triggerSlide(val) {
			$elem.trigger('smartslider.slide', val);
		}

		function getPosition($el, pageX, pageY) {
			var fix = vertical ? $el.height() / 2 : $el.width() / 2,
				x= vertical ? len-origo-fix + pageY  : pageX -origo -fix;
			return x;
		}

		/**
			The flesh and bone of this tool. All sliding is routed trough this.
			
			@param evt types include: click, keydown, blur and api (setValue call)
			@param isSetValue when called trough setValue() call (keydown, blur, api)
			@param bChangeEvent boolean flag to trigger a change event			
			
			vertical configuration gives additional complexity. 
		 */
		function slide(evt, x, val, isSetValue, bChangeEvent) {

			// calculate value based on slide position
			if (val === undefined) {
				val = x / len * range;
				
			// x is calculated based on val. we need to strip off min during calculation	
			} else if (isSetValue) {
				val -= conf.min;
			}
			
			// increment in steps
			if (step) {
				val = Math.round(val / step) * step;
			}

			// count x based on value or tweak x if stepping is done
			if (x === undefined || step) {
				x = val * len / range;
			}
			
			// crazy value?
			if (isNaN(val)) { return self; }
			
			// stay within range
			x = Math.max(0, Math.min(x, len));
			val = x / len * range;

			if (isSetValue || !vertical) {
				val += conf.min;
			}
			
			// in vertical ranges value rises upwards
			if (vertical) {
				if (isSetValue) {
					x = len -x;
				} else {
					val = conf.max - val;
				}
			}
			
			// precision
			val = round(val, precision);
			
			// smartslider.slide
			var isClick = evt.type === "click";
			if (val !== value && !isClick) {
				triggerSlide([val, x]);
			}
			
			// speed & callback
			var speed = isClick ? conf.speed : 0,
				callback = (isClick || bChangeEvent) && val !== value ? function()  {
					triggerChange(val);
				} : null;
			
			if (vertical) {
				$handle.animate({top: x}, speed, callback);
			} else {
				$handle.animate({left: x}, speed, callback);
			}
			
			// store current value
			value = val;
			pos = x;
			
			// se input field's value
			$elem.data('value', val);

			return self;
		}
		
		// get (HTML5) attributes into configuration
		$.each("min,max,step,value".split(","), function(i, key) {
			var val = $elem.data(key);
			if (parseFloat(val)) {
				conf[key] = parseFloat(val, 10);
			}
		});
		
		range = conf.max - conf.min;
		step = conf.step === 'any'?0 : conf.step;
		precision = conf.precision;
			 
		if (precision === undefined) {
			precision = step.toString().split(".");
			precision = precision.length === 2 ? precision[1].length : 0;
		}
		
		$.extend(self, {
			
			getValue: function() {
				return value;
			},
			
			setValue: function(val, e, bChangeEvent) {
				init();
				return slide(e || $.Event("api"), undefined, val, true, bChangeEvent);
			},
			
			getConf: function() {
				return conf;
			},
			
			getHandle: function() {
				return $handle;
			},
			
			getElem: function() {
				return $elem;
			},
				
			step: function(am, e) {
				e = e || $.Event();
				var step = conf.step === 'any' ? 1 : conf.step;
				self.setValue(value + step * (am || 1), e, true);
			},
			
			// HTML5 compatible name
			stepUp: function(am) {
				return self.step(am || 1);
			},
			
			// HTML5 compatible name
			stepDown: function(am) {
				return self.step(-am || -1);
			}
			
		});

		// dragging
		$handle.draglight({drag: false}).on("dragStart", function() {
			/* do some pre- calculations for seek() function. improves performance */
			init();
		}).on("drag", function(e, y, x) {
			if ($elem.is(":disabled")) { return false; }
			slide(e, vertical ? y : x);
		}).on("dragEnd", function(e) {
			if (!e.isDefaultPrevented()) {
				e.type = "change";
				$elem.trigger(e, [value]);
			}
			
		}).click(function(e) {
			return e.preventDefault();
		});

		// clicking
		$elem.click(function(e) {
			if ($elem.is(":disabled") || e.target === $handle[0]) {
				return e.preventDefault();
			}
			init();
			slide(e, getPosition($handle, e.pageX, e.pageY));
		});

		// mousedown on handle
		$handle.on('mousedown', function() {
			prevValue = value;
		});

		// mouseup on handle
		$handle.on('mouseup', function() {
			if(value !== prevValue) {
				triggerChange(value);
			}
		});

		if (conf.keyboard) {
			
			$doc.on('keydown', function(e) {
					
				var key = e.keyCode,
					up = $([75, 76, 38, 33, 39]).index(key) !== -1,
					down = $([74, 72, 40, 34, 37]).index(key) !== -1;
					 
				if ((up || down) && !(e.shiftKey || e.altKey || e.ctrlKey)) {
				
					// UP:	k=75, l=76, up=38, pageup=33, right=39			
					if (up) {
						self.step(key === 33 ? conf.max : 1, e);
						
					// DOWN:	j=74, h=72, down=40, pagedown=34, left=37
					} else if (down) {
						self.step(key === 34 ? -conf.max : -1, e);
					}
					return e.preventDefault();
				}
			});
		}
			
		// HTML5 DOM methods
		$.extend($elem[0], { stepUp: self.stepUp, stepDown: self.stepDown});
		
		
		// calculate all dimension related stuff
		function init() {
			vertical = conf.vertical || dim($elem, "height") > dim($elem, "width");
		 
			if (vertical) {
				len = dim($elem, "height") - dim($handle, "height");
				origo = $elem.offset().top + len;
			} else {
				len = dim($elem, "width") - dim($handle, "width");
				origo = $elem.offset().left;
			}
		}
		
		function begin() {
			init();
			self.setValue(conf.value !== undefined ? conf.value : conf.min);
		}
		begin();
		
		// some browsers cannot get dimensions upon initialization
		if (!len) {
			$(window).load(begin);
		}
	}
	
	// jQuery plugin implementation
	$.fn.smartslider = function(conf) {
		
		// extend configuration with globals
		conf = $.extend(true, {}, defaultConf, conf);
		
		return this.each(function() {
			new SmartSlider($(this), $.extend(true, {}, conf));
		});
	};
	
	$('.smartslider[data-init="true"]').smartslider();
	
}) (jQuery);
