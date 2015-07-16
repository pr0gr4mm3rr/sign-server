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
      // Fetch list of tasks
      $.getJSON('/tasks/json', function(tasks) {
        // Populate task selection modal
        var list = $('#task-select-list tbody');
        list.empty();
        tasks.forEach(function(task) {
          var row = tmpl('task_row', task);
          console.log(row);
          list.append($(row));
        });
      });
    }
  </script>

  <script id="task_row" type="text/html">
    <tr>
      <td><%=id%></td>
      <td><%=name%></td>
      <td>
        <button class="btn btn-default">Add</button>
      </td>
    </tr>
  </script>
{% endblock %}

{% block content %}
  <!-- Task add modal -->
  <div class="modal fade add-modal" tabindex="-1" role="dialog" aria-labelledby="taskEditModal" data-backdrop="static">
    <div class="modal-dialog modal-lg" style="margin-top: 10em;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Add Tasks to Job <span id="job-add-id"></span></h4>
        </div>
        <div class="modal-body">
          <table id="task-select-list" class="table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task name</th>
                <th>Add to job</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <span id="edit-alert" class="alert" role="alert" style="float:left"></span>
          <button type="button" class="btn btn-default" data-dismiss="modal">Close w/o Saving</button>
          <button type="button" class="btn btn-primary" id="save">Save</button>
        </div>
      </div>
    </div>
  </div>

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

            <button class="btn btn-sm btn-success task-add" data-target=".add-modal" data-toggle="modal" rel="{{ job.id }}">
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
