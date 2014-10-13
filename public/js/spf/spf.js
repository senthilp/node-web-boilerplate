/*
SPF
(c) 2012-2014 Google, Inc.
License: MIT
*/
var COMPILED = false;
var goog = {};
goog.require = function(ns) {
};
goog.provide = function(ns) {
  var parts = ns.split(".");
  var cur = window;
  for (var name;parts.length && (name = parts.shift());) {
    if (cur[name]) {
      cur = cur[name];
    } else {
      cur = cur[name] = {};
    }
  }
};
goog.global = this;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.provide("spf");
var SPF_BOOTLOADER = false;
var SPF_DEBUG = true;
var SPF_TRACING = false;
spf.bind = function(fn, self, var_args) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(self, newArgs);
  };
};
spf.execute = function(fn, var_args) {
  if (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    try {
      return fn.apply(null, args);
    } catch (err) {
      return err;
    }
  }
};
spf.dispatch = function(name, opt_detail) {
  if (document.createEvent) {
    var evt = document.createEvent("CustomEvent");
    var bubbles = true;
    var cancelable = true;
    evt.initCustomEvent(name, bubbles, cancelable, opt_detail);
    return document.dispatchEvent(evt);
  }
  return true;
};
spf.now = function() {
  return(new Date).getTime();
};
spf.EventName = {CLICK:"spfclick", CSS_BEFORE_UNLOAD:"spfcssbeforeunload", CSS_UNLOAD:"spfcssunload", DONE:"spfdone", ERROR:"spferror", HISTORY:"spfhistory", JS_BEFORE_UNLOAD:"spfjsbeforeunload", JS_UNLOAD:"spfjsunload", PART_DONE:"spfpartdone", PART_PROCESS:"spfpartprocess", PROCESS:"spfprocess", READY:"spfready", RELOAD:"spfreload", REQUEST:"spfrequest"};
spf.SingleResponse;
spf.MultipartResponse;
spf.RequestOptions;
spf.EventDetail;
goog.provide("spf.state");
spf.state.has = function(key) {
  return key in spf.state.values_;
};
spf.state.get = function(key) {
  return spf.state.values_[key];
};
spf.state.set = function(key, value) {
  spf.state.values_[key] = value;
  return value;
};
spf.state.Key = {CACHE_COUNTER:"cache-counter", CACHE_MAX:"cache-max", CACHE_STORAGE:"cache-storage", CONFIG_VALUES:"config", HISTORY_CALLBACK:"history-callback", HISTORY_ERROR_CALLBACK:"history-error-callback", HISTORY_IGNORE_POP:"history-ignore-pop", HISTORY_INIT:"history-init", HISTORY_LISTENER:"history-listener", HISTORY_TIMESTAMP:"history-timestamp", HISTORY_URL:"history-url", NAV_COUNTER:"nav-counter", NAV_INIT:"nav-init", NAV_LISTENER:"nav-listener", NAV_PREFETCHES:"nav-prefetches", NAV_PROMOTE:"nav-promote", 
NAV_PROMOTE_TIME:"nav-promote-time", NAV_REFERER:"nav-referer", NAV_REQUEST:"nav-request", NAV_TIME:"nav-time", PREFETCH_LISTENER:"prefetch-listener", PUBSUB_SUBS:"ps-s", RESOURCE_PATHS_PREFIX:"rsrc-p-", RESOURCE_STATUS:"rsrc-s", RESOURCE_URLS:"rsrc-u", SCRIPT_DEPS:"js-d", SCRIPT_URLS:"js-u", TASKS_UID:"uid"};
spf.state.values_ = window["_spf_state"] || {};
window["_spf_state"] = spf.state.values_;
goog.provide("spf.config");
goog.require("spf.state");
spf.config.Value;
spf.config.defaults = {"animation-class":"spf-animate", "animation-duration":425, "cache-lifetime":10 * 60 * 1E3, "cache-max":50, "cache-unified":false, "link-class":"spf-link", "nolink-class":"spf-nolink", "navigate-limit":20, "navigate-lifetime":24 * 60 * 60 * 1E3, "request-timeout":0, "url-identifier":"?spf=__type__"};
spf.config.init = function(opt_config) {
  var config = opt_config || {};
  for (var key in spf.config.defaults) {
    var value = key in config ? config[key] : spf.config.defaults[key];
    spf.config.set(key, value);
  }
  for (var key in config) {
    if (!(key in spf.config.defaults)) {
      spf.config.set(key, config[key]);
    }
  }
};
spf.config.has = function(name) {
  return name in spf.config.values;
};
spf.config.get = function(name) {
  return spf.config.values[name];
};
spf.config.set = function(name, value) {
  spf.config.values[name] = value;
  return value;
};
spf.config.clear = function() {
  for (var key in spf.config.values) {
    delete spf.config.values[key];
  }
};
spf.config.values = {};
if (!spf.state.has(spf.state.Key.CONFIG_VALUES)) {
  spf.state.set(spf.state.Key.CONFIG_VALUES, spf.config.values);
}
spf.config.values = (spf.state.get(spf.state.Key.CONFIG_VALUES));
goog.provide("spf.array");
goog.require("spf");
spf.array.ArrayLike;
spf.array.each = function(arr, fn, opt_obj) {
  if (!SPF_BOOTLOADER && arr.forEach) {
    arr.forEach(fn, opt_obj);
    return;
  }
  for (var i = 0, l = arr.length;i < l;i++) {
    if (i in arr) {
      fn.call(opt_obj, arr[i], i, arr);
    }
  }
};
spf.array.every = function(arr, fn, opt_obj) {
  if (!SPF_BOOTLOADER && arr.every) {
    return arr.every(fn, opt_obj);
  }
  for (var i = 0, l = arr.length;i < l;i++) {
    if (i in arr && !fn.call(opt_obj, arr[i], i, arr)) {
      return false;
    }
  }
  return true;
};
spf.array.filter = function(arr, fn, opt_obj) {
  if (!SPF_BOOTLOADER && arr.filter) {
    return arr.filter(fn, opt_obj);
  }
  var res = [];
  spf.array.each(arr, function(a, i, arr) {
    if (fn.call(opt_obj, a, i, arr)) {
      res.push(a);
    }
  });
  return res;
};
spf.array.map = function(arr, fn, opt_obj) {
  if (!SPF_BOOTLOADER && arr.map) {
    return arr.map(fn, opt_obj);
  }
  var res = [];
  res.length = arr.length;
  spf.array.each(arr, function(a, i, arr) {
    res[i] = fn.call(opt_obj, a, i, arr);
  });
  return res;
};
spf.array.toArray = function(val) {
  return spf.array.isArray(val) ? val : [val];
};
spf.array.isArray = function(val) {
  if (SPF_BOOTLOADER) {
    return!!(val && val.push);
  }
  return Object.prototype.toString.call(val) == "[object Array]";
};
goog.provide("spf.cache");
goog.require("spf");
goog.require("spf.config");
goog.require("spf.state");
spf.cache.get = function(key) {
  var storage = spf.cache.storage_();
  if (!(key in storage)) {
    return;
  }
  var unit = storage[key];
  if (spf.cache.valid_(unit)) {
    spf.cache.updateCount_(unit);
    return unit["data"];
  }
  spf.cache.remove(key);
};
spf.cache.set = function(key, data, opt_lifetime) {
  var lifetime = parseInt(opt_lifetime, 10);
  var max = parseInt(spf.config.get("cache-max"), 10);
  if (lifetime <= 0 || max <= 0) {
    return;
  }
  var storage = spf.cache.storage_();
  storage[key] = spf.cache.create_(key, data, lifetime);
  setTimeout(spf.cache.collect, 1E3);
};
spf.cache.remove = function(key) {
  var storage = spf.cache.storage_();
  if (key in storage) {
    delete storage[key];
  }
};
spf.cache.clear = function() {
  spf.cache.storage_({});
};
spf.cache.collect = function() {
  var storage = spf.cache.storage_();
  for (var key in storage) {
    var unit = storage[key];
    if (!spf.cache.valid_(unit)) {
      delete storage[key];
    }
  }
  spf.cache.trim_();
};
spf.cache.Unit;
spf.cache.valid_ = function(unit) {
  if (!(unit && "data" in unit)) {
    return false;
  }
  var lifetime = unit["life"];
  lifetime = isNaN(lifetime) ? Infinity : lifetime;
  var timestamp = unit["time"];
  var age = spf.now() - timestamp;
  return age < lifetime;
};
spf.cache.trim_ = function() {
  var storage = spf.cache.storage_();
  var max = parseInt(spf.config.get("cache-max"), 10);
  max = isNaN(max) ? Infinity : max;
  var extra = Object.keys(storage).length - max;
  if (extra <= 0) {
    return;
  }
  for (var i = 0;i < extra;i++) {
    var min = {count:Infinity};
    for (var key in storage) {
      if (storage[key].count < min.count) {
        min.key = key;
        min.count = storage[key].count;
      }
    }
    delete storage[min.key];
  }
};
spf.cache.create_ = function(key, data, lifetime) {
  var unit = {"data":data, "life":lifetime, "time":spf.now(), "count":0};
  spf.cache.updateCount_(unit);
  return unit;
};
spf.cache.updateCount_ = function(unit) {
  var count = parseInt(spf.state.get(spf.state.Key.CACHE_COUNTER), 10) || 0;
  count++;
  spf.state.set(spf.state.Key.CACHE_COUNTER, count);
  unit.count = count;
};
spf.cache.storage_ = function(opt_storage) {
  if (opt_storage || !spf.state.has(spf.state.Key.CACHE_STORAGE)) {
    return(spf.state.set(spf.state.Key.CACHE_STORAGE, opt_storage || {}));
  }
  return(spf.state.get(spf.state.Key.CACHE_STORAGE));
};
goog.provide("spf.debug");
goog.require("spf");
spf.debug.debug = function(var_args) {
  if (spf.debug.isLevelEnabled(spf.debug.Level.DEBUG)) {
    spf.debug.log(spf.debug.Level.DEBUG, "spf", arguments);
  }
};
spf.debug.info = function(var_args) {
  if (spf.debug.isLevelEnabled(spf.debug.Level.INFO)) {
    spf.debug.log(spf.debug.Level.INFO, "spf", arguments);
  }
};
spf.debug.warn = function(var_args) {
  if (spf.debug.isLevelEnabled(spf.debug.Level.WARN)) {
    spf.debug.log(spf.debug.Level.WARN, "spf", arguments);
  }
};
spf.debug.error = function(var_args) {
  if (spf.debug.isLevelEnabled(spf.debug.Level.ERROR)) {
    spf.debug.log(spf.debug.Level.ERROR, "spf", arguments);
  }
};
spf.debug.log = function(method, prefix, args) {
  if (!SPF_DEBUG || !window.console) {
    return;
  }
  args = Array.prototype.slice.call(args);
  var current = spf.now();
  var overall = spf.debug.formatDuration(spf.debug.start_, current);
  if (spf.debug.split_) {
    var split = spf.debug.formatDuration(spf.debug.split_, current);
    args.unshift(overall + "/" + split + ":");
  } else {
    args.unshift(overall + ":");
  }
  if (spf.debug.direct_) {
    args.unshift("[" + prefix + "]");
    window.console[method].apply(window.console, args);
  } else {
    args.unshift("[" + prefix + " - " + method + "]");
    window.console.log(args.join(" "));
  }
};
spf.debug.reset = function() {
  spf.debug.split_ = spf.now();
};
spf.debug.formatDuration = function(start, end) {
  var dur = (end - start) / 1E3;
  if (dur.toFixed) {
    dur = dur.toFixed(3);
  }
  return dur + "s";
};
spf.debug.isLevelEnabled = function(level) {
  return spf.debug.levels_[level] >= spf.debug.levels_[spf.debug.OUTPUT];
};
spf.debug.start_ = spf.now();
spf.debug.split_ = 0;
spf.debug.direct_ = !!(window.console && window.console.debug);
spf.debug.levels_ = {"debug":1, "info":2, "warn":3, "error":4};
spf.debug.Level = {DEBUG:"debug", INFO:"info", WARN:"warn", ERROR:"error"};
spf.debug.OUTPUT = "debug";
goog.provide("spf.dom.classlist");
spf.dom.classlist.get = function(node) {
  if (node.classList) {
    return node.classList;
  } else {
    return node.className && node.className.match(/\S+/g) || [];
  }
};
spf.dom.classlist.contains = function(node, cls) {
  if (node.classList) {
    return node.classList.contains(cls);
  } else {
    var classes = spf.dom.classlist.get(node);
    for (var i = 0, l = classes.length;i < l;i++) {
      if (classes[i] == cls) {
        return true;
      }
    }
    return false;
  }
};
spf.dom.classlist.add = function(node, cls) {
  if (node.classList) {
    node.classList.add(cls);
  } else {
    if (!spf.dom.classlist.contains(node, cls)) {
      node.className += " " + cls;
    }
  }
};
spf.dom.classlist.remove = function(node, cls) {
  if (node.classList) {
    node.classList.remove(cls);
  } else {
    var classes = spf.dom.classlist.get(node);
    var newClasses = [];
    for (var i = 0, l = classes.length;i < l;i++) {
      if (classes[i] != cls) {
        newClasses.push(classes[i]);
      }
    }
    node.className = newClasses.join(" ");
  }
};
goog.provide("spf.dom");
goog.require("spf");
spf.dom.query = function(selector, opt_document) {
  var doc = opt_document || document;
  if (doc.querySelectorAll) {
    return doc.querySelectorAll(selector);
  }
  return[];
};
spf.dom.insertSiblingBefore = function(newNode, refNode) {
  refNode.parentNode.insertBefore(newNode, refNode);
};
spf.dom.insertSiblingAfter = function(newNode, refNode) {
  refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
};
spf.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if (parent && parent.nodeType != 11) {
    if (element.removeNode) {
      return(element.removeNode(false));
    } else {
      while (child = element.firstChild) {
        parent.insertBefore(child, element);
      }
      return(parent.removeChild(element));
    }
  }
};
spf.dom.inflateElement = function(element, parent) {
  if (parent) {
    var child;
    while (child = element.firstChild) {
      parent.appendChild(child);
    }
    element.appendChild(parent);
  }
};
spf.dom.getAncestor = function(element, matcher, opt_parent) {
  while (element) {
    if (matcher(element)) {
      return element;
    }
    if (opt_parent && element == opt_parent) {
      return null;
    }
    element = element.parentNode;
  }
  return null;
};
spf.dom.setAttributes = function(element, attributes) {
  for (var name in attributes) {
    var value = attributes[name];
    if (name == "class") {
      element.className = value;
    } else {
      if (name == "style") {
        element.style.cssText = value;
      } else {
        element.setAttribute(name, value);
      }
    }
  }
};
spf.dom.createIframe = function(opt_id, opt_document, opt_callback) {
  var id = opt_id || "";
  var doc = opt_document || document;
  var iframeEl = doc.createElement("iframe");
  iframeEl.id = id;
  iframeEl.src = 'javascript:""';
  iframeEl.style.display = "none";
  if (opt_callback) {
    iframeEl.onload = spf.bind(opt_callback, null, iframeEl);
  }
  doc.body.appendChild(iframeEl);
  return(iframeEl);
};
goog.provide("spf.history");
goog.require("spf");
goog.require("spf.config");
goog.require("spf.debug");
goog.require("spf.dom");
goog.require("spf.state");
spf.history.init = function(callback, errorCallback) {
  if (!spf.state.get(spf.state.Key.HISTORY_INIT) && window.addEventListener) {
    var url = spf.history.getCurrentUrl_();
    window.addEventListener("popstate", spf.history.pop_, false);
    spf.state.set(spf.state.Key.HISTORY_INIT, true);
    spf.state.set(spf.state.Key.HISTORY_CALLBACK, callback);
    spf.state.set(spf.state.Key.HISTORY_ERROR_CALLBACK, errorCallback);
    spf.state.set(spf.state.Key.HISTORY_LISTENER, spf.history.pop_);
    spf.state.set(spf.state.Key.HISTORY_URL, url);
    spf.state.set(spf.state.Key.HISTORY_TIMESTAMP, spf.now());
    var historyState = {"spf-referer":document.referrer};
    try {
      spf.history.replace(url, historyState);
    } catch (err) {
      if (errorCallback) {
        errorCallback(url, err);
      }
    }
  }
};
spf.history.dispose = function() {
  if (spf.state.get(spf.state.Key.HISTORY_INIT)) {
    if (window.removeEventListener) {
      window.removeEventListener("popstate", (spf.state.get(spf.state.Key.HISTORY_LISTENER)), false);
    }
    spf.state.set(spf.state.Key.HISTORY_INIT, false);
    spf.state.set(spf.state.Key.HISTORY_CALLBACK, null);
    spf.state.set(spf.state.Key.HISTORY_ERROR_CALLBACK, null);
    spf.state.set(spf.state.Key.HISTORY_LISTENER, null);
    spf.state.set(spf.state.Key.HISTORY_URL, null);
    spf.state.set(spf.state.Key.HISTORY_TIMESTAMP, 0);
  }
};
spf.history.add = function(opt_url, opt_state, opt_doCallback) {
  spf.debug.info("history.add ", opt_url);
  spf.history.push_(false, opt_url, opt_state, opt_doCallback);
};
spf.history.replace = function(opt_url, opt_state, opt_doCallback, opt_retainState) {
  var currentState = spf.history.getCurrentState_();
  if (opt_retainState && currentState) {
    opt_state = opt_state || currentState;
  }
  spf.debug.info("history.replace ", opt_url);
  spf.history.push_(true, opt_url, opt_state, opt_doCallback);
};
spf.history.removeCurrentEntry = function() {
  spf.state.set(spf.state.Key.HISTORY_IGNORE_POP, true);
  window.history.back();
};
spf.history.push_ = function(replace, opt_url, opt_state, opt_doCallback) {
  if (!opt_url && !opt_state) {
    return;
  }
  var url = opt_url || spf.history.getCurrentUrl_();
  var state = opt_state || {};
  var timestamp = spf.now();
  spf.state.set(spf.state.Key.HISTORY_TIMESTAMP, timestamp);
  state["spf-timestamp"] = timestamp;
  if (replace) {
    spf.history.doReplaceState_(state, "", url);
    spf.debug.debug("    replaceState:  ", "url=", url, "state=", state);
  } else {
    spf.history.doPushState_(state, "", url);
    spf.debug.debug("    pushState:  ", "url=", url, "state=", state);
  }
  spf.state.set(spf.state.Key.HISTORY_URL, url);
  if (opt_doCallback) {
    var callback = (spf.state.get(spf.state.Key.HISTORY_CALLBACK));
    if (callback) {
      callback(url, state);
    }
  }
};
spf.history.pop_ = function(evt) {
  var url = spf.history.getCurrentUrl_();
  spf.debug.info("history.pop ", "url=", url, "evt=", evt);
  if (spf.state.get(spf.state.Key.HISTORY_IGNORE_POP)) {
    spf.state.set(spf.state.Key.HISTORY_IGNORE_POP, false);
    return;
  }
  if (!evt.state) {
    return;
  }
  var state = evt.state;
  var timestamp = state["spf-timestamp"];
  if (url == spf.state.get(spf.state.Key.HISTORY_URL)) {
    spf.state.set(spf.state.Key.HISTORY_TIMESTAMP, timestamp);
    spf.history.doReplaceState_(state, "", url);
    spf.debug.debug("    replaceState:  ", "url=", url, "state=", state);
  } else {
    var current = parseInt(spf.state.get(spf.state.Key.HISTORY_TIMESTAMP), 10);
    state["spf-back"] = timestamp < current;
    state["spf-current"] = spf.state.get(spf.state.Key.HISTORY_URL);
    spf.state.set(spf.state.Key.HISTORY_TIMESTAMP, timestamp);
    spf.state.set(spf.state.Key.HISTORY_URL, url);
    var callback = (spf.state.get(spf.state.Key.HISTORY_CALLBACK));
    if (callback) {
      callback(url, state);
    }
  }
};
spf.history.getCurrentUrl_ = function() {
  return window.location.href;
};
spf.history.getCurrentState_ = function() {
  return(window.history.state);
};
spf.history.doPushState_ = function(data, title, opt_url) {
  var iframe = spf.history.getIframe();
  var pushState = iframe.contentWindow.history.pushState;
  if (typeof pushState == "function") {
    pushState.call(window.history, data, title, opt_url);
  } else {
    throw new Error("history.pushState is not a function.");
  }
};
spf.history.doReplaceState_ = function(data, title, opt_url) {
  var iframe = spf.history.getIframe();
  var replaceState = iframe.contentWindow.history.replaceState;
  if (typeof replaceState == "function") {
    replaceState.call(window.history, data, title, opt_url);
  } else {
    throw new Error("history.replaceState is not a function");
  }
};
spf.history.getIframe = function() {
  var frame = document.getElementById("history-iframe");
  if (!frame) {
    frame = spf.dom.createIframe("history-iframe");
  }
  return(frame);
};
goog.provide("spf.net.xhr");
spf.net.xhr.Options;
spf.net.xhr.PostData;
spf.net.xhr.get = function(url, opt_options) {
  return spf.net.xhr.send("GET", url, null, opt_options);
};
spf.net.xhr.post = function(url, data, opt_options) {
  return spf.net.xhr.send("POST", url, data, opt_options);
};
spf.net.xhr.send = function(method, url, data, opt_options) {
  var options = opt_options || {};
  var chunked = false;
  var offset = 0;
  var timer;
  var xhr = new XMLHttpRequest;
  xhr.open(method, url, true);
  xhr["timing"] = {};
  var xhr_abort = xhr.abort;
  xhr.abort = function() {
    clearTimeout(timer);
    xhr.onreadystatechange = null;
    xhr_abort.call(xhr);
  };
  xhr.onreadystatechange = function() {
    var timing = xhr["timing"];
    if (xhr.readyState == spf.net.xhr.State.HEADERS_RECEIVED) {
      timing["responseStart"] = timing["responseStart"] || spf.now();
      var encoding = xhr.getResponseHeader("Transfer-Encoding") || "";
      chunked = encoding.toLowerCase().indexOf("chunked") > -1;
      if (!chunked) {
        var firefoxSpdy = xhr.getResponseHeader("X-Firefox-Spdy");
        var loadTimes = window.chrome && (chrome.loadTimes && chrome.loadTimes());
        var chromeSpdy = loadTimes && loadTimes.wasFetchedViaSpdy;
        chunked = !!(firefoxSpdy || chromeSpdy);
      }
      if (options.onHeaders) {
        options.onHeaders(xhr);
      }
    } else {
      if (xhr.readyState == spf.net.xhr.State.LOADING) {
        if (chunked && options.onChunk) {
          var chunk = xhr.responseText.substring(offset);
          offset = xhr.responseText.length;
          options.onChunk(xhr, chunk);
        }
      } else {
        if (xhr.readyState == spf.net.xhr.State.DONE) {
          timing["responseEnd"] = timing["responseEnd"] || spf.now();
          if (window.performance && window.performance.getEntriesByName) {
            xhr["resourceTiming"] = window.performance.getEntriesByName(url)[0];
          }
          if (chunked && (options.onChunk && xhr.responseText.length > offset)) {
            var chunk = xhr.responseText.substring(offset);
            offset = xhr.responseText.length;
            options.onChunk(xhr, chunk);
          }
          clearTimeout(timer);
          if (options.onDone) {
            options.onDone(xhr);
          }
        }
      }
    }
  };
  var addContentType = method == "POST";
  if (options.headers) {
    for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
      if ("content-type" == key.toLowerCase()) {
        addContentType = false;
      }
    }
  }
  if (addContentType) {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  if (options.timeoutMs > 0) {
    timer = setTimeout(function() {
      xhr.abort();
      if (options.onTimeout) {
        options.onTimeout(xhr);
      }
    }, options.timeoutMs);
  }
  xhr["timing"]["fetchStart"] = spf.now();
  xhr.send(data);
  return xhr;
};
spf.net.xhr.State = {UNSENT:0, OPENED:1, HEADERS_RECEIVED:2, LOADING:3, DONE:4};
goog.provide("spf.pubsub");
goog.require("spf");
goog.require("spf.array");
goog.require("spf.state");
spf.pubsub.subscribe = function(topic, fn) {
  if (topic && fn) {
    if (!(topic in spf.pubsub.subscriptions)) {
      spf.pubsub.subscriptions[topic] = [];
    }
    spf.pubsub.subscriptions[topic].push(fn);
  }
};
spf.pubsub.unsubscribe = function(topic, fn) {
  if (topic in spf.pubsub.subscriptions && fn) {
    spf.array.every(spf.pubsub.subscriptions[topic], function(subFn, i, arr) {
      if (subFn == fn) {
        arr[i] = null;
        return false;
      }
      return true;
    });
  }
};
spf.pubsub.publish = function(topic) {
  spf.pubsub.publish_(topic);
};
spf.pubsub.flush = function(topic) {
  spf.pubsub.publish_(topic, true);
};
spf.pubsub.publish_ = function(topic, opt_unsub) {
  if (topic in spf.pubsub.subscriptions) {
    spf.array.each(spf.pubsub.subscriptions[topic], function(subFn, i, arr) {
      if (opt_unsub) {
        arr[i] = null;
      }
      if (subFn) {
        subFn();
      }
    });
  }
};
spf.pubsub.clear = function(topic) {
  delete spf.pubsub.subscriptions[topic];
};
spf.pubsub.subscriptions = {};
if (SPF_BOOTLOADER) {
  spf.state.set(spf.state.Key.PUBSUB_SUBS, spf.pubsub.subscriptions);
} else {
  if (!spf.state.has(spf.state.Key.PUBSUB_SUBS)) {
    spf.state.set(spf.state.Key.PUBSUB_SUBS, spf.pubsub.subscriptions);
  }
  spf.pubsub.subscriptions = (spf.state.get(spf.state.Key.PUBSUB_SUBS));
}
;goog.provide("spf.string");
goog.require("spf");
spf.string.contains = function(str, substr) {
  return str.indexOf(substr) != -1;
};
spf.string.startsWith = function(str, prefix, opt_offset) {
  var idx = opt_offset || 0;
  return str.lastIndexOf(prefix, idx) == idx;
};
spf.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};
spf.string.isString = function(val) {
  if (SPF_BOOTLOADER) {
    return typeof val == "string";
  }
  return Object.prototype.toString.call(val) == "[object String]";
};
spf.string.trim = function() {
  if (String.prototype.trim) {
    return function(str) {
      return str.trim();
    };
  } else {
    return function(str) {
      return str.replace(/^\s+|\s+$/g, "");
    };
  }
}();
spf.string.bisect = function(str, sep) {
  var arr = str.split(sep);
  return[arr[0], arr.slice(1).join(sep)];
};
spf.string.hashcode = function(str) {
  str = str || "";
  var result = 0;
  for (var i = 0, l = str.length;i < l;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= 4294967296;
  }
  return result;
};
spf.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.provide("spf.url");
goog.require("spf.config");
goog.require("spf.string");
spf.url.URLUtils;
spf.url.utils = function(url) {
  var aEl = document.createElement("a");
  aEl.href = url;
  aEl.href = aEl.href;
  var utils = {href:aEl.href, protocol:aEl.protocol, host:aEl.host, hostname:aEl.hostname, port:aEl.port, pathname:aEl.pathname, search:aEl.search, hash:aEl.hash, username:aEl.username, password:aEl.password};
  utils.origin = utils.protocol + "//" + utils.host;
  if (!utils.pathname || utils.pathname[0] != "/") {
    utils.pathname = "/" + utils.pathname;
  }
  return utils;
};
spf.url.absolute = function(relative) {
  var utils = spf.url.utils(relative);
  return spf.url.unfragment(utils.href);
};
spf.url.path = function(url) {
  var utils = spf.url.utils(url);
  return utils.pathname;
};
spf.url.origin = function(url) {
  var utils = spf.url.utils(url);
  return utils.origin;
};
spf.url.identify = function(url, opt_type) {
  var ident = (spf.config.get("url-identifier")) || "";
  if (ident) {
    var type = opt_type || "";
    var frag = "";
    if (spf.string.contains(url, "#")) {
      var res = spf.string.bisect(url, "#");
      url = res[0];
      frag = "#" + res[1];
    }
    ident = ident.replace("__type__", type);
    if (spf.string.startsWith(ident, "?") && spf.string.contains(url, "?")) {
      url += ident.replace("?", "&");
    } else {
      url += ident;
    }
    url += frag;
  }
  return url;
};
spf.url.unprotocol = function(url) {
  return url.replace(/^[a-zA-Z]+:\/\//, "//");
};
spf.url.unfragment = function(url) {
  var res = spf.string.bisect(url, "#");
  return res[0];
};
goog.provide("WTF");
goog.provide("WTF.data.EventFlag");
goog.provide("WTF.io.ByteArray");
goog.provide("WTF.trace");
goog.provide("WTF.trace.Flow");
goog.provide("WTF.trace.Scope");
goog.provide("WTF.trace.TimeRange");
goog.provide("WTF.trace.Zone");
goog.provide("WTF.trace.events");
WTF.ENABLED = true;
WTF.EXPECTED_API_VERSION_ = 2;
WTF.PRESENT = WTF.ENABLED && (!!goog.global["wtf"] && goog.global["wtf"]["trace"]["API_VERSION"] == WTF.EXPECTED_API_VERSION_);
WTF.hasHighResolutionTimes = WTF.PRESENT ? goog.global["wtf"]["hasHighResolutionTimes"] : false;
WTF.timebase = WTF.PRESENT ? goog.global["wtf"]["timebase"] : function() {
  return 0;
};
WTF.now = WTF.PRESENT ? goog.global["wtf"]["now"] : function() {
  return 0;
};
WTF.io.ByteArray;
WTF.trace.Zone;
WTF.trace.Scope;
WTF.trace.Flow;
WTF.trace.TimeRange;
WTF.data.EventFlag = {HIGH_FREQUENCY:1 << 1, SYSTEM_TIME:1 << 2, INTERNAL:1 << 3, APPEND_SCOPE_DATA:1 << 4, BUILTIN:1 << 5, APPEND_FLOW_DATA:1 << 6};
WTF.data.ZoneType = {SCRIPT:"script", NATIVE_SCRIPT:"native_script", NATIVE_GPU:"native_gpu", NATIVE_BROWSER:"native_browser"};
WTF.trace.prepare = WTF.PRESENT ? goog.global["wtf"]["trace"]["prepare"] : goog.nullFunction;
WTF.trace.shutdown = WTF.PRESENT ? goog.global["wtf"]["trace"]["shutdown"] : goog.nullFunction;
WTF.trace.start = WTF.PRESENT ? goog.global["wtf"]["trace"]["start"] : goog.nullFunction;
WTF.trace.snapshot = WTF.PRESENT ? goog.global["wtf"]["trace"]["snapshot"] : goog.nullFunction;
WTF.trace.snapshotAll = WTF.PRESENT ? goog.global["wtf"]["trace"]["snapshotAll"] : goog.nullFunction;
WTF.trace.reset = WTF.PRESENT ? goog.global["wtf"]["trace"]["reset"] : goog.nullFunction;
WTF.trace.stop = WTF.PRESENT ? goog.global["wtf"]["trace"]["stop"] : goog.nullFunction;
WTF.trace.createZone = WTF.PRESENT ? goog.global["wtf"]["trace"]["createZone"] : goog.nullFunction;
WTF.trace.deleteZone = WTF.PRESENT ? goog.global["wtf"]["trace"]["deleteZone"] : goog.nullFunction;
WTF.trace.pushZone = WTF.PRESENT ? goog.global["wtf"]["trace"]["pushZone"] : goog.nullFunction;
WTF.trace.popZone = WTF.PRESENT ? goog.global["wtf"]["trace"]["popZone"] : goog.nullFunction;
WTF.trace.enterScope = WTF.PRESENT ? goog.global["wtf"]["trace"]["enterScope"] : goog.nullFunction;
WTF.trace.enterTracingScope = WTF.PRESENT ? goog.global["wtf"]["trace"]["enterTracingScope"] : goog.nullFunction;
WTF.trace.leaveScope = WTF.PRESENT ? goog.global["wtf"]["trace"]["leaveScope"] : function(scope, opt_result, opt_time) {
  return opt_result;
};
WTF.trace.appendScopeData = WTF.PRESENT ? goog.global["wtf"]["trace"]["appendScopeData"] : goog.nullFunction;
WTF.trace.branchFlow = WTF.PRESENT ? goog.global["wtf"]["trace"]["branchFlow"] : goog.nullFunction;
WTF.trace.extendFlow = WTF.PRESENT ? goog.global["wtf"]["trace"]["extendFlow"] : goog.nullFunction;
WTF.trace.terminateFlow = WTF.PRESENT ? goog.global["wtf"]["trace"]["terminateFlow"] : goog.nullFunction;
WTF.trace.appendFlowData = WTF.PRESENT ? goog.global["wtf"]["trace"]["appendFlowData"] : goog.nullFunction;
WTF.trace.clearFlow = WTF.PRESENT ? goog.global["wtf"]["trace"]["clearFlow"] : goog.nullFunction;
WTF.trace.spanFlow = WTF.PRESENT ? goog.global["wtf"]["trace"]["spanFlow"] : goog.nullFunction;
WTF.trace.mark = WTF.PRESENT ? goog.global["wtf"]["trace"]["mark"] : goog.nullFunction;
WTF.trace.timeStamp = WTF.PRESENT ? goog.global["wtf"]["trace"]["timeStamp"] : goog.nullFunction;
WTF.trace.beginTimeRange = WTF.PRESENT ? goog.global["wtf"]["trace"]["beginTimeRange"] : goog.nullFunction;
WTF.trace.endTimeRange = WTF.PRESENT ? goog.global["wtf"]["trace"]["endTimeRange"] : goog.nullFunction;
WTF.trace.ignoreListener = WTF.PRESENT ? goog.global["wtf"]["trace"]["ignoreListener"] : goog.nullFunction;
WTF.trace.ignoreDomTree = WTF.PRESENT ? goog.global["wtf"]["trace"]["ignoreDomTree"] : goog.nullFunction;
WTF.trace.initializeDomEventProperties = WTF.PRESENT ? goog.global["wtf"]["trace"]["initializeDomEventProperties"] : goog.nullFunction;
WTF.trace.events.createInstance = WTF.PRESENT ? goog.global["wtf"]["trace"]["events"]["createInstance"] : function(signature, opt_flags) {
  return goog.nullFunction;
};
WTF.trace.events.createScope = WTF.PRESENT ? goog.global["wtf"]["trace"]["events"]["createScope"] : function(signature, opt_flags) {
  return goog.nullFunction;
};
WTF.trace.instrument = WTF.PRESENT ? goog.global["wtf"]["trace"]["instrument"] : goog.identityFunction;
WTF.trace.instrumentType = WTF.PRESENT ? goog.global["wtf"]["trace"]["instrumentType"] : goog.identityFunction;
WTF.trace.instrumentTypeSimple = WTF.PRESENT ? goog.global["wtf"]["trace"]["instrumentTypeSimple"] : goog.nullFunction;
WTF.REPLACE_GOOG_BASE = true;
if (!COMPILED && (WTF.REPLACE_GOOG_BASE && (WTF.PRESENT && (goog.global["goog"] && goog.global["goog"]["base"])))) {
  goog.global["goog"]["base"] = function(me, opt_methodName, var_args) {
    var caller = arguments.callee.caller;
    if (caller.superClass_) {
      return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
    }
    var args = Array.prototype.slice.call(arguments, 2);
    var foundCaller = false;
    for (var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
      if (ctor.prototype[opt_methodName] === caller || ctor.prototype[opt_methodName]["uninstrumented"] === caller) {
        foundCaller = true;
      } else {
        if (foundCaller) {
          return ctor.prototype[opt_methodName].apply(me, args);
        }
      }
    }
    if (me[opt_methodName] === caller || me[opt_methodName]["uninstrumented"] === caller) {
      return me.constructor.prototype[opt_methodName].apply(me, args);
    } else {
      throw Error("goog.base called from a method of one name " + "to a method of a different name");
    }
  };
}
;goog.provide("spf.tracing");
goog.require("WTF");
goog.require("WTF.data.EventFlag");
goog.require("WTF.trace");
spf.tracing.ENABLED = SPF_TRACING;
spf.tracing.RUNTIME_DISABLED_ = window["_spf_tracing_runtime_disabled"] || false;
spf.tracing.USE_WTF_ = spf.tracing.ENABLED && (!spf.tracing.RUNTIME_DISABLED_ && WTF.PRESENT);
spf.tracing.USE_CONSOLE_ = spf.tracing.ENABLED && (!spf.tracing.RUNTIME_DISABLED_ && (!WTF.PRESENT && (!!window.console && (!!window.console.time && !!window.console.timeEnd))));
spf.tracing.nullFunction = function() {
};
spf.tracing.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
spf.tracing.initializeDomEventProperties = spf.tracing.USE_WTF_ ? WTF.trace.initializeDomEventProperties : spf.tracing.nullFunction;
spf.tracing.createInstanceEvent = spf.tracing.USE_WTF_ ? WTF.trace.events.createInstance : function(signature, opt_flags) {
  return spf.tracing.nullFunction;
};
spf.tracing.createAppendScopeDataEvent = function(signature) {
  return spf.tracing.createInstanceEvent(signature, WTF.data.EventFlag.APPEND_SCOPE_DATA);
};
spf.tracing.createScopeEvent = spf.tracing.USE_WTF_ ? WTF.trace.events.createScope : function(signature, opt_flags) {
  return spf.tracing.nullFunction;
};
spf.tracing.traceMethods = spf.tracing.USE_WTF_ ? WTF.trace.instrumentTypeSimple : spf.tracing.nullFunction;
spf.tracing.enterScope = spf.tracing.USE_WTF_ ? WTF.trace.enterScope : spf.tracing.nullFunction;
spf.tracing.leaveScope = spf.tracing.USE_WTF_ ? WTF.trace.leaveScope : spf.tracing.nullFunction;
spf.tracing.appendScopeData = spf.tracing.USE_WTF_ ? WTF.trace.appendScopeData : spf.tracing.nullFunction;
spf.tracing.markTimeline = spf.tracing.USE_WTF_ ? WTF.trace.mark : spf.tracing.nullFunction;
spf.tracing.timeStamp = spf.tracing.USE_WTF_ ? WTF.trace.timeStamp : spf.tracing.nullFunction;
spf.tracing.beginTimeRange = spf.tracing.USE_WTF_ ? WTF.trace.beginTimeRange : spf.tracing.nullFunction;
spf.tracing.endTimeRange = spf.tracing.USE_WTF_ ? WTF.trace.endTimeRange : spf.tracing.nullFunction;
spf.tracing.instrument = spf.tracing.USE_WTF_ ? WTF.trace.instrument : spf.tracing.identityFunction;
goog.provide("spf.tasks");
goog.require("spf");
goog.require("spf.state");
goog.require("spf.string");
goog.require("spf.tracing");
spf.tasks.add = function(key, fn, opt_delay) {
  var queues = spf.tasks.queues_;
  var queue = queues[key];
  if (key && fn) {
    if (!queue) {
      queue = queues[key] = spf.tasks.createQueue_();
    }
    var task = spf.tasks.createTask_(fn, opt_delay || 0);
    return queue.items.push(task);
  }
  return queue && queue.items.length || 0;
};
spf.tasks.run = function(key, opt_sync) {
  var queue = spf.tasks.queues_[key];
  if (queue) {
    var active = queue.timer > 0;
    var suspended = !(queue.semaphore > 0);
    if (!suspended && (opt_sync || !active)) {
      spf.tasks.do_(key, opt_sync);
    }
  }
};
spf.tasks.suspend = function(key) {
  var queue = spf.tasks.queues_[key];
  if (queue) {
    queue.semaphore--;
  }
};
spf.tasks.resume = function(key, opt_sync) {
  var queue = spf.tasks.queues_[key];
  if (queue) {
    queue.semaphore++;
    spf.tasks.run(key, opt_sync);
  }
};
spf.tasks.cancel = function(key) {
  var queue = spf.tasks.queues_[key];
  if (queue) {
    clearTimeout(queue.timer);
    delete spf.tasks.queues_[key];
  }
};
spf.tasks.cancelAllExcept = function(opt_keyPrefix, opt_skipKey) {
  var keyPrefix = opt_keyPrefix || "";
  for (var key in spf.tasks.queues_) {
    if (opt_skipKey != key && spf.string.startsWith(key, keyPrefix)) {
      spf.tasks.cancel(key);
    }
  }
};
spf.tasks.key = function(obj) {
  var uid = parseInt(spf.state.get(spf.state.Key.TASKS_UID), 10) || 0;
  uid++;
  return obj["spf-key"] || (obj["spf-key"] = "" + spf.state.set(spf.state.Key.TASKS_UID, uid));
};
spf.tasks.do_ = function(key, opt_sync) {
  var queue = spf.tasks.queues_[key];
  if (queue) {
    clearTimeout(queue.timer);
    queue.timer = 0;
    if (queue.semaphore > 0) {
      var task = queue.items.shift();
      if (task) {
        var next = spf.bind(spf.tasks.do_, null, key, opt_sync);
        var step = spf.bind(function(taskFn, nextFn) {
          taskFn();
          nextFn();
        }, null, task.fn, next);
        if (opt_sync) {
          step();
        } else {
          queue.timer = setTimeout(step, task.delay);
        }
      }
    }
  }
};
spf.tasks.Task;
spf.tasks.Queue;
spf.tasks.createQueue_ = function() {
  return{items:[], timer:0, semaphore:1};
};
spf.tasks.createTask_ = function(fn, delay) {
  return{fn:fn, delay:delay};
};
spf.tasks.queues_ = {};
if (spf.tracing.ENABLED) {
  (function() {
    spf.tasks.add = spf.tracing.instrument(spf.tasks.add, "spf.tasks.add");
    spf.tasks.run = spf.tracing.instrument(spf.tasks.run, "spf.tasks.run");
    spf.tasks.suspend = spf.tracing.instrument(spf.tasks.suspend, "spf.tasks.suspend");
    spf.tasks.resume = spf.tracing.instrument(spf.tasks.resume, "spf.tasks.resume");
    spf.tasks.cancel = spf.tracing.instrument(spf.tasks.cancel, "spf.tasks.cancel");
    spf.tasks.cancelAllExcept = spf.tracing.instrument(spf.tasks.cancelAllExcept, "spf.tasks.cancelAllExcept");
    spf.tasks.key = spf.tracing.instrument(spf.tasks.key, "spf.tasks.key");
    spf.tasks.do_ = spf.tracing.instrument(spf.tasks.do_, "spf.tasks.do_");
    spf.tasks.createQueue_ = spf.tracing.instrument(spf.tasks.createQueue_, "spf.tasks.createQueue_");
    spf.tasks.createTask_ = spf.tracing.instrument(spf.tasks.createTask_, "spf.tasks.createTask_");
  })();
}
;goog.provide("spf.net.resource");
goog.provide("spf.net.resource.status");
goog.provide("spf.net.resource.urls");
goog.require("spf");
goog.require("spf.array");
goog.require("spf.debug");
goog.require("spf.dom");
goog.require("spf.dom.classlist");
goog.require("spf.state");
goog.require("spf.string");
goog.require("spf.tasks");
goog.require("spf.tracing");
goog.require("spf.url");
spf.net.resource.load = function(type, urls, opt_nameOrFn, opt_fn) {
  var isJS = type == spf.net.resource.Type.JS;
  urls = spf.array.toArray(urls);
  var withName = spf.string.isString(opt_nameOrFn);
  var name = (withName ? opt_nameOrFn : "");
  var fn = (withName ? opt_fn : opt_nameOrFn);
  spf.debug.debug("resource.load", type, urls, name);
  var canonicalize = spf.bind(spf.net.resource.canonicalize, null, type);
  urls = spf.array.map(urls, canonicalize);
  var done = fn;
  if (name && !SPF_BOOTLOADER) {
    var loaded = spf.bind(spf.net.resource.status.loaded, null, type);
    var complete = spf.array.every(urls, loaded);
    var previous = spf.net.resource.urls.get(type, name);
    if (!complete && previous) {
      var evt = isJS ? spf.EventName.JS_BEFORE_UNLOAD : spf.EventName.CSS_BEFORE_UNLOAD;
      spf.dispatch(evt, {"name":name, "urls":previous});
      spf.net.resource.urls.clear(type, name);
      done = function() {
        spf.net.resource.unload_(type, name, previous);
        fn && fn();
      };
    }
  }
  var pseudonym = name || "^" + urls.sort().join("^");
  spf.net.resource.urls.set(type, pseudonym, urls);
  var topic = spf.net.resource.prefix(type, pseudonym);
  spf.debug.debug("  subscribing", topic, done);
  spf.pubsub.subscribe(topic, done);
  spf.array.each(urls, function(url) {
    if (spf.net.resource.status.get(type, url)) {
      spf.net.resource.check(type);
    } else {
      var check = spf.bind(spf.net.resource.check, null, type);
      var el = spf.net.resource.create(type, url, check);
      if (el && name) {
        el.setAttribute("name", name);
      }
    }
  });
};
spf.net.resource.unload = function(type, name) {
  spf.debug.warn("resource.unload", type, name);
  var urls = spf.net.resource.urls.get(type, name) || [];
  spf.net.resource.urls.clear(type, name);
  spf.net.resource.unload_(type, name, urls);
};
spf.net.resource.unload_ = function(type, name, urls) {
  var isJS = type == spf.net.resource.Type.JS;
  if (urls.length) {
    spf.debug.debug("  > resource.unload", type, urls);
    var evt = isJS ? spf.EventName.JS_UNLOAD : spf.EventName.CSS_UNLOAD;
    spf.dispatch(evt, {"name":name, "urls":urls});
    spf.array.each(urls, function(url) {
      spf.net.resource.destroy(type, url);
    });
  }
};
spf.net.resource.check = function(type) {
  spf.debug.debug("resource.check", type);
  var prefix = spf.net.resource.prefix(type, "");
  for (var topic in spf.pubsub.subscriptions) {
    if (topic.indexOf(prefix) == 0) {
      var names = topic.substring(prefix.length).split("|");
      var allLoaded = spf.bind(spf.net.resource.urls.loaded, null, type);
      var ready = spf.array.every(names, allLoaded);
      spf.debug.debug(" ", topic, "->", names, "=", ready);
      if (ready) {
        spf.debug.debug("  publishing", topic);
        spf.pubsub.flush(topic);
      }
    }
  }
};
spf.net.resource.create = function(type, url, opt_callback, opt_document) {
  spf.debug.debug("resource.create", type, url, "loading");
  var isJS = SPF_BOOTLOADER || type == spf.net.resource.Type.JS;
  url = spf.net.resource.canonicalize(type, url);
  spf.net.resource.status.set(type, url, spf.net.resource.State.LOADING);
  var tag = isJS ? "script" : "link";
  var doc = opt_document || document;
  var el = doc.createElement(tag);
  var next = function() {
    spf.debug.debug("resource.create", type, url, "done");
    if (spf.net.resource.status.get(type, url)) {
      spf.debug.debug("resource.create", type, url, "loaded");
      spf.net.resource.status.set(type, url, spf.net.resource.State.LOADED);
    }
    if (el && (el.parentNode && (doc == document && !SPF_DEBUG))) {
      el.parentNode.removeChild(el);
    }
    if (opt_callback) {
      setTimeout(opt_callback, 0);
    }
    return null;
  };
  if (!url) {
    return next();
  }
  var label = spf.net.resource.label(url);
  el.className = spf.net.resource.prefix(type, label);
  if ("onload" in el) {
    el.onerror = el.onload = next;
  } else {
    el.onreadystatechange = function() {
      if (/^c|loade/.test(el.readyState)) {
        next();
      }
    };
  }
  var head = doc.getElementsByTagName("head")[0];
  if (isJS) {
    el.async = true;
    el.src = url;
    head.insertBefore(el, head.firstChild);
  } else {
    el.rel = "stylesheet";
    el.href = url;
    head.appendChild(el);
  }
  return el;
};
spf.net.resource.destroy = function(type, url, opt_document) {
  url = spf.net.resource.canonicalize(type, url);
  var label = spf.net.resource.label(url);
  var cls = spf.net.resource.prefix(type, label);
  var els = spf.dom.query("." + cls, opt_document);
  spf.array.each(els, function(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  spf.net.resource.status.clear(type, url);
};
spf.net.resource.discover = function(type) {
  spf.debug.debug("resource.discover", type);
  var isJS = type == spf.net.resource.Type.JS;
  var selector = isJS ? "script[src]" : 'link[rel~="stylesheet"]';
  var els = [];
  spf.array.each(spf.dom.query(selector), function(el) {
    var url = isJS ? el.src : el.href;
    url = spf.net.resource.canonicalize(type, url);
    if (!spf.net.resource.status.get(type, url)) {
      spf.net.resource.status.set(type, url, spf.net.resource.State.LOADED);
      var label = spf.net.resource.label(url);
      var cls = spf.net.resource.prefix(type, label);
      spf.dom.classlist.add(el, cls);
      var name = el.getAttribute("name");
      if (name) {
        spf.net.resource.urls.set(type, name, [url]);
      }
      els.push(el);
      spf.debug.debug("  found", url, cls);
    }
  });
  return els;
};
spf.net.resource.prefetch = function(type, url) {
  if (!url) {
    return;
  }
  url = spf.net.resource.canonicalize(type, url);
  if (spf.net.resource.status.get(type, url)) {
    return;
  }
  var label = spf.net.resource.label(url);
  var id = spf.net.resource.prefix(type, label);
  var key = spf.net.resource.prefix(type, "prefetch");
  var el = (document.getElementById(key));
  if (!el) {
    el = spf.dom.createIframe(key, null, function(el) {
      el.title = key;
      spf.tasks.run(key, true);
    });
  } else {
    if (el.contentWindow.document.getElementById(id)) {
      return;
    }
  }
  var next = spf.bind(spf.net.resource.prefetch_, null, el, type, url, id);
  if (!el.title) {
    spf.tasks.add(key, next);
  } else {
    next();
  }
};
spf.net.resource.prefetch_ = function(el, type, url, id) {
  var isJS = type == spf.net.resource.Type.JS;
  var doc = el.contentWindow.document;
  if (isJS) {
    var fetchEl = doc.createElement("object");
    if (spf.net.resource.IS_IE) {
      var extraElForIE = doc.createElement("script");
      extraElForIE.src = url;
    } else {
      fetchEl.data = url;
    }
    fetchEl.id = id;
    doc.body.appendChild(fetchEl);
  } else {
    var fetchEl = spf.net.resource.create(type, url, null, doc);
    fetchEl.id = id;
  }
};
spf.net.resource.eval = function(type, text, name) {
  var isJS = type == spf.net.resource.Type.JS;
  var previous = spf.net.resource.urls.get(type, name);
  var id = "hash-" + spf.string.hashcode(text.replace(/\s/g, ""));
  spf.net.resource.urls.set(type, name, [id]);
  var complete = spf.net.resource.status.loaded(type, id);
  if (complete) {
    return;
  }
  var el = spf.net.resource.exec(type, text);
  if (!el) {
    return;
  }
  spf.net.resource.status.set(type, id, spf.net.resource.State.LOADED);
  if (el && (!isJS || SPF_DEBUG)) {
    var label = spf.net.resource.label(id);
    var cls = spf.net.resource.prefix(type, label);
    el.className = cls;
    el.setAttribute("name", name);
  }
  previous = previous && previous[0];
  if (previous) {
    spf.net.resource.destroy(type, previous);
  }
};
spf.net.resource.exec = function(type, text) {
  text = spf.string.trim(text);
  if (!text) {
    return null;
  }
  var isJS = type == spf.net.resource.Type.JS;
  var targetEl = document.getElementsByTagName("head")[0] || document.body;
  var el;
  if (isJS) {
    el = document.createElement("script");
    el.text = text;
    targetEl.appendChild(el);
    if (!SPF_DEBUG) {
      targetEl.removeChild(el);
    }
  } else {
    el = document.createElement("style");
    targetEl.appendChild(el);
    if ("styleSheet" in el) {
      el.styleSheet.cssText = text;
    } else {
      el.appendChild(document.createTextNode(text));
    }
  }
  return el;
};
spf.net.resource.path = function(type, paths) {
  var key = (spf.state.Key.RESOURCE_PATHS_PREFIX + type);
  spf.state.set(key, paths);
};
spf.net.resource.canonicalize = function(type, url) {
  var key = (spf.state.Key.RESOURCE_PATHS_PREFIX + type);
  if (url) {
    var index = url.indexOf("//");
    if (index < 0) {
      if (spf.string.startsWith(url, "hash-")) {
        return url;
      }
      var paths = spf.state.get(key) || "";
      if (spf.string.isString(paths)) {
        url = paths + url;
      } else {
        for (var p in paths) {
          url = url.replace(p, paths[p]);
        }
      }
      url = url.indexOf("." + type) < 0 ? url + "." + type : url;
      url = spf.url.absolute(url);
    } else {
      if (index == 0) {
        url = spf.url.absolute(url);
      }
    }
  }
  return url;
};
spf.net.resource.prefix = function(type, label) {
  return type + "-" + label;
};
spf.net.resource.label = function(url) {
  return url ? String(url).replace(/[^\w]/g, "") : "";
};
spf.net.resource.status.set = function(type, url, status) {
  var key = spf.net.resource.prefix(type, url);
  spf.net.resource.status_[key] = status;
};
spf.net.resource.status.get = function(type, url) {
  var key = spf.net.resource.prefix(type, url);
  return spf.net.resource.status_[key];
};
spf.net.resource.status.clear = function(type, url) {
  var key = spf.net.resource.prefix(type, url);
  delete spf.net.resource.status_[key];
};
spf.net.resource.status.loaded = function(type, url) {
  var status = spf.net.resource.status.get(type, url);
  return status == spf.net.resource.State.LOADED;
};
spf.net.resource.urls.set = function(type, name, urls) {
  var key = spf.net.resource.prefix(type, name);
  spf.net.resource.urls_[key] = urls;
};
spf.net.resource.urls.get = function(type, name) {
  var key = spf.net.resource.prefix(type, name);
  return spf.net.resource.urls_[key];
};
spf.net.resource.urls.clear = function(type, name) {
  var key = spf.net.resource.prefix(type, name);
  delete spf.net.resource.urls_[key];
};
spf.net.resource.urls.loaded = function(type, name) {
  var urls = spf.net.resource.urls.get(type, name);
  var loaded = spf.bind(spf.net.resource.status.loaded, null, type);
  return!name || !!urls && spf.array.every(urls, loaded);
};
spf.net.resource.status_ = {};
spf.net.resource.urls_ = {};
spf.net.resource.IS_IE = spf.string.contains(navigator.userAgent, " Trident/");
spf.net.resource.State = {LOADING:1, LOADED:2};
spf.net.resource.Type = {CSS:"css", JS:"js"};
if (SPF_BOOTLOADER) {
  spf.state.set(spf.state.Key.RESOURCE_STATUS, spf.net.resource.status_);
} else {
  if (!spf.state.has(spf.state.Key.RESOURCE_STATUS)) {
    spf.state.set(spf.state.Key.RESOURCE_STATUS, spf.net.resource.status_);
  }
  spf.net.resource.status_ = (spf.state.get(spf.state.Key.RESOURCE_STATUS));
}
if (SPF_BOOTLOADER) {
  spf.state.set(spf.state.Key.RESOURCE_URLS, spf.net.resource.urls_);
} else {
  if (!spf.state.has(spf.state.Key.RESOURCE_URLS)) {
    spf.state.set(spf.state.Key.RESOURCE_URLS, spf.net.resource.urls_);
  }
  spf.net.resource.urls_ = (spf.state.get(spf.state.Key.RESOURCE_URLS));
}
if (spf.tracing.ENABLED) {
  (function() {
    spf.net.resource.load = spf.tracing.instrument(spf.net.resource.load, "spf.net.resource.load");
    spf.net.resource.unload = spf.tracing.instrument(spf.net.resource.unload, "spf.net.resource.unload");
    spf.net.resource.unload_ = spf.tracing.instrument(spf.net.resource.unload_, "spf.net.resource.unload_");
    spf.net.resource.check = spf.tracing.instrument(spf.net.resource.check, "spf.net.resource.check");
    spf.net.resource.create = spf.tracing.instrument(spf.net.resource.create, "spf.net.resource.create");
    spf.net.resource.destroy = spf.tracing.instrument(spf.net.resource.destroy, "spf.net.resource.destroy");
    spf.net.resource.discover = spf.tracing.instrument(spf.net.resource.discover, "spf.net.resource.discover");
    spf.net.resource.prefetch = spf.tracing.instrument(spf.net.resource.prefetch, "spf.net.resource.prefetch");
    spf.net.resource.prefetch_ = spf.tracing.instrument(spf.net.resource.prefetch_, "spf.net.resource.prefetch_");
    spf.net.resource.eval = spf.tracing.instrument(spf.net.resource.eval, "spf.net.resource.eval");
    spf.net.resource.exec = spf.tracing.instrument(spf.net.resource.exec, "spf.net.resource.exec");
    spf.net.resource.path = spf.tracing.instrument(spf.net.resource.path, "spf.net.resource.path");
    spf.net.resource.canonicalize = spf.tracing.instrument(spf.net.resource.canonicalize, "spf.net.resource.canonicalize");
    spf.net.resource.prefix = spf.tracing.instrument(spf.net.resource.prefix, "spf.net.resource.prefix");
    spf.net.resource.label = spf.tracing.instrument(spf.net.resource.label, "spf.net.resource.label");
    spf.net.resource.status.set = spf.tracing.instrument(spf.net.resource.status.set, "spf.net.resource.status.set");
    spf.net.resource.status.get = spf.tracing.instrument(spf.net.resource.status.get, "spf.net.resource.status.get");
    spf.net.resource.status.clear = spf.tracing.instrument(spf.net.resource.status.clear, "spf.net.resource.status.clear");
    spf.net.resource.status.loaded = spf.tracing.instrument(spf.net.resource.status.loaded, "spf.net.resource.status.loaded");
    spf.net.resource.urls.set = spf.tracing.instrument(spf.net.resource.urls.set, "spf.net.resource.urls.set");
    spf.net.resource.urls.get = spf.tracing.instrument(spf.net.resource.urls.get, "spf.net.resource.urls.get");
    spf.net.resource.urls.clear = spf.tracing.instrument(spf.net.resource.urls.clear, "spf.net.resource.urls.clear");
    spf.net.resource.urls.loaded = spf.tracing.instrument(spf.net.resource.urls.loaded, "spf.net.resource.urls.loaded");
  })();
}
;goog.provide("spf.net.script");
goog.require("spf.array");
goog.require("spf.debug");
goog.require("spf.net.resource");
goog.require("spf.net.resource.urls");
goog.require("spf.pubsub");
goog.require("spf.state");
goog.require("spf.string");
goog.require("spf.tracing");
spf.net.script.load = function(urls, opt_nameOrFn, opt_fn) {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.load(type, urls, opt_nameOrFn, opt_fn);
};
spf.net.script.unload = function(name) {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.unload(type, name);
};
spf.net.script.discover = function() {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.discover(type);
};
spf.net.script.get = function(url, opt_fn) {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.create(type, url, opt_fn);
};
spf.net.script.prefetch = function(urls) {
  var type = spf.net.resource.Type.JS;
  urls = spf.array.toArray(urls);
  spf.array.each(urls, function(url) {
    spf.net.resource.prefetch(type, url);
  });
};
spf.net.script.ready = function(names, opt_fn, opt_require) {
  var type = spf.net.resource.Type.JS;
  names = spf.array.toArray(names);
  spf.debug.debug("script.ready", names);
  var unknown = [];
  spf.array.each(names, function(name) {
    if (name && !spf.net.resource.urls.get(type, name)) {
      unknown.push(name);
    }
  });
  var known = !unknown.length;
  if (opt_fn) {
    var depsLoaded = spf.bind(spf.net.resource.urls.loaded, null, type);
    var ready = spf.array.every(names, depsLoaded);
    if (known && ready) {
      opt_fn();
    } else {
      var topic = spf.net.resource.prefix(type, names.sort().join("|"));
      spf.debug.debug("  subscribing", topic);
      spf.pubsub.subscribe(topic, opt_fn);
    }
  }
  if (opt_require && !known) {
    opt_require(unknown);
  }
};
spf.net.script.done = function(name) {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.urls.set(type, name, []);
  spf.net.resource.check(type);
};
spf.net.script.ignore = function(names, fn) {
  var type = spf.net.resource.Type.JS;
  names = spf.array.toArray(names);
  spf.debug.debug("script.ignore", names);
  var topic = spf.net.resource.prefix(type, names.sort().join("|"));
  spf.debug.debug("  unsubscribing", topic);
  spf.pubsub.unsubscribe(topic, fn);
};
spf.net.script.require = function(names, opt_fn) {
  var type = spf.net.resource.Type.JS;
  spf.debug.debug("script.require", names);
  if (!SPF_BOOTLOADER) {
    names = spf.array.toArray(names);
    spf.array.each(names, function(name) {
      if (name) {
        var current = spf.net.script.urls_[name] || name;
        var different = spf.net.script.anyDifferent_(name, current);
        if (different) {
          spf.net.script.unrequire(name);
        }
      }
    });
  }
  spf.net.script.ready(names, opt_fn, spf.net.script.require_);
};
spf.net.script.require_ = function(names) {
  spf.array.each(names, function(name) {
    var deps = spf.net.script.deps_[name];
    var urls = spf.net.script.urls_[name] || name;
    var next = function() {
      spf.net.script.load(urls, name);
    };
    if (deps) {
      spf.net.script.require(deps, next);
    } else {
      next();
    }
  });
};
spf.net.script.unrequire = function(names) {
  spf.debug.debug("script.unrequire", names);
  names = spf.array.toArray(names);
  spf.array.each(names, function(name) {
    var descendants = [];
    for (var dep in spf.net.script.deps_) {
      var list = spf.net.script.deps_[dep];
      list = spf.array.toArray(list);
      spf.array.each(list, function(l) {
        if (l == name) {
          descendants.push(dep);
        }
      });
    }
    spf.array.each(descendants, function(descend) {
      spf.net.script.unrequire(descend);
    });
    spf.net.script.unload(name);
  });
};
spf.net.script.eval = function(text, name) {
  var type = spf.net.resource.Type.JS;
  var el = spf.net.resource.eval(type, text, name);
};
spf.net.script.exec = function(text) {
  var type = spf.net.resource.Type.JS;
  var el = spf.net.resource.exec(type, text);
};
spf.net.script.declare = function(deps, opt_urls) {
  if (deps) {
    for (var name in deps) {
      spf.net.script.deps_[name] = deps[name];
    }
    if (opt_urls) {
      for (var name in opt_urls) {
        spf.net.script.urls_[name] = opt_urls[name];
      }
    }
  }
};
spf.net.script.path = function(paths) {
  var type = spf.net.resource.Type.JS;
  spf.net.resource.path(type, paths);
};
spf.net.script.anyDifferent_ = function(name, updated) {
  var type = spf.net.resource.Type.JS;
  var urls = spf.net.resource.urls.get(type, name);
  if (urls) {
    updated = spf.array.toArray(updated);
    return!spf.array.every(urls, function(url, i) {
      return urls[i] == spf.net.resource.canonicalize(type, updated[i]);
    });
  } else {
    return false;
  }
};
spf.net.script.deps_ = {};
if (SPF_BOOTLOADER) {
  spf.state.set(spf.state.Key.SCRIPT_DEPS, spf.net.script.deps_);
} else {
  if (!spf.state.has(spf.state.Key.SCRIPT_DEPS)) {
    spf.state.set(spf.state.Key.SCRIPT_DEPS, spf.net.script.deps_);
  }
  spf.net.script.deps_ = (spf.state.get(spf.state.Key.SCRIPT_DEPS));
}
spf.net.script.urls_ = {};
if (SPF_BOOTLOADER) {
  spf.state.set(spf.state.Key.SCRIPT_URLS, spf.net.script.urls_);
} else {
  if (!spf.state.has(spf.state.Key.SCRIPT_URLS)) {
    spf.state.set(spf.state.Key.SCRIPT_URLS, spf.net.script.urls_);
  }
  spf.net.script.urls_ = (spf.state.get(spf.state.Key.SCRIPT_URLS));
}
if (spf.tracing.ENABLED) {
  (function() {
    spf.net.script.load = spf.tracing.instrument(spf.net.script.load, "spf.net.script.load");
    spf.net.script.unload = spf.tracing.instrument(spf.net.script.unload, "spf.net.script.unload");
    spf.net.script.discover = spf.tracing.instrument(spf.net.script.discover, "spf.net.script.discover");
    spf.net.script.get = spf.tracing.instrument(spf.net.script.get, "spf.net.script.get");
    spf.net.script.prefetch = spf.tracing.instrument(spf.net.script.prefetch, "spf.net.script.prefetch");
    spf.net.script.ready = spf.tracing.instrument(spf.net.script.ready, "spf.net.script.ready");
    spf.net.script.done = spf.tracing.instrument(spf.net.script.done, "spf.net.script.done");
    spf.net.script.ignore = spf.tracing.instrument(spf.net.script.ignore, "spf.net.script.ignore");
    spf.net.script.require = spf.tracing.instrument(spf.net.script.require, "spf.net.script.require");
    spf.net.script.require_ = spf.tracing.instrument(spf.net.script.require_, "spf.net.script.require_");
    spf.net.script.unrequire = spf.tracing.instrument(spf.net.script.unrequire, "spf.net.script.unrequire");
    spf.net.script.eval = spf.tracing.instrument(spf.net.script.eval, "spf.net.script.eval");
    spf.net.script.declare = spf.tracing.instrument(spf.net.script.declare, "spf.net.script.declare");
    spf.net.script.path = spf.tracing.instrument(spf.net.script.path, "spf.net.script.path");
    spf.net.script.anyDifferent_ = spf.tracing.instrument(spf.net.script.anyDifferent_, "spf.net.script.anyDifferent_");
  })();
}
;goog.provide("spf.net.style");
goog.require("spf.array");
goog.require("spf.net.resource");
goog.require("spf.string");
goog.require("spf.tracing");
spf.net.style.load = function(urls, opt_nameOrFn, opt_fn) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.load(type, urls, opt_nameOrFn, opt_fn);
};
spf.net.style.unload = function(name) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.unload(type, name);
};
spf.net.style.discover = function() {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.discover(type);
};
spf.net.style.get = function(url, opt_fn) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.create(type, url, opt_fn);
};
spf.net.style.prefetch = function(urls) {
  var type = spf.net.resource.Type.CSS;
  urls = spf.array.toArray(urls);
  spf.array.each(urls, function(url) {
    spf.net.resource.prefetch(type, url);
  });
};
spf.net.style.eval = function(text, name) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.eval(type, text, name);
};
spf.net.style.exec = function(text) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.exec(type, text);
};
spf.net.style.path = function(paths) {
  var type = spf.net.resource.Type.CSS;
  spf.net.resource.path(type, paths);
};
if (spf.tracing.ENABLED) {
  (function() {
    spf.net.style.load = spf.tracing.instrument(spf.net.style.load, "spf.net.style.load");
    spf.net.style.unload = spf.tracing.instrument(spf.net.style.unload, "spf.net.style.unload");
    spf.net.style.discover = spf.tracing.instrument(spf.net.style.discover, "spf.net.style.discover");
    spf.net.style.get = spf.tracing.instrument(spf.net.style.get, "spf.net.style.get");
    spf.net.style.prefetch = spf.tracing.instrument(spf.net.style.prefetch, "spf.net.style.prefetch");
    spf.net.style.eval = spf.tracing.instrument(spf.net.style.eval, "spf.net.style.eval");
    spf.net.style.path = spf.tracing.instrument(spf.net.style.path, "spf.net.style.path");
  })();
}
;goog.provide("spf.nav.response");
goog.require("spf");
goog.require("spf.array");
goog.require("spf.config");
goog.require("spf.debug");
goog.require("spf.dom");
goog.require("spf.dom.classlist");
goog.require("spf.history");
goog.require("spf.net.script");
goog.require("spf.net.style");
goog.require("spf.string");
goog.require("spf.tasks");
goog.require("spf.tracing");
goog.require("spf.url");
spf.nav.response.parse = function(text, opt_multipart, opt_lastDitch) {
  if (opt_multipart) {
    var beginToken = spf.nav.response.Token.BEGIN;
    var delimToken = spf.nav.response.Token.DELIMITER;
    var endToken = spf.nav.response.Token.END;
    var lastDitchHalfToken = "\r\n";
    var parts = [];
    var chunk;
    var start = 0;
    if (opt_lastDitch) {
      text += lastDitchHalfToken;
    }
    var finish = text.indexOf(beginToken, start);
    if (finish > -1) {
      start = finish + beginToken.length;
    }
    while ((finish = text.indexOf(delimToken, start)) > -1) {
      chunk = spf.string.trim(text.substring(start, finish));
      start = finish + delimToken.length;
      if (chunk) {
        parts.push(JSON.parse(chunk));
      }
    }
    finish = text.indexOf(endToken, start);
    if (finish > -1) {
      chunk = spf.string.trim(text.substring(start, finish));
      start = finish + endToken.length;
      if (chunk) {
        parts.push(JSON.parse(chunk));
      }
    }
    var extra = "";
    if (text.length > start) {
      extra = text.substring(start);
      if (opt_lastDitch && spf.string.endsWith(extra, lastDitchHalfToken)) {
        extra = extra.substring(0, extra.length - lastDitchHalfToken.length);
      }
    }
    return{parts:(parts), extra:extra};
  } else {
    var response = JSON.parse(text);
    var parts;
    if (typeof response.length == "number") {
      parts = response;
    } else {
      parts = [response];
    }
    return{parts:(parts), extra:""};
  }
};
spf.nav.response.process = function(url, response, opt_callback, opt_navigate, opt_reverse) {
  spf.debug.info("nav.response.process ", response, opt_reverse);
  var key = "process " + spf.url.absolute(url);
  var sync = !spf.config.get("experimental-process-async");
  var fn;
  var num = 0;
  if (!response["timing"]) {
    response["timing"] = {};
  }
  if (response["title"]) {
    document.title = response["title"];
  }
  if (opt_navigate && response["url"]) {
    var fullUrl = spf.url.absolute(response["url"]);
    if (fullUrl != spf.nav.response.getCurrentUrl_()) {
      spf.debug.debug("  update history with response url");
      spf.history.replace(response["url"] + window.location.hash, null, false, true);
    }
  }
  if (response["head"]) {
    fn = spf.bind(function(head, timing) {
      if (spf.config.get("experimental-extract-unified")) {
        var extracted = spf.nav.response.extract_(head);
        spf.nav.response.installStyles_(extracted);
        spf.debug.debug("    head css");
        spf.tasks.suspend(key);
        spf.nav.response.installScripts_(extracted, function() {
          timing["spfProcessHead"] = spf.now();
          spf.debug.debug("    head js");
          spf.tasks.resume(key, sync);
          spf.debug.debug("  process task done: head");
        });
      } else {
        spf.nav.response.installStyles_(spf.nav.response.parseStyles_(head));
        timing["spfProcessHead"] = spf.now();
        spf.debug.debug("  process task done: head");
      }
    }, null, response["head"], response["timing"]);
    num = spf.tasks.add(key, fn);
    spf.debug.debug("  process task queued: head", num);
  }
  if (response["attr"]) {
    fn = spf.bind(function(attrs, timing) {
      for (var id in attrs) {
        var el = document.getElementById(id);
        if (el) {
          spf.dom.setAttributes(el, attrs[id]);
          spf.debug.debug("    attr set", id);
        }
      }
      timing["spfProcessAttr"] = spf.now();
      spf.debug.debug("  process task done: attr");
    }, null, response["attr"], response["timing"]);
    num = spf.tasks.add(key, fn);
    spf.debug.debug("  process task queued: attr", num);
  }
  var fragments = response["body"] || {};
  var numBeforeFragments = num;
  for (var id in fragments) {
    fn = spf.bind(function(id, body, timing) {
      var el = document.getElementById(id);
      if (el) {
        var extracted = spf.config.get("experimental-extract-unified") ? spf.nav.response.extract_(body) : spf.nav.response.parseScripts_(body);
        var animationClass = (spf.config.get("animation-class"));
        var noAnimation = !spf.nav.response.CAN_ANIMATE_ || !spf.dom.classlist.contains(el, animationClass);
        spf.dispatch("spfbeforerender", {"id":id});
        if (noAnimation) {
          if (spf.config.get("experimental-extract-unified")) {
            spf.nav.response.installStyles_((extracted));
          }
          el.innerHTML = extracted.html;
          spf.debug.debug("    body update", id);
          spf.tasks.suspend(key);
          spf.nav.response.installScripts_(extracted, function() {
            spf.debug.debug("    body js", id);
            spf.tasks.resume(key, sync);
            spf.debug.debug("  process task done: body", id);
          });
        } else {
          spf.tasks.suspend(key);
          var animationKey = spf.tasks.key(el);
          spf.tasks.run(animationKey, true);
          var animationFn;
          var animationData = {extracted:extracted, reverse:!!opt_reverse, currentEl:null, pendingEl:null, parentEl:el, currentClass:animationClass + "-old", pendingClass:animationClass + "-new", startClass:!!opt_reverse ? animationClass + "-reverse-start" : animationClass + "-forward-start", endClass:!!opt_reverse ? animationClass + "-reverse-end" : animationClass + "-forward-end"};
          animationFn = spf.bind(function(data) {
            if (spf.config.get("experimental-extract-unified")) {
              spf.nav.response.installStyles_(data.extracted);
            }
            spf.dom.classlist.add(data.parentEl, data.startClass);
            data.currentEl = document.createElement("div");
            data.currentEl.className = data.currentClass;
            spf.dom.inflateElement(data.parentEl, data.currentEl);
            data.pendingEl = document.createElement("div");
            data.pendingEl.className = data.pendingClass;
            data.pendingEl.innerHTML = data.extracted.html;
            if (data.reverse) {
              spf.dom.insertSiblingBefore(data.pendingEl, data.currentEl);
            } else {
              spf.dom.insertSiblingAfter(data.pendingEl, data.currentEl);
            }
            spf.debug.debug("  process anim done: add new", data.parentEl.id);
          }, null, animationData);
          spf.tasks.add(animationKey, animationFn, 0);
          spf.debug.debug("  process anim queued: add new", id);
          animationFn = spf.bind(function(data) {
            spf.dom.classlist.remove(data.parentEl, data.startClass);
            spf.dom.classlist.add(data.parentEl, data.endClass);
            spf.debug.debug("  process anim done: swap", data.parentEl.id);
          }, null, animationData);
          spf.tasks.add(animationKey, animationFn, 0);
          spf.debug.debug("  process anim queued: swap", id);
          animationFn = spf.bind(function(data) {
            data.parentEl.removeChild(data.currentEl);
            spf.dom.classlist.remove(data.parentEl, data.endClass);
            spf.dom.flattenElement(data.pendingEl);
            spf.debug.debug("    body update", data.parentEl.id);
            spf.tasks.suspend(animationKey);
            spf.nav.response.installScripts_(data.extracted, function() {
              spf.debug.debug("    body js", data.parentEl.id);
              spf.tasks.resume(animationKey);
              spf.debug.debug("  process anim done: del old", data.parentEl.id);
            });
          }, null, animationData);
          spf.tasks.add(animationKey, animationFn, parseInt(spf.config.get("animation-duration"), 10));
          spf.debug.debug("  process anim queued: del old", id);
          animationFn = spf.bind(function(data, key) {
            spf.debug.debug("  process anim done: complete", data.parentEl.id);
            spf.tasks.resume(key);
            spf.debug.debug("  process task done: body ", data.parentEl.id);
          }, null, animationData, key);
          spf.tasks.add(animationKey, animationFn);
          spf.debug.debug("  process anim queued: complete", id);
          spf.tasks.run(animationKey);
        }
      }
    }, null, id, fragments[id], response["timing"]);
    num = spf.tasks.add(key, fn);
    spf.debug.debug("  process task queued: body", id, num);
  }
  var numAfterFragments = num;
  var numFragments = numAfterFragments - numBeforeFragments;
  if (response["foot"]) {
    fn = spf.bind(function(foot, timing, numFragments) {
      if (numFragments) {
        timing["spfProcessBody"] = spf.now();
      }
      if (spf.config.get("experimental-extract-unified")) {
        var extracted = spf.nav.response.extract_(foot);
        spf.nav.response.installStyles_(extracted);
        spf.debug.debug("    foot css");
        spf.tasks.suspend(key);
        spf.nav.response.installScripts_(extracted, function() {
          timing["spfProcessFoot"] = spf.now();
          spf.debug.debug("    foot js");
          spf.tasks.resume(key, sync);
          spf.debug.debug("  process task done: foot");
        });
      } else {
        spf.tasks.suspend(key);
        spf.nav.response.installScripts_(spf.nav.response.parseScripts_(foot), function() {
          timing["spfProcessFoot"] = spf.now();
          spf.debug.debug("  process task done: foot");
          spf.tasks.resume(key, sync);
        });
      }
    }, null, response["foot"], response["timing"], numFragments);
    num = spf.tasks.add(key, fn);
    spf.debug.debug("  process task queued: foot", num);
  } else {
    if (numFragments) {
      fn = spf.bind(function(timing) {
        timing["spfProcessBody"] = spf.now();
        spf.debug.debug("  process task done: timing-for-body");
      }, null, response["timing"]);
      num = spf.tasks.add(key, fn);
      spf.debug.debug("  process task queued: timing-for-body", num);
    }
  }
  if (opt_callback) {
    num = spf.tasks.add(key, spf.bind(opt_callback, null, url, response));
    spf.debug.debug("  process task queued: callback", num);
  }
  spf.tasks.run(key, sync);
};
spf.nav.response.preprocess = function(url, response, opt_callback) {
  spf.debug.info("nav.response.preprocess ", response);
  var key = "preprocess " + spf.url.absolute(url);
  var fn;
  if (response["head"]) {
    fn = spf.bind(function(head) {
      if (spf.config.get("experimental-extract-unified")) {
        var extracted = spf.nav.response.extract_(head);
        spf.nav.response.preinstallStyles_(extracted);
        spf.nav.response.preinstallScripts_(extracted);
      } else {
        spf.nav.response.preinstallStyles_(spf.nav.response.parseStyles_(head));
      }
      spf.debug.debug("  preprocess task done: head");
    }, null, response["head"]);
    spf.tasks.add(key, fn);
    spf.debug.debug("  preprocess task queued: head");
  }
  var fragments = response["body"] || {};
  for (var id in fragments) {
    if (fragments[id]) {
      fn = spf.bind(function(id, body) {
        if (spf.config.get("experimental-extract-unified")) {
          var extracted = spf.nav.response.extract_(body);
          spf.nav.response.preinstallStyles_(extracted);
          spf.nav.response.preinstallScripts_(extracted);
        } else {
          spf.nav.response.preinstallScripts_(spf.nav.response.parseScripts_(body));
        }
        spf.debug.debug("    body js", id);
        spf.debug.debug("  preprocess task done: body", id);
      }, null, id, fragments[id]);
      spf.tasks.add(key, fn);
      spf.debug.debug("  preprocess task queued: body", id);
    }
  }
  if (response["foot"]) {
    fn = spf.bind(function(foot) {
      if (spf.config.get("experimental-extract-unified")) {
        var extracted = spf.nav.response.extract_(foot);
        spf.nav.response.preinstallStyles_(extracted);
        spf.nav.response.preinstallScripts_(extracted);
      } else {
        spf.nav.response.preinstallScripts_(spf.nav.response.parseScripts_(foot));
      }
      spf.debug.debug("  preprocess task done: foot");
    }, null, response["foot"]);
    spf.tasks.add(key, fn);
    spf.debug.debug("  preprocess task queued: foot");
  }
  if (opt_callback) {
    spf.tasks.add(key, spf.bind(opt_callback, null, url, response));
    spf.debug.debug("  preprocess task queued: callback");
  }
  spf.tasks.run(key);
};
spf.nav.response.extract_ = function(html) {
  var result = new spf.nav.response.Extraction_;
  if (!html) {
    return result;
  }
  if (!spf.string.isString(html)) {
    if (html["scripts"]) {
      spf.array.each(html["scripts"], function(script) {
        result.scripts.push({url:script["url"] || "", text:script["text"] || "", name:script["name"] || "", async:script["async"] || false});
      });
    }
    if (html["styles"]) {
      spf.array.each(html["styles"], function(style) {
        result.styles.push({url:style["url"] || "", text:style["text"] || "", name:style["name"] || ""});
      });
    }
    result.html = html["html"] || "";
    return result;
  }
  html = html.replace(spf.nav.response.ElementRegEx.SCRIPT_STYLE, function(full, tag, attr, text) {
    if (tag == "script") {
      var name = attr.match(spf.nav.response.AttributeRegEx.NAME);
      name = name ? name[1] : "";
      var url = attr.match(spf.nav.response.AttributeRegEx.SRC);
      url = url ? url[1] : "";
      var async = spf.nav.response.AttributeRegEx.ASYNC.test(attr);
      result.scripts.push({url:url, text:text, name:name, async:async});
      return "";
    }
    if (tag == "style") {
      var name = attr.match(spf.nav.response.AttributeRegEx.NAME);
      name = name ? name[1] : "";
      result.styles.push({url:"", text:text, name:name});
      return "";
    }
    return full;
  });
  html = html.replace(spf.nav.response.ElementRegEx.LINK, function(full, attr) {
    var rel = attr.match(spf.nav.response.AttributeRegEx.REL);
    rel = rel ? rel[1] : "";
    if (rel == "stylesheet") {
      var name = attr.match(spf.nav.response.AttributeRegEx.NAME);
      name = name ? name[1] : "";
      var url = attr.match(spf.nav.response.AttributeRegEx.HREF);
      url = url ? url[1] : "";
      result.styles.push({url:url, text:"", name:name});
      return "";
    } else {
      return full;
    }
  });
  result.html = html;
  return result;
};
spf.nav.response.parseScripts_ = function(html) {
  var result = new spf.nav.response.ParseScriptsResult_;
  if (!html) {
    return result;
  }
  if (!spf.string.isString(html)) {
    if (html["scripts"]) {
      spf.array.each(html["scripts"], function(script) {
        result.scripts.push({url:script["url"] || "", text:script["text"] || "", name:script["name"] || "", async:script["async"] || false});
      });
    }
    result.html = html["html"] || "";
    return result;
  }
  html = html.replace(spf.nav.response.SCRIPT_TAG_REGEXP, function(fullMatch, attr, text) {
    var url = attr.match(spf.nav.response.SRC_ATTR_REGEXP);
    url = url ? url[1] : "";
    var name = attr.match(spf.nav.response.NAME_ATTR_REGEXP);
    name = name ? name[1] : "";
    var async = spf.nav.response.ASYNC_ATTR_REGEXP.test(attr);
    result.scripts.push({url:url, text:text, name:name, async:async});
    return "";
  });
  result.html = html;
  return result;
};
spf.nav.response.installScripts_ = function(result, opt_callback) {
  if (result.scripts.length <= 0) {
    opt_callback && opt_callback();
    return;
  }
  var index = -1;
  var next = function() {
    index++;
    if (index < result.scripts.length) {
      var item = result.scripts[index];
      var fn = function() {
      };
      if (item.url) {
        if (spf.config.get("experimental-execute-unified")) {
          if (item.name) {
            fn = spf.bind(spf.net.script.load, null, item.url, item.name);
          } else {
            fn = spf.bind(spf.net.script.get, null, item.url);
          }
        } else {
          fn = spf.bind(spf.net.script.load, null, item.url, item.name);
        }
      } else {
        if (item.text) {
          if (spf.config.get("experimental-execute-unified")) {
            if (item.name) {
              fn = spf.bind(spf.net.script.eval, null, item.text, item.name);
            } else {
              fn = spf.bind(spf.net.script.exec, null, item.text);
            }
          } else {
            fn = spf.bind(spf.net.script.exec, null, item.text);
          }
        }
      }
      if (item.url && !item.async) {
        fn(next);
      } else {
        fn();
        next();
      }
    } else {
      opt_callback && opt_callback();
    }
  };
  next();
};
spf.nav.response.preinstallScripts_ = function(result) {
  if (result.scripts.length <= 0) {
    return;
  }
  var urls = spf.array.map(result.scripts, function(item) {
    return item.url;
  });
  spf.net.script.prefetch(urls);
};
spf.nav.response.parseStyles_ = function(html) {
  var result = new spf.nav.response.ParseStylesResult_;
  if (!html) {
    return result;
  }
  if (!spf.string.isString(html)) {
    if (html["styles"]) {
      spf.array.each(html["styles"], function(style) {
        result.styles.push({url:style["url"] || "", text:style["text"] || "", name:style["name"] || ""});
      });
    }
    result.html = html["html"] || "";
    return result;
  }
  html = html.replace(spf.nav.response.LINK_TAG_REGEXP, function(fullMatch, attr) {
    var isStyleSheet = spf.string.contains(attr, 'rel="stylesheet"');
    if (isStyleSheet) {
      var url = attr.match(spf.nav.response.HREF_ATTR_REGEXP);
      url = url ? url[1] : "";
      var name = attr.match(spf.nav.response.NAME_ATTR_REGEXP);
      name = name ? name[1] : "";
      result.styles.push({url:url, text:"", name:name});
      return "";
    } else {
      return fullMatch;
    }
  });
  html = html.replace(spf.nav.response.STYLE_TAG_REGEXP, function(fullMatch, attr, text) {
    result.styles.push({url:"", text:text, name:""});
    return "";
  });
  result.html = html;
  return result;
};
spf.nav.response.installStyles_ = function(result) {
  if (result.styles.length <= 0) {
    return;
  }
  for (var i = 0, l = result.styles.length;i < l;i++) {
    var item = result.styles[i];
    if (item.url) {
      if (spf.config.get("experimental-execute-unified")) {
        if (item.name) {
          spf.net.style.load(item.url, item.name);
        } else {
          spf.net.style.get(item.url);
        }
      } else {
        spf.net.style.load(item.url, item.name);
      }
    } else {
      if (item.text) {
        if (spf.config.get("experimental-execute-unified")) {
          if (item.name) {
            spf.net.style.eval(item.text, item.name);
          } else {
            spf.net.style.exec(item.text);
          }
        } else {
          spf.net.style.exec(item.text);
        }
      }
    }
  }
};
spf.nav.response.preinstallStyles_ = function(result) {
  if (result.styles.length <= 0) {
    return;
  }
  var urls = spf.array.map(result.styles, function(item) {
    return item.url;
  });
  spf.net.style.prefetch(urls);
};
spf.nav.response.getCurrentUrl_ = function() {
  return spf.url.absolute(window.location.href);
};
spf.nav.response.ParseStylesResult_ = function() {
  this.html = "";
  this.styles = [];
};
spf.nav.response.ParseScriptsResult_ = function() {
  this.html = "";
  this.scripts = [];
};
spf.nav.response.Extraction_ = function() {
  this.html = "";
  this.scripts = [];
  this.styles = [];
};
spf.nav.response.TemporaryParseScriptsResultType;
spf.nav.response.TemporaryParseStylesResultType;
spf.nav.response.CAN_ANIMATE_ = function() {
  var testEl = document.createElement("div");
  if ("transition" in testEl.style) {
    return true;
  }
  var prefixes = ["webkit", "Moz", "Ms", "O", "Khtml"];
  for (var i = 0, l = prefixes.length;i < l;i++) {
    if (prefixes[i] + "Transition" in testEl.style) {
      return true;
    }
  }
  return false;
}();
spf.nav.response.SCRIPT_TAG_REGEXP = /\x3cscript([\s\S]*?)\x3e([\s\S]*?)\x3c\/script\x3e/ig;
spf.nav.response.STYLE_TAG_REGEXP = /\x3cstyle([\s\S]*?)\x3e([\s\S]*?)\x3c\/style\x3e/ig;
spf.nav.response.LINK_TAG_REGEXP = /\x3clink([\s\S]*?)\x3e/ig;
spf.nav.response.CLASS_ATTR_REGEXP = /class="([\S]+)"/;
spf.nav.response.HREF_ATTR_REGEXP = /href="([\S]+)"/;
spf.nav.response.SRC_ATTR_REGEXP = /src="([\S]+)"/;
spf.nav.response.NAME_ATTR_REGEXP = /name="([\S]+)"/;
spf.nav.response.ASYNC_ATTR_REGEXP = /(?:\s|^)async(?:\s|=|$)/i;
spf.nav.response.ElementRegEx = {LINK:/\x3clink([\s\S]*?)\x3e/ig, SCRIPT_STYLE:/\x3c(script|style)([\s\S]*?)\x3e([\s\S]*?)\x3c\/\1\x3e/ig};
spf.nav.response.AttributeRegEx = {ASYNC:/(?:\s|^)async(?:\s|=|$)/i, HREF:/(?:\s|^)href\s*=\s*["']?([^\s"']+)/i, NAME:/(?:\s|^)name\s*=\s*["']?([^\s"']+)/i, REL:/(?:\s|^)rel\s*=\s*["']?([^\s"']+)/i, SRC:/(?:\s|^)src\s*=\s*["']?([^\s"']+)/i};
spf.nav.response.Token = {BEGIN:"[\r\n", DELIMITER:",\r\n", END:"]\r\n"};
if (spf.tracing.ENABLED) {
  (function() {
    spf.nav.response.parse = spf.tracing.instrument(spf.nav.response.parse, "spf.nav.response.parse");
    spf.nav.response.process = spf.tracing.instrument(spf.nav.response.process, "spf.nav.response.process");
    spf.nav.response.preprocess = spf.tracing.instrument(spf.nav.response.preprocess, "spf.nav.response.preprocess");
    spf.nav.response.extract_ = spf.tracing.instrument(spf.nav.response.extract_, "spf.nav.response.extract_");
    spf.nav.response.parseScripts_ = spf.tracing.instrument(spf.nav.response.parseScripts_, "spf.nav.response.parseScripts_");
    spf.nav.response.installScripts_ = spf.tracing.instrument(spf.nav.response.installScripts_, "spf.nav.response.installScripts_");
    spf.nav.response.preinstallScripts_ = spf.tracing.instrument(spf.nav.response.preinstallScripts_, "spf.nav.response.preinstallScripts_");
    spf.nav.response.parseStyles_ = spf.tracing.instrument(spf.nav.response.parseStyles_, "spf.nav.response.parseStyles_");
    spf.nav.response.installStyles_ = spf.tracing.instrument(spf.nav.response.installStyles_, "spf.nav.response.installStyles_");
    spf.nav.response.preinstallStyles_ = spf.tracing.instrument(spf.nav.response.preinstallStyles_, "spf.nav.response.preinstallStyles_");
  })();
}
;goog.provide("spf.nav.request");
goog.require("spf");
goog.require("spf.cache");
goog.require("spf.config");
goog.require("spf.debug");
goog.require("spf.nav.response");
goog.require("spf.net.xhr");
goog.require("spf.string");
goog.require("spf.tracing");
goog.require("spf.url");
spf.nav.request.Options;
spf.nav.request.send = function(url, opt_options) {
  spf.debug.debug("nav.request.send ", url, opt_options);
  var options = opt_options || ({});
  options.method = ((options.method || "GET") + "").toUpperCase();
  options.type = options.type || "request";
  var requestUrl = spf.url.absolute(spf.url.identify(url, options.type));
  spf.debug.debug("    request url ", requestUrl);
  var timing = {};
  timing["spfUrl"] = requestUrl;
  timing["startTime"] = spf.now();
  timing["fetchStart"] = timing["startTime"];
  var cacheKey = spf.nav.request.getCacheKey_(url, options.current, null, options.type, false);
  var cached = spf.nav.request.getCacheObject_(cacheKey, options.current);
  timing["spfPrefetched"] = !!cached && cached.type == "prefetch";
  timing["spfCached"] = !!cached;
  if (cached) {
    var response = (cached.response);
    var handleCache = spf.bind(spf.nav.request.handleResponseFromCache_, null, url, options, timing, cached.key, response);
    setTimeout(handleCache, 0);
    return null;
  } else {
    spf.debug.debug("    sending XHR");
    var headers = {};
    if (options.referer != undefined) {
      headers["X-SPF-Referer"] = options.referer;
    }
    if (options.current) {
      headers["X-SPF-Previous"] = options.current;
    }
    headers["x-requested-with"] = "XMLHttpRequest";
    var chunking = {multipart:false, extra:"", complete:[]};
    var handleHeaders = spf.bind(spf.nav.request.handleHeadersFromXHR_, null, url, chunking);
    var handleChunk = spf.bind(spf.nav.request.handleChunkFromXHR_, null, url, options, chunking);
    var handleComplete = spf.bind(spf.nav.request.handleCompleteFromXHR_, null, url, options, timing, chunking);
    var xhrOpts = {headers:headers, timeoutMs:(spf.config.get("request-timeout")), onHeaders:handleHeaders, onChunk:handleChunk, onDone:handleComplete, onTimeout:handleComplete};
    var xhr;
    if (options.method == "POST") {
      xhr = spf.net.xhr.post(requestUrl, options.postData, xhrOpts);
    } else {
      xhr = spf.net.xhr.get(requestUrl, xhrOpts);
    }
    return xhr;
  }
};
spf.nav.request.handleResponseFromCache_ = function(url, options, timing, cacheKey, response) {
  spf.debug.debug("nav.request.handleResponseFromCache_ ", url, response);
  var updateCache = false;
  timing["responseStart"] = timing["responseEnd"] = spf.now();
  if (options.type && spf.string.startsWith(options.type, "navigate")) {
    timing["navigationStart"] = timing["startTime"];
    if (!spf.config.get("cache-unified")) {
      spf.cache.remove(cacheKey);
      updateCache = true;
    }
  }
  if (options.onPart && response["type"] == "multipart") {
    var parts = response["parts"];
    for (var i = 0;i < parts.length;i++) {
      options.onPart(url, parts[i]);
    }
  }
  spf.nav.request.done_(url, options, timing, response, updateCache);
};
spf.nav.request.handleHeadersFromXHR_ = function(url, chunking, xhr) {
  spf.debug.debug("nav.request.handleHeadersFromXHR_ ", url, xhr);
  var responseType = xhr.getResponseHeader("X-SPF-Response-Type") || "";
  var multipart = spf.string.contains(responseType.toLowerCase(), "multipart");
  spf.debug.debug("    response is", (multipart ? "" : "non-") + "multipart");
  chunking.multipart = multipart;
};
spf.nav.request.handleChunkFromXHR_ = function(url, options, chunking, xhr, chunk, opt_lastDitch) {
  spf.debug.debug("nav.request.handleChunkFromXHR_ ", url, {"extra":chunking.extra, "chunk":chunk});
  if (!chunking.multipart) {
    spf.debug.debug("    skipping non-multipart response");
    return;
  }
  var text = chunking.extra + chunk;
  var parsed;
  try {
    parsed = spf.nav.response.parse(text, true, opt_lastDitch);
  } catch (err) {
    spf.debug.debug("    JSON parse failed", text);
    xhr.abort();
    if (options.onError) {
      options.onError(url, err);
    }
    return;
  }
  if (options.onPart) {
    for (var i = 0;i < parsed.parts.length;i++) {
      spf.debug.debug("    parsed part", parsed.parts[i]);
      options.onPart(url, parsed.parts[i]);
    }
  }
  chunking.complete = chunking.complete.concat(parsed.parts);
  chunking.extra = parsed.extra;
};
spf.nav.request.handleCompleteFromXHR_ = function(url, options, timing, chunking, xhr) {
  spf.debug.debug("nav.request.handleCompleteFromXHR_ ", url, {"extra":chunking.extra, "complete":xhr.responseText});
  if (xhr["timing"]) {
    for (var t in xhr["timing"]) {
      timing[t] = xhr["timing"][t];
    }
  }
  if (xhr["resourceTiming"]) {
    if (options.type == "load") {
      for (var key in xhr["resourceTiming"]) {
        timing[key] = xhr["resourceTiming"][key];
      }
    } else {
      if (window.performance && window.performance.timing) {
        var navigationStart = window.performance.timing.navigationStart;
        for (var metric in xhr["resourceTiming"]) {
          var value = xhr["resourceTiming"][metric];
          if (value !== undefined && (spf.string.endsWith(metric, "Start") || (spf.string.endsWith(metric, "End") || metric == "startTime"))) {
            timing[metric] = navigationStart + Math.round(value);
          }
        }
      }
    }
  }
  if (options.type != "load") {
    timing["navigationStart"] = timing["startTime"];
  }
  if (chunking.complete.length) {
    chunking.extra = spf.string.trim(chunking.extra);
    if (chunking.extra) {
      spf.nav.request.handleChunkFromXHR_(url, options, chunking, xhr, "", true);
    }
  }
  var parts;
  try {
    var parsed = spf.nav.response.parse(xhr.responseText);
    parts = parsed.parts;
  } catch (err) {
    spf.debug.debug("    JSON parse failed");
    if (options.onError) {
      options.onError(url, err);
    }
    return;
  }
  if (options.onPart && parts.length > 1) {
    for (var i = chunking.complete.length;i < parts.length;i++) {
      spf.debug.debug("    parsed part", parts[i]);
      options.onPart(url, parts[i]);
    }
  }
  var response;
  if (parts.length > 1) {
    var cacheType;
    for (var i = 0, l = parts.length;i < l;i++) {
      var part = parts[i];
      if (part["cacheType"]) {
        cacheType = part["cacheType"];
      }
    }
    response = ({"parts":parts, "type":"multipart"});
    if (cacheType) {
      response["cacheType"] = cacheType;
    }
  } else {
    if (parts.length == 1) {
      response = (parts[0]);
    } else {
      response = ({});
    }
  }
  spf.nav.request.done_(url, options, timing, response, true);
};
spf.nav.request.done_ = function(url, options, timing, response, cache) {
  spf.debug.debug("nav.request.done_", url, options, timing, response, cache);
  if (cache && options.method != "POST") {
    var cacheKey = spf.nav.request.getCacheKey_(url, options.current, response["cacheType"], options.type, true);
    if (cacheKey) {
      spf.nav.request.setCacheObject_(cacheKey, response, options.type || "");
    }
  }
  response["timing"] = timing;
  if (options.onSuccess) {
    options.onSuccess(url, response);
  }
};
spf.nav.request.getCacheKey_ = function(url, opt_current, opt_cacheType, opt_requestType, opt_set) {
  var absoluteUrl = spf.url.absolute(url);
  var cacheKey;
  if (spf.config.get("cache-unified")) {
    cacheKey = absoluteUrl;
  } else {
    if (opt_requestType == "navigate-back" || opt_requestType == "navigate-forward") {
      cacheKey = "history " + absoluteUrl;
    } else {
      if (opt_requestType == "navigate") {
        cacheKey = (opt_set ? "history " : "prefetch ") + absoluteUrl;
      } else {
        if (opt_requestType == "prefetch") {
          cacheKey = opt_set ? "prefetch " + absoluteUrl : "";
        }
      }
    }
  }
  if (opt_current && opt_cacheType == "url") {
    cacheKey += " previous " + opt_current;
  } else {
    if (opt_current && opt_cacheType == "path") {
      cacheKey += " previous " + spf.url.path(opt_current);
    }
  }
  return cacheKey || "";
};
spf.nav.request.getCacheObject_ = function(cacheKey, opt_current) {
  var keys = [];
  if (opt_current) {
    keys.push(cacheKey + " previous " + opt_current);
    keys.push(cacheKey + " previous " + spf.url.path(opt_current));
  }
  keys.push(cacheKey);
  for (var i = 0, l = keys.length;i < l;i++) {
    var cached = spf.cache.get(keys[i]);
    if (cached) {
      return{key:keys[i], response:cached["response"], type:cached["type"]};
    }
  }
  return null;
};
spf.nav.request.setCacheObject_ = function(cacheKey, response, type) {
  var cacheValue = {"response":response, "type":type};
  spf.cache.set(cacheKey, cacheValue, (spf.config.get("cache-lifetime")));
};
if (spf.tracing.ENABLED) {
  (function() {
    var request = spf.nav.request;
    request.send = spf.tracing.instrument(request.send, "spf.nav.request.send");
    request.handleResponseFromCache_ = spf.tracing.instrument(request.handleResponseFromCache_, "spf.nav.request.handleResponseFromCache_");
    request.handleHeadersFromXHR_ = spf.tracing.instrument(request.handleHeadersFromXHR_, "spf.nav.request.handleHeadersFromXHR_");
    request.handleChunkFromXHR_ = spf.tracing.instrument(request.handleChunkFromXHR_, "spf.nav.request.handleChunkFromXHR_");
    request.handleCompleteFromXHR_ = spf.tracing.instrument(request.handleCompleteFromXHR_, "spf.nav.request.handleCompleteFromXHR_");
    request.done_ = spf.tracing.instrument(request.done_, "spf.nav.request.done_");
  })();
}
;goog.provide("spf.nav");
goog.require("spf");
goog.require("spf.array");
goog.require("spf.cache");
goog.require("spf.config");
goog.require("spf.debug");
goog.require("spf.dom");
goog.require("spf.dom.classlist");
goog.require("spf.history");
goog.require("spf.nav.request");
goog.require("spf.nav.response");
goog.require("spf.state");
goog.require("spf.tasks");
goog.require("spf.tracing");
goog.require("spf.url");
spf.nav.init = function() {
  spf.history.init(spf.nav.handleHistory_, spf.nav.dispatchError_);
  if (!spf.state.get(spf.state.Key.NAV_INIT) && document.addEventListener) {
    document.addEventListener("click", spf.nav.handleClick_, false);
    if (spf.config.get("experimental-prefetch-mousedown") && !spf.nav.isTouchCapablePlatform_()) {
      document.addEventListener("mousedown", spf.nav.handleMouseDown_, false);
      spf.state.set(spf.state.Key.PREFETCH_LISTENER, spf.nav.handleMouseDown_);
    }
    spf.state.set(spf.state.Key.NAV_INIT, true);
    spf.state.set(spf.state.Key.NAV_COUNTER, 0);
    spf.state.set(spf.state.Key.NAV_TIME, spf.now());
    spf.state.set(spf.state.Key.NAV_LISTENER, spf.nav.handleClick_);
  }
};
spf.nav.dispose = function() {
  spf.nav.cancel();
  if (spf.state.get(spf.state.Key.NAV_INIT)) {
    if (document.removeEventListener) {
      document.removeEventListener("click", (spf.state.get(spf.state.Key.NAV_LISTENER)), false);
      if (spf.config.get("experimental-prefetch-mousedown")) {
        document.removeEventListener("mousedown", (spf.state.get(spf.state.Key.PREFETCH_LISTENER)), false);
      }
    }
    spf.state.set(spf.state.Key.NAV_INIT, false);
    spf.state.set(spf.state.Key.NAV_COUNTER, null);
    spf.state.set(spf.state.Key.NAV_TIME, null);
    spf.state.set(spf.state.Key.NAV_LISTENER, null);
  }
  spf.history.dispose();
};
spf.nav.getAncestorWithLinkClass_ = function(element) {
  return spf.dom.getAncestor(element, function(node) {
    return spf.dom.classlist.contains(node, (spf.config.get("link-class")));
  });
};
spf.nav.getAncestorWithNoLinkClass_ = function(element) {
  return spf.dom.getAncestor(element, function(node) {
    return spf.dom.classlist.contains(node, (spf.config.get("nolink-class")));
  });
};
spf.nav.getAncestorWithHref_ = function(element, parent) {
  return spf.dom.getAncestor(element, function(node) {
    return node.href && node.tagName.toLowerCase() != "img";
  }, parent);
};
spf.nav.getEventURL_ = function(evt) {
  if (evt.metaKey || (evt.altKey || (evt.ctrlKey || evt.shiftKey))) {
    spf.debug.debug("    ignoring click with modifier key");
    return null;
  }
  if (evt.button > 0) {
    spf.debug.debug("    ignoring click with alternate button");
    return null;
  }
  var linkEl = spf.nav.getAncestorWithLinkClass_(evt.target);
  if (!linkEl) {
    spf.debug.debug("    ignoring click without link class");
    return null;
  }
  if (spf.config.get("nolink-class")) {
    var nolinkEl = spf.nav.getAncestorWithNoLinkClass_(evt.target);
    if (nolinkEl) {
      spf.debug.debug("    ignoring click with nolink class");
      return null;
    }
  }
  var target = spf.nav.getAncestorWithHref_(evt.target, linkEl);
  if (!target) {
    spf.debug.debug("    ignoring click without href");
    return null;
  }
  return target.href;
};
spf.nav.isAllowed_ = function(url) {
  var destination = spf.url.origin(url);
  if (destination != spf.url.origin(window.location.href)) {
    spf.debug.warn("destination not same-origin");
    return false;
  }
  return true;
};
spf.nav.isEligible_ = function(url) {
  if (!spf.state.get(spf.state.Key.NAV_INIT)) {
    spf.debug.warn("navigation not initialized");
    return false;
  }
  var validator = spf.config.get("validator");
  if (validator && !validator(url)) {
    return false;
  }
  var count = parseInt(spf.state.get(spf.state.Key.NAV_COUNTER), 10) || 0;
  count++;
  var limit = parseInt(spf.config.get("navigate-limit"), 10);
  limit = isNaN(limit) ? Infinity : limit;
  if (count > limit) {
    spf.debug.warn("navigation limit reached");
    return false;
  }
  var timestamp = parseInt(spf.state.get(spf.state.Key.NAV_TIME), 10);
  timestamp--;
  var age = spf.now() - timestamp;
  var lifetime = parseInt(spf.config.get("navigate-lifetime"), 10);
  lifetime = isNaN(lifetime) ? Infinity : lifetime;
  if (age > lifetime) {
    spf.debug.warn("navigation lifetime reached");
    return false;
  }
  return true;
};
spf.nav.handleClick_ = function(evt) {
  spf.debug.debug("nav.handleClick ", "evt=", evt);
  if (evt.defaultPrevented) {
    return;
  }
  var url = spf.nav.getEventURL_(evt);
  if (url === null) {
    return;
  }
  if (!url || url == window.location.href) {
    spf.debug.debug("    ignoring click to same page");
    evt.preventDefault();
    return;
  }
  if (spf.config.get("experimental-same-origin")) {
    if (!spf.nav.isAllowed_(url)) {
      return;
    }
  }
  if (!spf.nav.isEligible_(url)) {
    return;
  }
  if (!spf.nav.dispatchClick_(url, evt.target)) {
    return;
  }
  spf.nav.navigate_(url);
  evt.preventDefault();
};
spf.nav.handleMouseDown_ = function(evt) {
  spf.debug.debug("nav.handleMouseDown ", "evt=", evt);
  var url = spf.nav.getEventURL_(evt);
  if (!url || url == window.location.href) {
    return;
  }
  setTimeout(function() {
    spf.nav.prefetch((url));
  }, 0);
};
spf.nav.handleHistory_ = function(url, opt_state) {
  var reverse = !!(opt_state && opt_state["spf-back"]);
  var referer = opt_state && opt_state["spf-referer"];
  var current = opt_state && opt_state["spf-current"];
  spf.debug.debug("nav.handleHistory ", "(url=", url, "state=", opt_state, ")");
  if (spf.config.get("experimental-same-origin")) {
    if (!spf.nav.isAllowed_(url)) {
      spf.nav.reload(url, spf.nav.ReloadReason.FORBIDDEN);
      return;
    }
  }
  if (!spf.nav.isEligible_(url)) {
    spf.nav.reload(url, spf.nav.ReloadReason.INELIGIBLE);
    return;
  }
  if (!spf.nav.dispatchHistory_(url, referer, current)) {
    return;
  }
  spf.nav.navigate_(url, null, current, referer, true, reverse);
};
spf.nav.navigate = function(url, opt_options) {
  spf.debug.debug("nav.navigate ", "(url=", url, "options=", opt_options, ")");
  if (!url || url == window.location.href) {
    return;
  }
  if (spf.config.get("experimental-same-origin")) {
    if (!spf.nav.isAllowed_(url)) {
      spf.nav.reload(url, spf.nav.ReloadReason.FORBIDDEN);
      return;
    }
  }
  if (!spf.nav.isEligible_(url)) {
    spf.nav.reload(url, spf.nav.ReloadReason.INELIGIBLE);
    return;
  }
  spf.nav.navigate_(url, opt_options);
};
spf.nav.navigate_ = function(url, opt_options, opt_current, opt_referer, opt_history, opt_reverse) {
  spf.debug.info("nav.navigate_ ", url, opt_options, opt_current, opt_referer, opt_history, opt_reverse);
  var options = opt_options || ({});
  var count = (parseInt(spf.state.get(spf.state.Key.NAV_COUNTER), 10) || 0) + 1;
  spf.state.set(spf.state.Key.NAV_COUNTER, count);
  spf.state.set(spf.state.Key.NAV_TIME, spf.now());
  var referer = opt_referer == undefined ? window.location.href : opt_referer;
  spf.state.set(spf.state.Key.NAV_REFERER, referer);
  var current = opt_history ? opt_current : window.location.href;
  if (!spf.nav.dispatchRequest_(url, referer, current, options)) {
    spf.nav.reload(url, spf.nav.ReloadReason.REQUEST_CANCELED);
    return;
  }
  spf.nav.cancel();
  spf.nav.cancelAllPrefetchesExcept(url);
  var absoluteUrl = spf.url.absolute(url);
  var preprocessKey = spf.nav.preprocessKey(absoluteUrl);
  spf.tasks.cancelAllExcept("preprocess", preprocessKey);
  var prefetches = spf.nav.prefetches_();
  var prefetchXhr = prefetches[absoluteUrl];
  spf.state.set(spf.state.Key.NAV_REQUEST, prefetchXhr);
  spf.state.set(spf.state.Key.NAV_PROMOTE, null);
  spf.state.set(spf.state.Key.NAV_PROMOTE_TIME, null);
  if (prefetchXhr && prefetchXhr.readyState != 4) {
    spf.nav.navigatePromotePrefetch_(url, options, referer, !!opt_history, !!opt_reverse);
  } else {
    spf.nav.navigateSendRequest_(url, options, current, referer, !!opt_history, !!opt_reverse);
  }
};
spf.nav.navigatePromotePrefetch_ = function(url, options, referer, history, reverse) {
  spf.debug.debug("nav.navigatePromotePrefetch_ ", url);
  var preprocessKey = spf.nav.preprocessKey(url);
  var promoteKey = spf.nav.promoteKey(url);
  spf.state.set(spf.state.Key.NAV_PROMOTE, url);
  spf.state.set(spf.state.Key.NAV_PROMOTE_TIME, spf.now());
  spf.tasks.cancel(preprocessKey);
  spf.tasks.run(promoteKey, true);
  if (!history) {
    var handleError = spf.bind(spf.nav.handleNavigateError_, null, options);
    spf.nav.navigateAddHistory_(url, referer, handleError);
  }
};
spf.nav.navigateSendRequest_ = function(url, options, current, referer, history, reverse) {
  var handleError = spf.bind(spf.nav.handleNavigateError_, null, options);
  var handlePart = spf.bind(spf.nav.handleNavigatePart_, null, options, reverse);
  var handleSuccess = spf.bind(spf.nav.handleNavigateSuccess_, null, options, reverse, "");
  var xhr = spf.nav.request.send(url, {method:options["method"], onPart:handlePart, onError:handleError, onSuccess:handleSuccess, postData:options["postData"], type:"navigate" + (history ? reverse ? "-back" : "-forward" : ""), current:current, referer:referer});
  spf.state.set(spf.state.Key.NAV_REQUEST, xhr);
  if (!history) {
    spf.nav.navigateAddHistory_(url, referer, handleError);
  }
};
spf.nav.navigateAddHistory_ = function(url, referer, handleError) {
  try {
    var state = {"spf-referer":referer};
    spf.history.add(url, state);
  } catch (err) {
    spf.nav.cancel();
    spf.debug.error("error caught, redirecting ", "(url=", url, "err=", err, ")");
    handleError(url, err);
  }
};
spf.nav.handleNavigateError_ = function(options, url, err) {
  spf.debug.warn("navigate error", "(url=", url, ")");
  spf.state.set(spf.state.Key.NAV_REQUEST, null);
  if (!spf.nav.dispatchError_(url, err, options)) {
    return;
  }
  var reason = spf.nav.ReloadReason.ERROR;
  if (err) {
    reason += " Message: " + err.message;
  }
  spf.nav.reload(url, reason);
};
spf.nav.handleNavigatePart_ = function(options, reverse, url, partial) {
  if (!spf.nav.dispatchPartProcess_(url, partial, options)) {
    spf.nav.reload(url, spf.nav.ReloadReason.PART_PROCESS_CANCELED);
    return;
  }
  if (partial["redirect"]) {
    spf.nav.handleNavigateRedirect_(options, partial["redirect"]);
    return;
  }
  try {
    spf.nav.response.process(url, partial, function() {
      spf.nav.dispatchPartDone_(url, partial, options);
    }, true, reverse);
  } catch (err) {
    spf.debug.debug("    failed to process part", partial);
    spf.nav.handleNavigateError_(options, url, err);
    return;
  }
};
spf.nav.handleNavigateSuccess_ = function(options, reverse, original, url, response) {
  spf.state.set(spf.state.Key.NAV_REQUEST, null);
  if (spf.state.get(spf.state.Key.NAV_PROMOTE) == original) {
    var timing = response["timing"] || {};
    timing["navigationStart"] = spf.state.get(spf.state.Key.NAV_PROMOTE_TIME);
    timing["spfPrefetched"] = true;
  }
  var multipart = response["type"] == "multipart";
  if (!multipart) {
    if (!spf.nav.dispatchProcess_(url, response, options)) {
      spf.nav.reload(url, spf.nav.ReloadReason.PROCESS_CANCELED);
      return;
    }
    if (response["redirect"]) {
      spf.nav.handleNavigateRedirect_(options, response["redirect"]);
      return;
    }
  }
  try {
    var r = (multipart ? {} : response);
    spf.nav.response.process(url, r, function() {
      spf.nav.dispatchDone_(url, response, options);
    }, true, reverse);
  } catch (err) {
    spf.debug.debug("    failed to process response", response);
    spf.nav.handleNavigateError_(options, url, err);
    return;
  }
};
spf.nav.handleNavigateRedirect_ = function(options, redirectUrl) {
  try {
    redirectUrl = redirectUrl + window.location.hash;
    spf.history.replace(redirectUrl, null, true, true);
  } catch (err) {
    spf.nav.cancel();
    spf.debug.error("error caught, redirecting ", "(url=", redirectUrl, "err=", err, ")");
    spf.nav.handleNavigateError_(options, redirectUrl, err);
  }
};
spf.nav.cancel = function() {
  var xhr = (spf.state.get(spf.state.Key.NAV_REQUEST));
  if (xhr) {
    spf.debug.warn("aborting previous navigate ", "xhr=", xhr);
    xhr.abort();
    spf.state.set(spf.state.Key.NAV_REQUEST, null);
  }
};
spf.nav.callback = function(fn, var_args) {
  var val;
  if (fn) {
    var args = Array.prototype.slice.call(arguments);
    args[0] = fn;
    val = spf.execute.apply(null, args);
    if (val instanceof Error) {
      spf.debug.error("error in callback (url=", window.location.href, "err=", val, ")");
    }
  }
  return val !== false;
};
spf.nav.reload = function(url, reason) {
  spf.debug.warn("redirecting (", "url=", url, "reason=", reason, ")");
  spf.nav.cancel();
  spf.nav.cancelAllPrefetchesExcept();
  spf.nav.dispatchReload_(url, reason);
  if (spf.config.get("experimental-remove-history") && window.location.href == url) {
    spf.history.removeCurrentEntry();
  }
  setTimeout(function() {
    window.location.href = url;
  }, 0);
};
spf.nav.load = function(url, opt_options) {
  spf.nav.load_(url, opt_options);
};
spf.nav.load_ = function(url, opt_options, opt_original) {
  spf.debug.info("nav.load ", url, opt_options, opt_original);
  var options = opt_options || ({});
  var original = opt_original || url;
  if (!spf.nav.dispatchRequest_(url, undefined, undefined, options, true)) {
    return;
  }
  var handleError = spf.bind(spf.nav.handleLoadError_, null, false, options, original);
  var handlePart = spf.bind(spf.nav.handleLoadPart_, null, false, options, original);
  var handleSuccess = spf.bind(spf.nav.handleLoadSuccess_, null, false, options, original);
  spf.nav.request.send(url, {method:options["method"], onPart:handlePart, onError:handleError, onSuccess:handleSuccess, postData:options["postData"], type:"load"});
};
spf.nav.prefetch = function(url, opt_options) {
  spf.nav.prefetch_(url, opt_options);
};
spf.nav.prefetch_ = function(url, opt_options, opt_original) {
  spf.debug.info("nav.prefetch ", url, opt_options, opt_original);
  var options = opt_options || ({});
  var original = opt_original || url;
  var current = window.location.href;
  if (!spf.nav.dispatchRequest_(url, undefined, undefined, options, true)) {
    return;
  }
  var handleError = spf.bind(spf.nav.handleLoadError_, null, true, options, original);
  var handlePart = spf.bind(spf.nav.handleLoadPart_, null, true, options, original);
  var handleSuccess = spf.bind(spf.nav.handleLoadSuccess_, null, true, options, original);
  var xhr = spf.nav.request.send(url, {method:options["method"], onPart:handlePart, onError:handleError, onSuccess:handleSuccess, postData:options["postData"], type:"prefetch", current:current});
  spf.nav.addPrefetch(url, xhr);
};
spf.nav.handleLoadError_ = function(isPrefetch, options, original, url, err) {
  spf.debug.warn(isPrefetch ? "prefetch" : "load", "error", "(url=", url, ")");
  if (isPrefetch) {
    spf.nav.removePrefetch(url);
  }
  if (isPrefetch && spf.state.get(spf.state.Key.NAV_PROMOTE) == original) {
    spf.nav.handleNavigateError_(options, url, err);
  } else {
    spf.nav.dispatchError_(url, err, options, true);
  }
};
spf.nav.handleLoadPart_ = function(isPrefetch, options, original, url, partial) {
  if (!spf.nav.dispatchPartProcess_(url, partial, options, true)) {
    return;
  }
  if (partial["redirect"]) {
    spf.nav.handleLoadRedirect_(isPrefetch, options, original, partial["redirect"]);
    return;
  }
  if (isPrefetch) {
    var fn = spf.bind(spf.nav.handleNavigatePart_, null, options, false, url, partial);
    var promoteKey = spf.nav.promoteKey(original);
    spf.tasks.add(promoteKey, fn);
    if (spf.state.get(spf.state.Key.NAV_PROMOTE) == original) {
      spf.tasks.run(promoteKey, true);
      return;
    }
  }
  var processFn = isPrefetch ? spf.nav.response.preprocess : spf.nav.response.process;
  processFn(url, partial, function() {
    spf.nav.dispatchPartDone_(url, partial, options, true);
  });
};
spf.nav.handleLoadSuccess_ = function(isPrefetch, options, original, url, response) {
  var multipart = response["type"] == "multipart";
  if (!multipart) {
    if (!spf.nav.dispatchProcess_(url, response, options, true)) {
      spf.nav.reload(url, spf.nav.ReloadReason.PROCESS_CANCELED);
      return;
    }
    if (response["redirect"]) {
      spf.nav.handleLoadRedirect_(isPrefetch, options, original, response["redirect"]);
      return;
    }
  }
  var promoteKey = spf.nav.promoteKey(original);
  if (isPrefetch) {
    spf.nav.removePrefetch(url);
    if (spf.state.get(spf.state.Key.NAV_PROMOTE) == original) {
      var fn = spf.bind(spf.nav.handleNavigateSuccess_, null, options, false, original, url, response);
      spf.tasks.add(promoteKey, fn);
      spf.tasks.run(promoteKey, true);
      return;
    } else {
      spf.tasks.cancel(promoteKey);
    }
  }
  var processFn = isPrefetch ? spf.nav.response.preprocess : spf.nav.response.process;
  try {
    var r = (multipart ? {} : response);
    processFn(url, r, function() {
      spf.nav.dispatchDone_(url, response, options, true);
    });
  } catch (err) {
    spf.debug.debug("    failed to process response", response);
    spf.nav.handleLoadError_(isPrefetch, options, original, url, err);
    return;
  }
};
spf.nav.handleLoadRedirect_ = function(isPrefetch, options, original, redirectUrl) {
  var redirectFn = isPrefetch ? spf.nav.prefetch_ : spf.nav.load_;
  var keys = [spf.nav.Callback.ERROR, spf.nav.Callback.REQUEST, spf.nav.Callback.PART_PROCESS, spf.nav.Callback.PART_DONE, spf.nav.Callback.PROCESS, spf.nav.Callback.DONE];
  var redirectOpts = ({});
  spf.array.each(keys, function(key) {
    redirectOpts[key] = options[key];
  });
  redirectFn(redirectUrl, redirectOpts, original);
};
spf.nav.dispatchError_ = function(url, err, opt_options, opt_noEvents) {
  var detail = {"url":url, "err":err};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.ERROR];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.ERROR, detail);
  }
  return proceed;
};
spf.nav.dispatchReload_ = function(url, reason) {
  var detail = {"url":url, "reason":reason};
  spf.dispatch(spf.EventName.RELOAD, detail);
};
spf.nav.dispatchClick_ = function(url, target) {
  var detail = {"url":url, "target":target};
  return spf.dispatch(spf.EventName.CLICK, detail);
};
spf.nav.dispatchHistory_ = function(url, opt_referer, opt_previous) {
  var detail = {"url":url, "referer":opt_referer, "previous":opt_previous};
  return spf.dispatch(spf.EventName.HISTORY, detail);
};
spf.nav.dispatchRequest_ = function(url, referer, previous, opt_options, opt_noEvents) {
  var detail = {"url":url, "referer":referer, "previous":previous};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.REQUEST];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.REQUEST, detail);
  }
  return proceed;
};
spf.nav.dispatchPartProcess_ = function(url, partial, opt_options, opt_noEvents) {
  var detail = {"url":url, "part":partial};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.PART_PROCESS];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.PART_PROCESS, detail);
  }
  return proceed;
};
spf.nav.dispatchPartDone_ = function(url, partial, opt_options, opt_noEvents) {
  var detail = {"url":url, "part":partial};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.PART_DONE];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.PART_DONE, detail);
  }
  return proceed;
};
spf.nav.dispatchProcess_ = function(url, response, opt_options, opt_noEvents) {
  var detail = {"url":url, "response":response};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.PROCESS];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.PROCESS, detail);
  }
  return proceed;
};
spf.nav.dispatchDone_ = function(url, response, opt_options, opt_noEvents) {
  var detail = {"url":url, "response":response};
  var options = opt_options || ({});
  var fn = options[spf.nav.Callback.DONE];
  var proceed = spf.nav.callback(fn, detail);
  if (proceed && !opt_noEvents) {
    proceed = spf.dispatch(spf.EventName.DONE, detail);
  }
  return proceed;
};
spf.nav.promoteKey = function(url) {
  return "promote " + spf.url.absolute(url);
};
spf.nav.preprocessKey = function(url) {
  return "preprocess " + spf.url.absolute(url);
};
spf.nav.addPrefetch = function(url, xhr) {
  spf.debug.debug("nav.addPrefetch ", url, xhr);
  var absoluteUrl = spf.url.absolute(url);
  var prefetches = spf.nav.prefetches_();
  prefetches[absoluteUrl] = xhr;
};
spf.nav.removePrefetch = function(url) {
  spf.debug.debug("nav.removePrefetch ", url);
  var absoluteUrl = spf.url.absolute(url);
  var prefetches = spf.nav.prefetches_();
  var prefetchXhr = prefetches[absoluteUrl];
  if (prefetchXhr) {
    prefetchXhr.abort();
  }
  delete prefetches[absoluteUrl];
};
spf.nav.cancelAllPrefetchesExcept = function(opt_skipUrl) {
  spf.debug.debug("nav.cancelAllPrefetchesExcept", opt_skipUrl);
  var prefetches = spf.nav.prefetches_();
  var absoluteUrl = opt_skipUrl && spf.url.absolute(opt_skipUrl);
  for (var key in prefetches) {
    if (absoluteUrl != key) {
      spf.nav.removePrefetch(key);
    }
  }
};
spf.nav.prefetches_ = function(opt_reqs) {
  if (opt_reqs || !spf.state.has(spf.state.Key.NAV_PREFETCHES)) {
    return(spf.state.set(spf.state.Key.NAV_PREFETCHES, opt_reqs || {}));
  }
  return(spf.state.get(spf.state.Key.NAV_PREFETCHES));
};
spf.nav.isTouchCapablePlatform_ = function() {
  return "ontouchstart" in window || (window.navigator["maxTouchPoints"] > 0 || window.navigator["msMaxTouchPoints"] > 0);
};
spf.nav.Callback = {ERROR:"onError", REQUEST:"onRequest", PART_PROCESS:"onPartProcess", PART_DONE:"onPartDone", PROCESS:"onProcess", DONE:"onDone"};
spf.nav.ReloadReason = {INELIGIBLE:!SPF_DEBUG ? "1" : "1: Navigation not initialized or limit reached.", REQUEST_CANCELED:!SPF_DEBUG ? "2" : "2: Navigation canceled by the request event.", PART_PROCESS_CANCELED:!SPF_DEBUG ? "3" : "3: Navigation canceled by the partprocess event.", PROCESS_CANCELED:!SPF_DEBUG ? "4" : "4: Navigation canceled by the process event.", FORBIDDEN:!SPF_DEBUG ? "9" : "9: Destination forbidden by same-origin security.", ERROR:!SPF_DEBUG ? "10" : "10: An uncaught error occurred processing."};
if (spf.tracing.ENABLED) {
  (function() {
    spf.nav.init = spf.tracing.instrument(spf.nav.init, "spf.nav.init");
    spf.nav.dispose = spf.tracing.instrument(spf.nav.dispose, "spf.nav.dispose");
    spf.nav.handleClick_ = spf.tracing.instrument(spf.nav.handleClick_, "spf.nav.handleClick_");
    spf.nav.handleHistory_ = spf.tracing.instrument(spf.nav.handleHistory_, "spf.nav.handleHistory_");
    spf.nav.navigate = spf.tracing.instrument(spf.nav.navigate, "spf.nav.navigate");
    spf.nav.navigate_ = spf.tracing.instrument(spf.nav.navigate_, "spf.nav.navigate_");
    spf.nav.navigatePromotePrefetch_ = spf.tracing.instrument(spf.nav.navigatePromotePrefetch_, "spf.nav.navigatePromotePrefetch_");
    spf.nav.navigateSendRequest_ = spf.tracing.instrument(spf.nav.navigateSendRequest_, "spf.nav.navigateSendRequest_");
    spf.nav.handleNavigateError_ = spf.tracing.instrument(spf.nav.handleNavigateError_, "spf.nav.handleNavigateError_");
    spf.nav.handleNavigatePart_ = spf.tracing.instrument(spf.nav.handleNavigatePart_, "spf.nav.handleNavigatePart_");
    spf.nav.handleNavigateSuccess_ = spf.tracing.instrument(spf.nav.handleNavigateSuccess_, "spf.nav.handleNavigateSuccess_");
    spf.nav.cancel = spf.tracing.instrument(spf.nav.cancel, "spf.nav.cancel");
    spf.nav.callback = spf.tracing.instrument(spf.nav.callback, "spf.nav.callback");
    spf.nav.reload = spf.tracing.instrument(spf.nav.reload, "spf.nav.reload");
    spf.nav.load = spf.tracing.instrument(spf.nav.load, "spf.nav.load");
    spf.nav.handleLoadError_ = spf.tracing.instrument(spf.nav.handleLoadError_, "spf.nav.handleLoadError_");
    spf.nav.handleLoadPart_ = spf.tracing.instrument(spf.nav.handleLoadPart_, "spf.nav.handleLoadPart_");
    spf.nav.handleLoadSuccess_ = spf.tracing.instrument(spf.nav.handleLoadSuccess_, "spf.nav.handleLoadSuccess_");
  })();
}
;goog.provide("spf.main");
goog.require("spf");
goog.require("spf.config");
goog.require("spf.debug");
goog.require("spf.history");
goog.require("spf.nav");
goog.require("spf.net.script");
goog.require("spf.net.style");
goog.require("spf.pubsub");
spf.main.init = function(opt_config) {
  var enable = spf.main.canInit_();
  spf.debug.info("main.init ", "enable=", enable);
  spf.config.init(opt_config);
  if (enable) {
    spf.nav.init();
  }
  return enable;
};
spf.main.canInit_ = function() {
  return!!(typeof window.history.pushState == "function" || spf.history.getIframe().contentWindow.history.pushState);
};
spf.main.dispose = function() {
  var enable = !!(typeof History != "undefined" && History.prototype.pushState);
  if (enable) {
    spf.nav.dispose();
  }
  spf.config.clear();
};
spf.main.discover_ = function() {
  spf.net.script.discover();
  spf.net.style.discover();
  if (document.readyState == "complete") {
    if (document.removeEventListener) {
      document.removeEventListener("DOMContentLoaded", spf.main.discover_, false);
    } else {
      if (document.detachEvent) {
        document.detachEvent("onreadystatechange", spf.main.discover_);
      }
    }
  }
};
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", spf.main.discover_, false);
} else {
  if (document.attachEvent) {
    document.attachEvent("onreadystatechange", spf.main.discover_);
  }
}
spf.main.discover_();
spf.main.api_ = {"init":spf.main.init, "dispose":spf.main.dispose, "navigate":spf.nav.navigate, "load":spf.nav.load, "process":spf.nav.response.process, "prefetch":spf.nav.prefetch};
spf.main.extra_ = {"script":{"load":spf.net.script.load, "get":spf.net.script.get, "ready":spf.net.script.ready, "done":spf.net.script.done, "require":spf.net.script.require, "declare":spf.net.script.declare, "path":spf.net.script.path, "unload":spf.net.script.unload, "ignore":spf.net.script.ignore, "unrequire":spf.net.script.unrequire, "prefetch":spf.net.script.prefetch}, "style":{"load":spf.net.style.load, "get":spf.net.style.get, "unload":spf.net.style.unload, "path":spf.net.style.path, "prefetch":spf.net.style.prefetch}};
var global = this;
global["spf"] = global["spf"] || {};
var api = global["spf"];
for (var fn1 in spf.main.api_) {
  api[fn1] = spf.main.api_[fn1];
}
for (var ns in spf.main.extra_) {
  for (var fn2 in spf.main.extra_[ns]) {
    api[ns] = api[ns] || {};
    api[ns][fn2] = spf.main.extra_[ns][fn2];
  }
}
spf.dispatch(spf.EventName.READY);

