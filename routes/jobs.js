var async = require('async');
var express = require('express');
var router = module.exports = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

/* Jobs main page */
router.get('/', function(req, res, next) {
  db.models.Job.all(function(err, jobs) {
    if (err)
      return next(err);

    // Sort job tasks by ordinality
    // TODO move to database methods
    jobs.forEach(function(job) {
      job.tasks.sort(function(a, b) {
        return a.ordinality - b.ordinality;
      });
    });

    res.render('jobs', {
      title: 'sign-server | jobs',
      jobs: jobs
    });
  });
});

/* POST to create an empty job */
router.post('/create', function(req, res, next) {
  if (!req.body.name)
    return res.json({
      error: 'Job must have a name'
    });



  // Make sure it doesn't exist
  db.models.Job.exists({
    name: req.body.name
  }, function(err, exists) {
    if (exists)
      return res.json({
        error: 'A job with that name already exists'
      });

    db.models.Job.create({
      name: req.body.name
    }, function(err, results) {
      if (err)
      // XXX Do we want to send a straight error to the client?
        return res.json({
        error: err
      });

      res.json({
        success: true
      });
    });
  });
  // TODO flatten
});

/* POST to add a task to a job */
router.post('/:job/addtask', function(req, res, next) {
  async.parallel([
    function(cb) {
      // Get job
      db.models.Job.get(req.params.job, cb);
    },
    function(cb) {
      // Get task
      db.models.Task.get(req.body.task, cb);
    }
  ], function(err, results) {
    if (err) return next(err);

    var job = results[0];
    var task = results[1];

    // Determine ordinality
    job.getTasks(function(err, tasks) {
      if (err) return next(err);

      async.reduce(tasks, -1, function(memo, item, cb) {
        cb(null, Math.max(memo, item.ordinality));
      }, function(err, maxOrdinality) {
        if (err) return next(err);

        var ordinality = maxOrdinality + 1;

        job.addTasks(task, {
          ordinality: ordinality
        }, function(err) {
          if (err) next(err);

          res.json({
            success: 'Added task to job'
          });
        });
      });
    });
  });
});
// TODO flatten

router.post('/:job/removetask/:task', function(req, res, next) {
  db.models.Job.get(req.params.job, function(err, job) {
    if (err) return next(err);

    if (!job) {
      //res.status(404);
      res.json({
        error: 'Job not found'
      });
      return;
    }

    var removeOrdinality = parseInt(req.params.task);

    var toRemove = job.tasks.filter(function(task) {
      return task.ordinality == removeOrdinality;
    });

    console.log(toRemove);
    if (toRemove.length === 0) {
      //res.status(404);
      res.json({
        error: 'Job-Task not found'
      });
      return;
    }

    job.removeTasks(toRemove, function(err) {
      if (err) return  next(err);

      res.json({
        success: 'Task removed from job'
      });
    });
  });
});
