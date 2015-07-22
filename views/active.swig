{% extends "layout.swig" %}

{% block scripts %}
<script>
	$(document).ready(function() {
		$('.job-select-change').click(jobChange);

		smashButton();
	});

	// more XXX, see below
	function smashButton() {
		$('button .job-current').text(smash($('button .job-current').text()));
	}

	// XXX needs reconsideration
	function smash(text) {
		text = text.trim();
		var max = 30;
		if (text.length > max) {
			return text.slice(0, max) + '...';
		} else {
			return text;
		}
	}

	function jobChange() {
		var ele = $(this);

		var signID = ele.data('sign');
		var jobID = ele.data('job');

		$.post('/signs/' + signID + '/setjob', {
			job: jobID
		}, function(data) {
			console.log(data);
			if (data.success)
				$('.job-current').text(ele.text());

				smashButton();
		});
	};
</script>
{% endblock %}

{% block styles %}
<style>
	.job-select-button .caret {
		position: absolute;
		right: 8px;
		top: 50%;
		margin-top: -2px;
	}
</style>
{% endblock %}

{% block content %}
	<h1>Active signs</h1>
	{% if active.length %}
		<div class="e-container">
			{% for sign in active %}
			<div class="panel panel-info e-element active-sign">
				<div class="panel-heading">{{ sign.name }}</div>
				<div class="panel-body">
					Current job: <p class="job-current">{{ sign.job.name || "None" }}</p>
					<div class="dropdown job-select">
						<button class="btn btn-default dropdown-toggle job-select-button" type="button" data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="true" style="width: 100%">
							<span class="job-current">{{ sign.job.name || "No job selected" }}</span>
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu">
							<li class="job-select-change" data-sign="{{ sign.id }}" data-job="-1">
								<a href="javascript:void(0);">None</a>
							</li>
							{% for job in jobs %}
								<li class="job-select-change" data-sign="{{ sign.id }}" data-job="{{ job.id }}">
									<a href="javascript:void(0);">{{ job.name }}</a>
								</li>
							{% endfor %}
						</ul>
					</div>
				</div>
			{% endfor %}
		</div>
	{% else %}
		<p>Signs you have installed will appear here</p>
		<p>You can find instructions for installing signs <a href="/installing">in this location</a></p>
	{% endif %}
{% endblock %}
