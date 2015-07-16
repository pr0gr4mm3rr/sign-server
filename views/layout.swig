<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1" name="viewport">
<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta content="" name="description">
    <meta content="" name="author">
    <link href="../../favicon.ico" rel="icon">

    <title>{{ title }}</title>

<!-- Bootstrap core CSS -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">

<!-- Custom styles for this template -->
    <link href="/css/dashboard.css" rel="stylesheet">

<!-- sign-server styles -->
    <link href="/css/style.css" rel="stylesheet">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]> <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script> <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script> <![endif]-->
    <script src="/js/jquery.min.js"></script>
    <script>
      // Highlight current page
      var page = '{{ page or '?' }}';
      $(document).ready(function() {
        if (page !== '?')
          $('#nav-' + page).addClass('active');
      });
    </script>
    {% block scripts %}

    {% endblock %}
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      {% block topnav %}
      <div class="container-fluid">
        <div class="navbar-header">
          <button aria-controls="navbar" aria-expanded="false" class="navbar-toggle collapsed" data-target="#navbar" data-toggle="collapse" type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">{{ title }}</a>
        </div>
        <div class="navbar-collapse collapse" id="navbar">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <a href="#">Dashboard</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
            <li>
              <a href="#">Profile</a>
            </li>
            {#<li><a href="#">Help</a></li>#}
          </ul>
        </div>
      </div>
      {% endblock %}
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          {% block sidenav %}
          <ul class="nav nav-sidebar">
            <li id="nav-index">
              <a href="/">Overview</a>
            </li>

            <li id="nav-active">
              <a href="/signs">
                <span class="badge">{{ active.length or 0 }}</span>
                Active signs
              </a>
            </li>

            <li id="nav-pending">
              <a href="/pending">
                <span class="badge">{{ pending.length or 0 }}</span>
                Pending signs
              </a>
            </li>

            <li id="nav-jobs">
              <a href="/jobs">
                Jobs
              </a>
            </li>

            <li id="nav-tasks">
              <a href="/tasks">
                Tasks
              </a>
            </li>
          </ul>
          {% endblock %}
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
          {% block content %}
          {% endblock %}
        </div>
      </div>
    </div>

<!-- Bootstrap core JavaScript
    ================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
    <script src="/js/bootstrap.min.js"></script>
  </body>
</html>
