var express = require('express');
var router = module.exports = express.Router();

var SignManager = require('../engine/SignManager');
var db = require('../engine/database');

/* GET tasks page */
router.get('/', function(req, res, next) {
  db.models.Task.all(function(err, tasks) {
    if (err)
      return next(err);

    res.render('tasks', {
      title: 'sign-server | tasks',
      tasks: tasks
    })
  });
});

/* POST to create an empty task */
router.post('/create', function(req, res, next) {
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

router.post('/edit', function(req, res, next) {
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

router.get('/json', function(req, res, next) {
  db.models.Task.all(function(err, tasks) {
    if (err)
      return res.json(err);

    res.json(tasks);
  })
});
