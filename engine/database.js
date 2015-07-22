var orm = require('orm');
var sqlite = require('sqlite3');
var config = require('../config');

var conn = null;

var connInfo = config.get('database');
if (!connInfo)
	throw new Error('No database configuration found in config.json');

var db = orm.connect('sqlite://' + connInfo.file);
var dbraw = new sqlite.Database(connInfo.file);

db.on('connect', function(err) {
	if (err) return console.log('Failed to connect to database: %s', err);

	console.log('Database connected');

	defineModels();
});

var models = module.exports.models = {};

function defineModels() {
	// We have signs, jobs and tasks
	// A sign can have only one job
	// A job can have many tasks
	// A task can be to play a video, display a template, or do another job
	// thus a sign might be able to have multiple jobs
	// Or a sign might do a common job, but have one additional task

	// We don't want to cache data
	db.settings.set('instance.cache', false);

	models.Sign = db.define('sign', {
		name: { type: 'text' },
		state: { type: 'enum', values: [
			'PENDING',
			'ACTIVE'
		]}
	});

	models.Job = db.define('job', {
		name: { type: 'text' }
	}, {
		methods: {
			removeTask: function(task, cb) {
				// We have to do this ourselves
				console.log(this.id, task.id, task.ordinality);
				console.log(JSON.stringify(task, null, 2));
				dbraw.run('DELETE FROM job_tasks WHERE job_id=? AND tasks_id=? AND ordinality=?',
					[this.id, task.id, task.ordinality], cb);
			}
		}
	});

	models.Task = db.define('task', {
		name: { type: 'text' },
		action: { type: 'enum', values: ['video', 'template', 'job'] },
		value: { type: 'text' },
		duration: { type: 'integer', defaultValue: 30 }
	});

	models.Sign.hasOne('job', models.Job, {
		// Sign should fetch its job and tasks
		autoFetch: true,
		autoFetchLimit: 2
	});

	// TODO have a job with a job-task fetch all sub-tasks and flatten itself
	// TODO enforce that a job cannot have itself as a child/descendant

	models.Job.hasMany('tasks', models.Task, {
		ordinality: { type: 'integer', key: true }
	}, {
		key: true,
		autoFetch: true
	});

	db.sync(function(err) {
		if (err)
			throw err;

			models.Job.count(function(err, c) {
				if (c) return;

				// Some example data
				var job = models.Job.create({name: 'A Job'}, function(){});
				var atask = models.Task.create({name: 'Alpha task', action: 'video', value: 'somewhere'}, function(){});
			});

	});
}
