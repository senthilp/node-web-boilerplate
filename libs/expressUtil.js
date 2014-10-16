'use strict';


//util method for expressjs content negotiation.
module.exports.send = function send(req, res, template, data, fragment){
	var now = Date.now(),
		future = now + 1000;
	while(now <= future) {
		now = Date.now();
	}
	if(req.query.neo){
		res.render(fragment + '.dust', data, function(err, out) {
			var jsonResp = {};
			if(fragment ==='container') {
				jsonResp.title = 'Playground';
				jsonResp.css = '<link href="/css/play.css" rel="stylesheet"/>';
			} else {
				jsonResp.title = 'Dummy';
				jsonResp.css = '<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">';
			}			
			jsonResp.body = {
				"spa-container": out + '<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore.js"></script><script>console.log("underscore - " + typeof _);</script>',
				"ph-container": '<script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone.js"></script><script>console.log("backbone - " + typeof Backbone);</script>'
			};
			jsonResp.foot = '<script src="http://ir.ebaystatic.com/rs/c/3.8/lens.js"></script><script>console.log("foot - " + typeof Lens);</script>';
			res.format({
				json: function(){
					res.json(jsonResp);
				}			
			});	
		});		
	} else {
		//Performs content-negotiation on the request Accept header field when present
		//see http://expressjs.com/api.html#res.format
		res.format({
			html: function(){
				res.render(template, data);
			}
		});
	}
};