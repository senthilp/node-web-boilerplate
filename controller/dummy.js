var expressUtil = require('../libs/expressUtil');


module.exports = function(req, res) {

	expressUtil.send(req, res, 'dummy.dust', {
		"pageId": req.query.page || 1
	}, 'dcontainer');
};