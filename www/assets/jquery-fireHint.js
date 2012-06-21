/*!
 * FireHint plugin for jQuery
 * http://github.com/firehint/
 *
 * Copyright 2012, Nikolay Zakharov <nickolay.zakharov@gmail.com>
 * Date: Thu June 28 21:44:17 2012 +0400
 */

(function($) {
	$.fn.fireHint = function(custom_config) {

		var default_config = {
			timings: {
				hide: 3000,
				fade: 50
			},
			position: {
				top: 30,
				left: 350
			}
		};
		var config = $.extend(true, default_config, custom_config);

		function get_element_behind(evt, current_element){
			$(current_element).hide();
			var elementBehind = document.elementFromPoint(evt.pageX, evt.pageY);
			$(current_element).show();
			return elementBehind;
		}

		return this.each(function(ind, msg_box_blank_element) {
			var msg_box_element = $(msg_box_blank_element)
				.clone()
				.appendTo(document.body)
				.data('uid', (new Date()).getTime()+'_'+(Math.round(Math.random()*8999-(-1000))));

			var current_box_interval = window.setTimeout(function(){ $(msg_box_element).fadeOut().remove(); }, config.timings.hide);
			if(typeof document.fireHint == 'undefined')
				document.fireHint = {
					intervals: {}
				};
			if(typeof document.fireHint.intervals[$(msg_box_element).data('uid')] != 'undefined'){
				window.clearInterval(document.fireHint.intervals[$(msg_box_element).data('uid')]);
				document.fireHint.intervals[$(msg_box_element).data('uid')] = undefined;
			}
			document.fireHint.intervals[$(msg_box_element).data('uid')] = current_box_interval;

			$(msg_box_element)
				.css({ opacity: 0.9 })
				.data('last_element_behind', null)// Stores last element on the background having mouse focus
				.addClass('firehint-msg-box')
				.css({
					top: config.position.top+'px',
					left: config.position.left+'px'
				})// Implement custom css for messagebox
				.bind('click dblclick', function(evt){// Delegate click & double-click events to a background element
					evt.preventDefault();
					var element_behind = get_element_behind(evt, this);
					$(element_behind).trigger(evt.type);
					if(evt.type == 'click' && element_behind.tagName == 'A' && typeof $(element_behind).attr('href') != 'undefined')
						document.location.href = $(element_behind).attr('href');
				})
				.bind('selectstart', function(evt){ evt.preventDefault(); })// Disables an ability to select text at msg box
				.bind('mouseenter', function(evt){ $(evt.target).animate({ opacity: 0.2 }, config.timings.fade); })
				.bind('mouseleave', function(evt){ $(evt.target).animate({ opacity: 0.9 }, config.timings.fade); })
				.bind('mousemove', function(evt){// Watches mouse movements to delegate mouseEnter and mouseLeave events
					// Detects whether mouse focus switched to another background element and runs appropriate triggers
					var element_behind = get_element_behind(evt, this),
						last_element_behind = $(this).data('last_element_behind');
					if(last_element_behind != element_behind
							&& $(element_behind).parents('.firehint-msg-box').length==0
							&& $(last_element_behind).filter('.firehint-msg-box').length==0){
						$(last_element_behind).trigger('mouseleave');
						$(element_behind).trigger('mouseenter');
						$(this).data('last_element_behind', element_behind);
					}
				})
				.show();
		});
	}
})(jQuery);
