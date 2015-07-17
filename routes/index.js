var express = require('express');
var router = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

// Add additional context to res.render
router.use(function(req, res, next) {
  res._render = res.render;
  res.render = function renderProxy(template, context) {
    var defaultContext = {
      page: template,
      pending: SignManager.getPending()
    };
    for (var i in defaultContext)
      context[i] = defaultContext[i];

    res._render(template, context);
  }

  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'sign-server'
  });
});

/* GET active signs */
router.use('/signs', require('./signs'));
router.use('/jobs', require('./jobs'));
router.use('/tasks', require('./tasks'));

/* GET pending signs */
router.get('/pending', function(req, res, next) {
  res.render('pending', {
    title: 'sign-server | pending'
  });
});

/* GET sign setup */
router.get('/setup/:sign', function(req, res, next) {
  var sign = SignManager.getSign(req.params.sign);
  if (!sign)
    return next();

  res.render('setup', {
    title: sign.name + ' | setup',
    sign: sign
  });
});

router.post('/setup/:sign', function(req, res, next) {
  var sign = SignManager.getSign(req.params.sign);
  if (!sign)
    return next();

  SignManager.performConfiguration(sign, req.body, function onConfigurationDone(err, status) {
    if (err)
      return next(err);

    res.json(status);
  });
});

/* Several help pages */
router.get('/installing', function(req, res, next) {
  res.render('help/installing');
});

module.exports = router;
