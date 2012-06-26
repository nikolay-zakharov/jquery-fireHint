/*!
 * FireHint plugin for jQuery
 * http://github.com/firehint/
 *
 * Copyright 2012, Nikolay Zakharov <nickolay.zakharov@gmail.com>
 * Date: Thu June 28 21:44:17 2012 +0400
 */

(function($) {
	$.fn.fireHint = function(custom_config) {

		// Default configuration
		var default_config = {
			elements: {
				header: [],
				body: []
			},
			timeouts: {
				hide: 5000,
				slide: 300,
				fade: 70
			},
			rows: {
				count: 2,
				position: 'tr',
				minTop: 20,
				maxTop: 20
			},
			cells: {
				margins: {
					vertical: 30,
					horizontal: 20
				},
				width: 352
			},
			additionalClasses: {
				'.firehint-msg-box': [],
				'.firehint-header': [],
				'.firehint-content-body': []
			},
			bindings: {
				'.firehint-msg-box': {
					selectstart: function(evt){ evt.preventDefault(); },
					mouseenter: function(evt){ $(evt.target).animate(config.css_states.hover, config.timeouts.fade); },
					mouseleave: function(evt){ $(evt.target).animate(config.css_states.general, config.timeouts.fade); }
				},
				'.firehint-infadable': {
					mouseenter: function(evt){ $(evt.target).parents('.firehint-msg-box:first').trigger('mouseleave'); },
					mouseleave: function(evt){ $(evt.target).parents('.firehint-msg-box:first').trigger('mouseenter'); }
				}
			},
			css_states: {
				general: { opacity: 0.9 },
				hover: { opacity: 0.2 }
			}
		};
		var config = $.extend(true, null, default_config, custom_config);

		// Running plugin
		return this.each(function(ind, msg_box_blank_element){
			var msg_box_unique_id = (new Date()).getTime()+'_'+(Math.round(Math.random()*8999-(-1000)));
			var msg_box_element = $(msg_box_blank_element).clone().appendTo(document.body).data('uid', msg_box_unique_id);

			// Setting timeout for message box to hide
			var current_box_interval = window.setTimeout(function(){
				var current_message_box_height = $(msg_box_element).height();

				// Tells about freed space
				document.fireHint.rows[row_ind].free -= -(config.cells.margins.vertical - (- current_message_box_height));
				document.fireHint.rows[row_ind].occupied -= (current_message_box_height - (- config.cells.margins.vertical));
				document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes[msg_box_unique_id] = undefined;

				// Slide top (or bottom) other message boxes inside current row
				if(typeof config.timeouts.slide == 'number' && config.timeouts.slide > 0){
					for(var uid in document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes){
						var some_message_box = document.fireHint.rows[$(msg_box_element).data('row_index')].message_boxes[uid];
						if(typeof some_message_box != 'undefined'){
							some_message_box.animate({
								top: $(some_message_box).position().top - (config.cells.margins.vertical - (- current_message_box_height))
							}, config.timeouts.slide);
						}
					}
				}

				$(msg_box_element).fadeOut().remove();
			}, config.timeouts.hide);

			// Technical data, being used by timeout callback function
			if(typeof document.fireHint == 'undefined'){ document.fireHint = { active_timeouts: {}, rows: {} }; }
			if(typeof document.fireHint.active_timeouts[msg_box_unique_id] != 'undefined'){
				window.clearTimeout(document.fireHint.active_timeouts[msg_box_unique_id]);
				document.fireHint.active_timeouts[msg_box_unique_id] = undefined;
			}
			document.fireHint.active_timeouts[msg_box_unique_id] = current_box_interval;

			// Technical data, being used on looking for place for a message boxes
			for(var row_ind=1; row_ind<=config.rows.count; row_ind++){
				if(typeof document.fireHint.rows[row_ind] == 'undefined'){
					document.fireHint.rows[row_ind] = {
						free: $(window).height() - config.rows.minTop,
						occupied: 0,
						message_boxes: {}
					};
				}
			}

			// Applies additional classes and appends header and body elements
			$.each(config.elements.header, function(header_ind, header_item){ $('.firehint-header', msg_box_element).append(header_item); });
			$.each(config.elements.body, function(body_ind, body_item){ $('.firehint-content-body', msg_box_element).append(body_item); });
			$.each(config.additionalClasses, function(element_mask, classes_list){
				$(msg_box_element)
					.filter(element_mask).addClass( classes_list.join(' ')).end()
					.find(element_mask).addClass( classes_list.join(' ') );
			});

			// Applying general style for a message box
			$(msg_box_element).css(config.css_states.general)

			// Binding callbacks
			$.each(config.bindings, function(element_mask, bindings_list){
				$.each(bindings_list, function(event_name, callback_func){
					$(msg_box_element)
						.filter(element_mask).bind(event_name, callback_func).end()
						.find(element_mask).bind(event_name, callback_func);
				});
			});

			// Looking for a place for current message box
			var current_message_box_height = $(msg_box_element).height();
			for(var row_ind=1; row_ind<=config.rows.count; row_ind++){
				if(document.fireHint.rows[row_ind].free >= current_message_box_height - (- config.cells.margins.vertical)){
					$(msg_box_element).data('row_index', row_ind);

					$(msg_box_element).css({
						top: (config.rows.minTop - (- document.fireHint.rows[row_ind].occupied)) +'px',
						left: ($(window).width() - (row_ind)*config.cells.width - config.cells.margins.horizontal) +'px'
					}).show();

					document.fireHint.rows[row_ind].free -= current_message_box_height - (- config.cells.margins.vertical);
					document.fireHint.rows[row_ind].occupied -= - config.cells.margins.vertical - current_message_box_height;
					document.fireHint.rows[row_ind].message_boxes[msg_box_unique_id] = msg_box_element;
					break;
				}
			}
			if($(msg_box_element).filter(':visible').length == 0){
				console.log('NO_SPACE_FOR_A_MESSAGE_BOX')
			}
		});
	}
})(jQuery);
