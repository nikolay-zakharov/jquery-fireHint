<!DOCTYPE html />
<html><head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<script type="text/javascript" src="/assets/jquery-1.7.2.js"></script>

	<!-- fireHint -->
	<link rel="stylesheet" type="text/css" href="/assets/jquery-fireHint.css" />
	<script type="text/javascript" src="/assets/jquery-fireHint.js"></script>

	<!-- general -->
	<script type="text/javascript">
		$(document).ready(function(){
			$('table#tbl1 td').bind('mouseenter mouseleave', function(evt){
				$(this).css({
					'background-color': evt.type == 'mouseenter'
						? '#eee'
						: ''
				});
			});
		});

		function fire(){ $('#fire1').fireHint(); }

	</script>
</head><body>
	<div id="fire1" style="display: none;">
		<strong class="firehint-header">Hint box title</strong>
		<div class="firehint-content-body">
			Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
		</div>
	</div>
	<table id="tbl1" cellpadding="10" cellspacing="12" border="1" width="700px">
		<tbody>
		<tr>
			<td>fdsfasda dfsdfad sfasfasdfdsf asd fasd fasd fasd fads fasdf asd ffa</td>
			<td>rt ewrt ewrt ewrt wertw ertret wert wert ewrt wert wertewr t</td>
			<td>sdfa sdfsd fasd fdsf <a href="#go-first">dfsdfasdfsdafasdf</a> df <a href="#go-second">dsfsdfasdf</a> asd fasdf asdf asdf </td>
		</tr>
		</tbody>
	</table>
	<button onclick="fire();">Fire an event</button>
</body></html>