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
			hideAnimation: 'slow'
		};

		return this.each(function(ind, elem) {
			//window.setTimeout(function(){ $(elem).hide(config.hideAnimation); }, 1500);

			var heading = $(document.createElement('strong')).html($(elem).data('title'));

			console.log(elem);
			$(elem)
				.bind('mouseenter', function(evt){
					$(evt.target).animate({ opacity: 0.2 }, 200);
				})
				.bind('mouseleave', function(evt){
					$(evt.target).animate({ opacity: 1 }, 200);
				})
				.prepend(heading)
				.addClass('firehint-msg-box')
				.show();
		});
	}
})(jQuery);
