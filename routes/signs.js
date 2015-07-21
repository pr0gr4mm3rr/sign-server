var async = require('async');
var express = require('express');
var router = module.exports = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

/* GET main signs page */
router.get('/', function(req, res, next) {

  async.parallel([
    function(cb) {
      db.models.Sign.find({state: 'ACTIVE'}, cb);
    },
    function(cb) {
      db.models.Job.all(cb);
    }
  ], function(err, results) {
    if (err) return next(err);

    var signs = results[0];
    var jobs = results[1];

    res.render('active', {
      title: 'sign-server | active signs',
      active: signs,
      jobs: jobs
    });
  });
});
