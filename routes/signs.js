var express = require('express');
var router = module.exports = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

/* GET main signs page */
router.get('/', function(req, res, next) {
  res.render('active', {
    title: 'sign-server | active signs'
  });
});
