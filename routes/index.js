var express = require('express');
var router = express.Router();

var SignManager = require('../engine/SignManager');

function render(res, template, context) {
	// Extend with default context
	var defaultContext = {
		pending: SignManager.getPending()
	};
	for (var i in defaultContext)
		context[i] = defaultContext[i];

	res.render(template, context);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	render(res, 'index', {
		title: 'sign-server'
	});
});

router.get('/pending', function(req, res, next) {
	render(res, 'pending', {
		title: 'sign-server | pending'
	});
});

module.exports = router;
