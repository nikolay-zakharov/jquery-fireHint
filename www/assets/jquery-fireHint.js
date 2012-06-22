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
			title: '- No title specified -',
			content: $(document.createTextNode('- No content specified -')),
			timings: { hide: 5000, fade: 50 },
			position: { minTop: 30, top: 30, left: 30 },
			auto_scroll_top: true,
			box_classes: [],
			title_classes: []
		};
		var config = $.extend(true, default_config, custom_config);





		// TODO: Неработающая версия. Коммит только для того, чтобы иметь возможность доделать с другого компьютера
		// TODO: Из задач: доделать функцию обхода элементов с составлением дерева элементов их позиций на странице
		// TODO: и порядку появления, и реализовать функцию поиска по этому дереву с учетом `z-index`
		/*var elements_map = {};
		(function(){// Mapping elements
			var g = {
				elem1: {
					parent: ,
					x: {
						min: 100,
						max: 340
					},
					y: {
						min: 150,
						max: 220
					},
					zIndex: 23
				}
			}*/

			/*// Comparison by zIndex is left only: comparison by accurance is automatically done because of recursion
			var make_all_children_structured = function(elem, parent){
				parent = Math.round(Math.random()*8999-(-1000));
				var compare_by_zIndex = function(properties){
					var uid = (new Date()).getTime()+'_'+(Math.round(Math.random()*8999-(-10000)));
				};
				$(elem).children().each(function(ind, elem){
					var current_element_properties = {
						height: $(elem).height(),
						width: $(elem).width(),
						pos: $(elem).position()
					};
					compare_by_zIndex(elem);
				});
			};
			make_all_children_structured($('body').children(':visible').not('.firehint-msg-box'));
		})();*/






		return this.each(function(ind, msg_box_blank_element){
			var msg_box_element = $(msg_box_blank_element)
				.clone()
				.appendTo(document.body)
				.data('uid', (new Date()).getTime()+'_'+(Math.round(Math.random()*8999-(-1000))));

			var current_box_interval = window.setTimeout(function(){ $(msg_box_element).fadeOut().remove(); }, config.timings.hide);
			if(typeof document.fireHint == 'undefined')
				document.fireHint = {
					intervals: {},
					boxes: {}
				};
			if(typeof document.fireHint.intervals[$(msg_box_element).data('uid')] != 'undefined'){
				window.clearInterval(document.fireHint.intervals[$(msg_box_element).data('uid')]);
				document.fireHint.intervals[$(msg_box_element).data('uid')] = undefined;
			}
			document.fireHint.intervals[$(msg_box_element).data('uid')] = current_box_interval;
			document.fireHint.boxes[$(msg_box_element).data('uid')] = true;

			console.log('boxes: ', document.fireHint.boxes);

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
				.data('last_element_behind', null)// Stores last element on the background having mouse focus
				.addClass('firehint-msg-box')
				.css({
					top: config.position.top+'px',
					left: config.position.left+'px'
				})// Implement custom css for messagebox
				/*.bind('click dblclick', function(evt){// Delegate click & double-click events to a background element
					evt.preventDefault();

					//var element_behind = get_element_behind(evt, this);

					// TODO: здесь тоже будет другая функция поиска элемента
					//get_element_by_pixel(evt.posX, evt.posY);

					$(element_behind).trigger(evt.type);
					if(evt.type == 'click' && element_behind.tagName == 'A' && typeof $(element_behind).attr('href') != 'undefined')
						document.location.href = $(element_behind).attr('href');
				})*/
				.bind('selectstart', function(evt){ evt.preventDefault(); })// Disables an ability to select text at msg box
				.bind('mouseenter', function(evt){ $(msg_box_element).animate({ opacity: 0.2 }, config.timings.fade); })
				.bind('mouseleave', function(evt){
					$(msg_box_element).animate({ opacity: 0.9 }, config.timings.fade);
					document.fireHint.boxes[$(msg_box_element).data('uid')] = undefined;
				})
				.bind('mousemove', function(evt){// Watches mouse movements to delegate mouseEnter and mouseLeave events
					// Detects whether mouse focus switched to another background element and runs appropriate triggers






					// TODO: здесь поиск элемента несколько другой будет
					/*var element_behind = get_element_by_pixel(evt.posX, evt.posY),
						last_element_behind = $(this).data('last_element_behind');
					if(last_element_behind != element_behind
							&& $(element_behind).parents('.firehint-msg-box').length==0
							&& $(last_element_behind).filter('.firehint-msg-box').length==0){
						$(last_element_behind).trigger('mouseleave');
						$(element_behind).trigger('mouseenter');
						$(this).data('last_element_behind', element_behind);
					}*/





				})
				.show();
		});
	}
})(jQuery);
