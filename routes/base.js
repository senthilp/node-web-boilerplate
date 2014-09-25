'use strict';

//dependency modules
var expressUtil = require('../libs/expressUtil');

module.exports = function(app) {

	/**
	 * render a simple hello world template
	 */
	app.get('/', function(req, res) {
		expressUtil.send(req, res, 'index', { 'name':'Node' });
		
	});
	/**
	* Playground
	*/
	app.get('/play', require('../controller/play.js'));
	/**
	* Dummy
	*/
	app.get('/dummy', require('../controller/dummy.js'));	
	/**
	 * Service Worker
	 */
	app.get('/sw', function(req, res) {
		expressUtil.send(req, res, 'sw', {});
		
	});	
};