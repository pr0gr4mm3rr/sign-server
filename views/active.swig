{% extends "layout.swig" %}

{% block content %}
	<h1>Active signs</h1>
	{% if active.length %}
		<div class="e-container">
			{% for sign in active %}
			<div class="panel panel-info e-element active-sign">
				<div class="panel-heading">{{ sign.name }}</div>
				<div class="panel-body">
					Current job: {{ sign.job.name || "None!" }}
					<div class="dropdown job-select">
						<button class="btn btn-default dropdown-toggle job-select-button" type="button" data-toggle="dropdown"
							aria-haspopup="true" aria-expanded="true">
							{{ sign.job.name || "No job selected" }}
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu">
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
