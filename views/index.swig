{% extends "layout.swig" %}

{% block scripts %}
  <script src="/js/network.js"></script>
{% endblock %}

{% block content %}
  <header>
    <h1 class="page-header">Dashboard</h1>

    {% if pending.length %}
      <h2 class="sub-header">We have pending signs</h2>
      {% for sign in pending %}
        <div class="col-sm-4">
          <p>{{ sign.name }}</p>
        </div>
      {% endfor %}
    {% endif %}
{% endblock %}
