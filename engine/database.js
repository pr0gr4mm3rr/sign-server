var orm = require('orm');
var config = require('../config');

var conn = null;

var connInfo = config.get('database');
if (!connInfo)
	throw new Error('No database configuration found in config.json');

var db = orm.connect('sqlite://' + connInfo.file);

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
		ordinality: { type: 'integer' }
	}, {
		key: true,
		autoFetch: true
	});

	db.sync();
}
