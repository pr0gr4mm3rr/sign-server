{% extends "layout.swig" %}

{% block scripts %}
  <script>
    var tasks = {{ tasks | json | safe }};

    $(document).ready(function() {
      $('#create').click(createTask);
      $('.edit').click(editTask);
      $('#save').click(saveTask);
    });

    function createTask() {
      // TODO our own dialog
      var name = prompt('Name for your task');

      // Tell the server to create an empty job
      $.post('/tasks/create', {
        name: name
      }).error(function onTaskCreateError(err) {
        // TODO better handle errors
        if (err.status >= 400)
          alert('Server responded with an error: ' + err.status);
        else
          alert('Unknown error while creating task, see console');

        console.log(err);
      }).done(function onTaskCreated(data) {
        if (data.error)
          return alert(data.error);

        if (data.success)
        // XXX?
          return location.reload();

          // Something wicked?
        alert(JSON.stringify(data, null, 4));
      });
    }

    function editTask(evt) {
      var id = $(this).attr('rel');
      // Find appropriate task
      var task;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
          task = tasks[i];
          break;
        }
      }
      if (!task) {
        evt.stopPropagation();
        return alert('Task edit with bad id: ' + id);
      }

        // Set values in modal
      populateModal(task);
      // The modal is shown from the button, no need to .show it here
    }

    function populateModal(task) {
      // Put the values in the boxes
      $('#task-edit-id').text(task.id);
      $('#task-name').val(task.name);
      $('#task-action').val(task.action);
      $('#task-value').val(task.value);
      $('#task-duration').val(task.duration);
    }

    function saveTask() {
      // Get values from modal
      var task = {};
      task.id = $('#task-edit-id').text();
      task.name = $('#task-name').val();
      task.action = $('#task-action').val();
      task.value = $('#task-value').val();
      task.duration = $('#task-duration').val();

      // POST to server
      $.post('/tasks/edit', task).done(function(res) {
        if (res.success) {
          //$('#edit-alert').addClass('alert-success').text(res.msg);
          setAlert('success', res.msg);
        }
      });
    }

    function setAlert(type, message) {
      $('#edit-alert')
      .removeClass('alert-success alert-error')
      .addClass('alert-' + type)
      .addClass('flash')
      .text(message)
      .one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function() {
        $('#edit-alert').removeClass('flash');
      })
    }
  </script>
{% endblock %}

{% block content %}

  <!-- Edit modal -->

  <div class="modal fade edit-modal" tabindex="-1" role="dialog" aria-labelledby="taskEditModal" data-backdrop="static">
    <div class="modal-dialog modal-lg" style="margin-top: 10em;">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Edit Task <span id="task-edit-id"></span></h4>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="task-name" class="control-label">Task Name:</label>
            <input type="text" class="form-control" id="task-name" placeholder="Widget Ad Video">
          </div>

          <div class="form-group">
            <label for="task-action" class="control-label">Task Action:</label>
            <input type="text" class="form-control" id="task-action" placeholder="video">
          </div>

          <div class="form-group">
            <label for="task-value" class="control-label">Task Value:</label>
            <input type="text" class="form-control" id="task-value" placeholder="https://youtube.com/?v=widget-advrt">
          </div>

          <div class="form-group">
            <label for="task-duration" class="control-label">Task Duration (seconds):</label>
            <input type="text" class="form-control" id="task-duration" placeholder="30">
          </div>
        </div>
        <div class="modal-footer">
          <span id="edit-alert" class="alert" role="alert" style="float:left"></span>
          <button type="button" class="btn btn-default" data-dismiss="modal">Close w/o Saving</button>
          <button type="button" class="btn btn-primary" id="save">Save</button>
        </div>
      </div>
    </div>
  </div>

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
            A
            <b>{{ task.action }}</b>
            with a value of
            <b>"{{ task.value }}"</b>
            that runs for
            <b>{{ task.duration }}</b>
            seconds
            <br/>
            <button class="btn btn-info edit" data-target=".edit-modal" data-toggle="modal" rel="{{ task.id }}">Edit</button>
          </div>
        </div>
      {% endfor %}
    </div>
  {% else %}
    <p>You don't have any tasks yet, create some!</p>
  {% endif %}
{% endblock %}
