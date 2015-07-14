{% extends "layout.swig" %}

{% block content %}
  <h1 style="display: inline-block">Tasks</h1>
  <button class="btn btn-success" id="create" style="margin-top: -10px; margin-left: 10px;">
    <span class="glyphicon glyphicon-plus"></span>
    Create
  </button>

  {% if tasks.length %}
    <div class="e-container tasks">
      {% for task in tasks %}
        <div class="panel panel-info e-element task">
          <div class="panel-heading">{{ task.name }}</div>
          <div class="panel-body">
            {# TODO add more info, make nicer #}
            A <b>{{ task.action }}</b> with a value of <b>"{{ task.value }}"</b> that runs for <b>{{ task.duration }}</b> seconds
          </div>
        </div>
      {% endfor %}
    </div>
  {% else %}
    <p>You don't have any tasks yet, create some!</p>
  {% endif %}
{% endblock %}
