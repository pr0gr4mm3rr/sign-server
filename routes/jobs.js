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
  // Get job
  db.models.Job.get(req.params.job, function(err, job) {
    if (err)
      return res.json({
        error: err
      });

    // Get task as well
    db.models.Task.get(req.body.task, function(err, task) {
      if (err)
        return res.json({
          error: err
        });

      // Add task to job
      job.addTask(task, function(err) {
        if (err)
          return res.json({
            error: err
          });

        res.json({
          success: 'Added task to job'
        });
      });

      // TODO determine ordinality
    });
  });
});
