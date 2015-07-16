var express = require('express');
var router = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

function render(res, template, context) {
  // Extend with default context
  var defaultContext = {
    page: template,
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

  SignManager.performConfiguration(sign, req.body, function onConfigurationDone(err, status) {
    if (err)
      return next(err);

    res.json(status);
  });
});

/* GET jobs page */
router.get('/jobs', function(req, res, next) {
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

    render(res, 'jobs', {
      title: 'sign-server | jobs',
      jobs: jobs
    });
  });
});

/* POST create empty job */
router.post('/jobs/create', function(req, res, next) {
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
        return res.json(err);

      res.json({
        success: true
      });
    });
  });
  // TODO flatten
});

/* GET tasks page */
router.get('/tasks', function(req, res, next) {
  db.models.Task.all(function(err, tasks) {
    if (err)
      return next(err);

    render(res, 'tasks', {
      title: 'sign-server | tasks',
      tasks: tasks
    })
  });
});

/* POST to create an empty task */
router.post('/tasks/create', function(req, res, next) {
  if (!req.body.name)
    return res.json({
      error: 'Task must have a name'
    });

  // Make sure it doesn't exist
  db.models.Task.exists({
    name: req.body.name
  }, function(err, exists) {
    if (exists)
      return res.json({
        error: 'A Task with that name already exists'
      });

    db.models.Task.create({
      name: req.body.name
    }, function(err, results) {
      if (err)
        return res.json(err);

      res.json({
        success: true
      });
    });
  });
  // TODO flatten
});

router.post('/tasks/edit', function(req, res, next) {
  db.models.Task.get(req.body.id, function(err, task) {
    if (err)
      return res.json(err);

    // Save new data
    task.name = req.body.name;
    task.action = req.body.action;
    task.value = req.body.value;
    task.duration = req.body.duration;

    task.save(function(err) {
      if (err)
        return res.json(err);

      res.json({
        success: true,
        msg: 'Task saved'
      });
    });
  })
});

/* Several help pages */
router.get('/installing', function(req, res, next) {
  res.render('help/installing');
});

module.exports = router;
