/*!
 * FireHint plugin for jQuery
 * https://github.com/nikolay-zakharov/jquery-fireHint
 *
 * Copyright 2012, Nikolay Zakharov <nickolay.zakharov@gmail.com>
 * Date: Thu June 28 21:44:17 2012 +0400
 */

(function($) {
	$.fn.fireHint = function(custom_config) {

		var default_config = {
			title: '- No title specified -',
			content: $(document.createTextNode('- No content specified -')),
			timings: { hide: 5000, fade: 50 },
			position: { minTop: 50, top: 30, left: 30 },
			box_padding: 30,
			box_hor_padding: 10,
			box_width: 352,
			direction: 'right',
			rows: 3,
			auto_scroll_top: true,
			box_classes: [],
			title_classes: []
		};
		var config = $.extend(true, default_config, custom_config);

		return this.each(function(ind, msg_box_blank_element){
			var msg_box_element = $(msg_box_blank_element)
				.clone()
				.appendTo(document.body)
				.data('uid', (new Date()).getTime()+'_'+(Math.round(Math.random()*8999-(-1000))));

			var current_box_interval = window.setTimeout(function(){
				var row_to_scroll = $(msg_box_element).data('row_index'),
					height_to_scroll = $(document.fireHint.rows[row_to_scroll].message_boxes[$(msg_box_element).data('uid')]).height(),
					min_top_to_scroll = $(document.fireHint.rows[row_to_scroll].message_boxes[$(msg_box_element).data('uid')]).position().top;

				// TODO: не совсем чистое удаление
				var current_message_box_height = $(msg_box_element).height();
				document.fireHint.rows[row_ind].free -= -(config.box_padding - (- current_message_box_height));
				document.fireHint.rows[row_ind].occupied -= (current_message_box_height - (- config.box_padding));
				document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes[$(msg_box_element).data('uid')] = undefined;

				// TODO: scroll top
				for(var uid in document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes){
					var some_message_box = document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes[uid];
					if(typeof some_message_box != 'undefined'){
						some_message_box.animate({
							top: $(some_message_box).position().top - (config.box_padding - (- current_message_box_height))
						}, 300);
					}
				}

				$(msg_box_element).fadeOut().remove();
			}, config.timings.hide);

			if(typeof document.fireHint == 'undefined')
				document.fireHint = {
					intervals: {},
					rows: {}
				};
			if(typeof document.fireHint.intervals[$(msg_box_element).data('uid')] != 'undefined'){
				window.clearTimeout(document.fireHint.intervals[$(msg_box_element).data('uid')]);
				document.fireHint.intervals[$(msg_box_element).data('uid')] = undefined;
			}
			document.fireHint.intervals[$(msg_box_element).data('uid')] = current_box_interval;

			for(var row_ind=1; row_ind<=config.rows; row_ind++){
				if(typeof document.fireHint.rows[row_ind] == 'undefined'){
					document.fireHint.rows[row_ind] = {
						free: $(window).height() - config.position.minTop,
						occupied: 0,
						message_boxes: {}
					};
				}
			}

			$.each(config.content, function(content_ind, content_item){
				$(msg_box_element).find('.firehint-content-body').append(content_item);
			});

			if(config.box_classes.length > 0)
				$.each(config.box_classes, function(add_class_ind, add_class_item){ $(msg_box_element).addClass(add_class_item); });
			if(config.title_classes.length > 0)
				$.each(config.title_classes, function(add_class_ind, add_class_item){ $(msg_box_element).find('.firehint-header').addClass(add_class_item); });

			$(msg_box_element)
				.find('.firehint-header').html(config.title).end()
				.css({ opacity: 0.9 })
				.addClass('firehint-msg-box')
				.css({
					top: config.position.top+'px',
					left: config.position.left+'px'
				})
				.bind('selectstart', function(evt){ evt.preventDefault(); })// Disables an ability to select text at msg box
				.bind('mouseenter', function(evt){ $(msg_box_element).animate({ opacity: 0.2 }, config.timings.fade); })
				.bind('mouseleave', function(evt){ $(msg_box_element).animate({ opacity: 0.9 }, config.timings.fade); })
				.show();

			var current_message_box_height = $(msg_box_element).height();
			for(var row_ind=1; row_ind<=config.rows; row_ind++){
				if(document.fireHint.rows[row_ind].free >= current_message_box_height - (- config.box_padding)){
					$(msg_box_element).data('row_index', row_ind);

					$(msg_box_element).css({
						top: (config.position.minTop - (- document.fireHint.rows[row_ind].occupied)) +'px',
						left: ($(window).width() - (row_ind)*config.box_width - config.box_hor_padding - 10) +'px'
					});

					document.fireHint.rows[row_ind].free -= current_message_box_height - (- config.box_padding);
					document.fireHint.rows[row_ind].occupied -= - config.box_padding - current_message_box_height;

					document.fireHint.rows[row_ind].message_boxes[$(msg_box_element).data('uid')] = msg_box_element;
					break;
				}
			}
		});
	}
})(jQuery);
