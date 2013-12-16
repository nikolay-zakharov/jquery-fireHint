/*!
 * FireHint plugin for jQuery
 * https://github.com/nikolay-zakharov/jquery-fireHint
 *
 * Copyright 2012, Nikolay Zakharov <nickolay.zakharov@gmail.com>
 * Date: Thu June 28 21:44:17 2012 +0400
 */

(function($) {
	var hints=[],
		defaultConfig = {
			elements: {
				header: [],
				body: []
			},
			timeout: 10,
			padding: 18,
			position: 'tr',
			css: {
				'.firehint-message': {},
				'.firehint-message-header': {},
				'.firehint-message-body': {}
			},
			events: {
				'.firehint-message': {
					selectstart: function(evt){ evt.preventDefault(); }
				}
			}
		};
	
	var redrawTimeout;
	
	$.fireHint = function(config) {
		var config = $.extend(true, null, defaultConfig, config);

		var reorganizeHints = function(){
			var topCurrent = $(document).scrollTop();

			$(hints).finish().css({left:0});
			
			for(var ind=1; ind<=hints.length; ind++){
				var leftCurrent = $(window).width()-$(hints[hints.length-ind]).width() - 30;

				$(hints[hints.length-ind]).css({zIndex:10000-ind}).animate({position:'absolute', top:topCurrent+'px', left:leftCurrent+'px'});

				topCurrent += $(hints[hints.length-ind]).height()+config.padding;
			}
		};
		
		$(window).on('resize', function(evt){
			reorganizeHints();
		});
		$(document).on('scroll', function(evt){
			if(typeof redrawTimeout != 'undefined')
				window.clearTimeout(redrawTimeout);
			
			redrawTimeout=window.setTimeout(function(){
				reorganizeHints();
			}, 300);
		});

		var currentHint = $(document.createElement('div')).addClass('firehint-message').css({opacity:0.9}).append([
			$(document.createElement('div')).addClass('firehint-message-header').append(config.elements.header),
			$(document.createElement('div')).addClass('firehint-message-body').append(config.elements.body)
		]);
		
		// Overloading css
		Object.keys(config.css).forEach(function(xpath){
			(currentHint.is(xpath) ? currentHint : currentHint.find(xpath)).css(config.css[xpath]);
		});
		
		// Binding events
		Object.keys(config.events).forEach(function(xpath){
			Object.keys(config.events[xpath]).forEach(function(eventName){
				(currentHint.is(xpath) ? currentHint : currentHint.find(xpath))
					.on(eventName, config.events[xpath][eventName]);
			});
		});

		// Run hint
		hints.push(currentHint);
		$('body').append(currentHint);
		reorganizeHints();

		// Close hint on timeout
		window.setTimeout(function(){
			hints = hints.filter(function(item){
				if(item==currentHint){
					$(currentHint).remove();
					return false;
				}else
					return true;
			});
			reorganizeHints();
		}, config.timeout*1000);
	}
})(jQuery);
