{% extends "layout.swig" %}

{% block content %}
<h1>Pending Sign Setups</h1>
<p>You should see the names below on the sign, please match it correctly</p>

{% if pending.length %}
{% for sign in pending %}
<div class="col-md-3">
  <div class="panel panel-info">
    <div class="panel-heading">{{ sign.name }}</div>
    <div class="panel-body">
      <button type="button" class="btn btn-primary">Setup</button>
    </div>
  </div>
</div>
{% endfor %}
{% else %}
<p>There are no pending sign installs</p>
<p>If there should be, try refreshing the page</p>
{% endif %}
{% endblock %}
