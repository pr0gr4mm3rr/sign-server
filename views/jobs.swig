{% extends "layout.swig" %}

{% block scripts %}
  <script>
    $(document).ready(function() {
      $('#create').click(create);
      $('.task-add').click(addTask)
    });

    function create() {
      // TODO our own dialog
      var name = prompt('Name for your job');

      // Tell the server to create an empty job
      $.post('/jobs/create', {
        name: name
      }).error(function onJobCreateError(err) {
        // TODO better handle errors
        if (err.status >= 400)
          alert('Server responded with an error: ' + err.status);
        else
          alert('Unknown error while creating job, see console');

        console.log(err);
      }).done(function onJobCreated(data) {
        if (data.error)
          return alert(data.error);

        if (data.success)
          // XXX?
          return location.reload();

        // Something wicked?
        alert(JSON.stringify(data, null, 4));
      });
    }

    function addTask() {
      var jobID = $(this).attr('rel');
      alert('would add to ' + jobID);
    }
  </script>
{% endblock %}

{% block content %}
  <h1 style="display: inline-block">Jobs</h1>

  <button class="btn btn-success" id="create" style="margin-top: -10px; margin-left: 10px;">
    <span class="glyphicon glyphicon-plus"></span>
    Create
  </button>

  {% if jobs.length %}
    <div class="e-container jobs">
      {% for job in jobs %}
        <div class="panel panel-info e-element job">
          <div class="panel-heading">{{ job.name }}</div>
          <div class="panel-body">
            {% if job.tasks.length or 1 %}
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {% for task in job.tasks %}
                    <tr>
                      <td>{{ task.ordinality }}</td>
                      <td>{{ task.name }}</td>
                      <td>{{ task.action }}</td>
                    </tr>
                  {% endfor %}
                </tbody>
              </table>
            {% else %}
              <p>Job is empty</p>
            {% endif %}

            <button class="btn btn-sm btn-success task-add" rel="{{ job.id }}">
              <span class="glyphicon glyphicon-plus"></span>
              Add Task
            </button>
          </div>
        </div>
      {% endfor %}
    </div>
  {% else %}
    <p>You don't have any jobs yet, make some!</p>
  {% endif %}
{% endblock %}
