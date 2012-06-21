/*!
 * FireHint plugin for jQuery
 * http://github.com/firehint/
 *
 * Copyright 2012, Nikolay Zakharov <nickolay.zakharov@gmail.com>
 * Date: Thu June 28 21:44:17 2012 +0400
 */

(function($) {
	$.fn.fireHint = function(config) {

		var config = {
			times: 50,
			css: {
				top: '30px',
				left: '350px'
			}
		};

		return this.each(function(ind, elem) {
			//window.setTimeout(function(){ $(elem).hide(config.hideAnimation); }, 1500);

			$(elem)
				.css(config.css)
				.bind('click dblclick mouseenter mouseleave mouseover mouseout', function(evt){
					evt.preventDefault();
					$(this).hide();
					var elementBehind = document.elementFromPoint(evt.pageX, evt.pageY);
					$(this).show();

					$(elementBehind).trigger(evt.type);
					if(evt.type == 'click' && elementBehind.tagName == 'A' && typeof $(elementBehind).attr('href') != 'undefined')
						document.location.href = $(elementBehind).attr('href');
				})
				.bind('selectstart', function(evt){
					evt.preventDefault();
				})
				.bind('mouseenter', function(evt){
					$(evt.target).animate({ opacity: 0.2 }, config.times);
				})
				.bind('mouseleave', function(evt){
					$(evt.target).animate({ opacity: 0.9 }, config.times);
				})
				.addClass('firehint-msg-box')
				.show();
		});
	}
})(jQuery);
