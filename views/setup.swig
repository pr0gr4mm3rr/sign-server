{% extends "layout.swig" %}

{% block content %}
<div class="panel panel-primary">
	<div class="panel-heading">
		Setup for "{{ sign.name }}"
	</div>
	<div class="panel-body">
		<form method="POST">
			<div class="form-group">
				<label for="sign-name">Sign Name</label>
				<input type="text" name="name" class="form-control" id="sign-name" placeholder="Front Office Sign">
			</div>

			<button type="submit" class="btn btn-primary">Perform Setup</button>
		</form>
	</div>
</div>
{% endblock %}