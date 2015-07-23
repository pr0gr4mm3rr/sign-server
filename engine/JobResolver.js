// Resolves jobs into arrays of tasks, for sending to sign-client
var async = require('async');
var db = require('./Database');

module.exports.resolve = function resolve(job, done, blacklist) {

  if (!job.model || job.model() !== db.models.Job) {
    //if (typeof job !== 'number') return done(new Error('Invalid jobresolve request'));

    //  We need to get the job
    return db.models.Job.get(job, function(err, jobObj) {
      if (err) return done(err);
      if (!jobObj) return done(new Error('Resolver could not find a job for "' + job + '"'));
      resolve(jobObj, done, blacklist);
    });
  }



  blacklist = blacklist || [];
  if (blacklist.indexOf(job.id) !== -1) return done(new Error('Recursive job nesting'));
  blacklist.push(job.id);

  async.reduce(job.tasks, [], function(memo, task, cb) {
    if (task.action === 'job') {
      resolve(task.value, function(err, subJob) {
        if (err) return cb(err);

        memo = memo.concat(subJob);
        cb(null, memo);
      }, blacklist);
    } else {
      memo.push(task);
      cb(null, memo);
    }

  }, function(err, result) {
    if (err) return done(err);

    done(null, result);
  });
}
