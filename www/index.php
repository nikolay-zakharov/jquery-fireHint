<!DOCTYPE html />
<html><head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<script type="text/javascript" src="/assets/jquery-1.7.2.js"></script>

	<!-- fireHint -->
	<link rel="stylesheet" type="text/css" href="/assets/jquery-fireHint.css" />
	<script type="text/javascript" src="/assets/jquery-fireHint.js"></script>

	<!-- general -->
	<script type="text/javascript">

		function fire(){
			$('#fire1').fireHint();
		}

	</script>
</head><body>
	<div id="fire1" data-title="Title for a box" style="display: none;">
		<div class="firehint-content-body">
			Dialog box Content
		</div>
	</div>

	<button onclick="fire();">Fire an event</button>
</body></html>