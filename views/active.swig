{% extends "layout.swig" %}

{% block content %}
	<h1>Active signs</h1>
	{% if active.length %}
		<p>TODO Put active signs here</p>
	{% else %}
		<p>Signs you have installed will appear here</p>
		<p>You can find instructions for installing signs <a href="/installing">in this location</a></p>
	{% endif %}
{% endblock %}