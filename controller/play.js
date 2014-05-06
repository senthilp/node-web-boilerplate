var expressUtil = require('../libs/expressUtil');


module.exports = function(req, res) {
	expressUtil.send(req, res, 'play.dust', {"searchQuery": "Soccer"});
};