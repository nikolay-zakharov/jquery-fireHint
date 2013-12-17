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
			css: {},
			events: {}
		};
	
	var redrawTimeout;
	
	$.fireHint = function(config) {
		var config = $.extend(true, null, defaultConfig, config);

		var reorganizeHints = function(){
			var topCurrent = $(document).scrollTop()+4;
			
			$(hints).finish().css({left:0});
			
			for(var ind=1; ind<=hints.length; ind++){
				var leftCurrent = $(window).width()-$(hints[hints.length-ind]).width() - 30;

				$(hints[hints.length-ind]).css({zIndex:10000-ind}).animate({position:'absolute', top:topCurrent+'px', left:leftCurrent+'px'});
				topCurrent += $(hints[hints.length-ind]).height()+config.padding;
			}
		};

		var closeHint = function(hint){
			hints = hints.filter(function(item){
				if(item==hint)
					$(hint).remove();

				return item!=hint;
			});
			reorganizeHints();
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
		]),
			currentHint_timeout = null;
		
		currentHint.on('close',function(evt){ closeHint(currentHint); });
		currentHint.on('pushpin',function(evt){ if(currentHint_timeout != null) window.clearTimeout(currentHint_timeout); });
		
		$('.firehint-message-close', currentHint).on('click', function(){ closeHint(currentHint); });

		// Run hint
		hints.push(currentHint);
		$('body').append(currentHint);

		// Overloading css
		Object.keys(config.css).forEach(function(xpath){
			currentHint.parents(':first').find(xpath).filter(function(ind,item){ return $(item).closest(currentHint).length>0; })
				.css(config.css[xpath]);
		});

		// Binding events
		Object.keys(config.events).forEach(function(xpath){
			Object.keys(config.events[xpath]).forEach(function(eventName){
				currentHint.parents(':first').find(xpath).filter(function(ind,item){ return $(item).closest(currentHint).length>0; })
					.on(eventName, config.events[xpath][eventName]);
			});
		});
		
		reorganizeHints();

		// Close hint on timeout
		if(config.timeout>0)
			currentHint_timeout = window.setTimeout(function(){ closeHint(currentHint); }, config.timeout*1000);
	}
})(jQuery);
