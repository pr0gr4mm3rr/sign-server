var async = require('async');
var express = require('express');
var router = module.exports = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');
var JobResolver = require('../engine/JobResolver');

/* GET main signs page */
router.get('/', function(req, res, next) {

  async.parallel([
    function(cb) {
      db.models.Sign.find({
        state: 'ACTIVE'
      }, cb);
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

/* POST to set sign job */
router.post('/:sign/setjob', function(req, res, next) {
  var jobID = parseInt(req.body.job);

  db.models.Sign.get(req.params.sign, function(err, sign) {
    if (err) return res.json({
      error: err
    });

    if (jobID === -1)
      return sign.removeJob(function(err) {
        if (err) return res.json({
          error: err
        });
        res.json({
          success: 'Removed job from sign'
        });
      });

    db.models.Job.get(jobID, function(err, job) {
      if (err) return res.json({
        error: err
      });

      sign.setJob(job, function(err) {
        if (err) {
          res.json({
            error: err
          })
        } else {
          res.json({
            success: 'Set new job for sign'
          });
        }
      });

    });
  });
});

/* GET sign job flattened (from sign-client usually) */
router.get('/:sign/getjobdata', function(req, res, next) {
  db.models.Sign.get(req.params.sign, function(err, sign) {
    if (err)
      return res.json({
        error: err
      });

    JobResolver.resolve(sign.job.id, function(err, job) {
      if (err)
      //throw err;
        return res.json({
        error: err.message
      });

      res.json({
        success: true,
        name: sign.name,
        job: job
      });
    });
  });
});
