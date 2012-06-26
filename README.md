jquery-fireHint
===============

FireHint plugin for jQuery

## About

This plugin provides an ability to easily add hints in style Ubuntu notifications use.
So, the goal appearance and functionality are similar to:

![Goal Appearance & Functionality](http://www.pixentral.com/pics/12wjm5iywILD8oN9Aq61cXIi8zbOEV1.png)

Configuring `elements.body` you can add `.firehint-infadable` class to some key elements of the message-box so `MouseEnter` on them will bring the notification box active. It might be helpfull in some cases.
Also in the nearest future this plugin will be able to transparently delegate `Click`, `DoubleClick` or even `MouseEnter`, `MouseLeave` etc events to the DOM Objects under the message-box.

## API

### Config Options
	{
		elements: {
			header: [],// DOM Objects you provide here will be placed inside `.firehint-header` element
			body: []// That is the main elements you must specify. It accepts a list of DOM Objects and places them into the message body
		},
		timeouts: {
			hide: 5000,// Message-box is visible for.
			slide: 300,// Slide animation duration. When set to not a number, or just less or equal to 0 then there's no sliding at all (not bug, feature)
			fade: 70// Duration of fading out after `timeouts.hide` milliseconds
		},
		rows: {// These are the sets that define a row of cells
			count: 2,// Rows you prefer to use
			position: 'tr',
			minTop: 20,// Affects when `rows.position` is `tr` or `tl`
			maxTop: 20// Affects when `rows.position` is `br` or `bl`
		},
		cells: {// Here are the sets that describe each message-box's appearance
			margins: {
				vertical: 30,// Vertical space between message-boxes
				horizontal: 20// Horizontal space between message-boxes
			},
			width: 352// Width of the box
		},
		additionalClasses: {// You are able to assign custom classes to any DOM Object inside main message-box (`.firehint-msg-box`) or to its own
			'.firehint-msg-box': [],
			'.firehint-header': [],
			'.firehint-content-body': []
		},
		bindings: {// Object mask as a Key and object as a Value. This object (Value) has event name as a Key and `function(Event){...}` as a Value. You are able to bind any behaviour to any DOM Object inside main message-box (`.firehint-msg-box`) or to its own
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
		css_states: {// Two elements only describing both states. Each of them provides set of CSS styles that would be accepted by jQuery's `.css()` method. It will be implemented to the main DOM Object of message-box (`.firehint-msg-box`)
			general: { opacity: 0.9 },
			hover: { opacity: 0.2 }
		}
	}

### Methods
This plugin provides no methods. It just for showing notification for a time. (For now, at least)

### Events
You are able to handle any events of any object inside main message-box or of its own. This way you're able to set any callbacks you need with `bindings` parameter
