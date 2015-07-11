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

/* GET active signs */
router.get('/signs', function(req, res, next) {
	render(res, 'active', {
		title: 'sign-server | active'
	});
});

/* GET pending signs */
router.get('/pending', function(req, res, next) {
	render(res, 'pending', {
		title: 'sign-server | pending'
	});
});

/* GET sign setup */
router.get('/setup/:sign', function(req, res, next) {
	var sign = SignManager.getSign(req.params.sign);
	if (!sign)
		return next();

	render(res, 'setup', {
		title: sign.name + ' | setup',
		sign: sign
	});
});

router.post('/setup/:sign', function(req, res, next) {
	var sign = SignManager.getSign(req.params.sign);
	if (!sign)
		return next();

	res.json(req.body);
});

/* Several help pages */
router.get('/installing', function(req, res, next) {
	res.render('help/installing');
});

module.exports = router;
