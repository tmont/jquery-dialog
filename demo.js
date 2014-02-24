(function(window) {
	var defaults = {
		body: 'oh hai mark!',
		title: 'Just a little dialog',
		show: true,
		onShowing: function(callback) {
			$('.dialog-container').dialog('hide');
			callback();
		}
	};

	var examples = {
		boring: {
			name: 'Default dialog'
		},
		'no-title': {
			name: 'No title',
			options: { title: '' }
		},
		'no-close-x': {
			name: 'No close "X" (press ESC to close)',
			options: { closeX: false }
		},
		'no-header': {
			name: 'No header (press ESC to close)',
			options: { closeX: false, title: null }
		},
		dimensions: {
			name: 'With custom dimensions',
			options: { width: 300, height: 500 }
		},
		'fixed-dimensions': {
			name: 'With fixed dimensions (width instead of min-width)',
			options: { width: 300, height: 500, fixedDimensions: true }
		},
		'static': {
			name: 'Won\'t move around when you resize the window',
			options: { dynamic: false }
		},
		position: {
			name: 'With specific positioning',
			options: { position: { top: 50, left: 100 } }
		},
		'position-top-only': {
			name: 'With specific positioning on one axis',
			options: { position: { left: 50 } }
		},
		'position-static': {
			name: 'Non-dynamic specific position',
			options: { dynamic: false, position: { top: 50 } }
		},
		'no-escape': {
			name: 'Don\'t close dialog on ESC',
			options: { closeOnEscape: false }
		},
		modal: {
			name: 'Modal',
			options: { modal: true }
		},
		'modal-no-fade': {
			name: 'Modal without mask animation',
			options: { modal: true, transitionMask: false }
		},
		'modal-no-mask-click': {
			name: 'Modal, don\'t close when you click on the mask',
			options: { modal: true, closeOnMaskClick: false }
		},
		'footer-html': {
			name: 'Footer with HTML',
			options: {
				footer: '<button class="dialog-button" data-dialog-action="hide">Close</button>'
			}
		},
		'allow-background-scrolling': {
			name: 'Background scrolling with modal',
			options: { modal: true, allowScrolling: true }
		},
		'long-modal': {
			name: 'Modal with really long content',
			options: { modal: true, height: 2000, dynamic: false }
		}
	};

	var $ul = $('<ul/>').attr('id', 'examples').appendTo('body');
	for (var id in examples) {
		var data = examples[id],
			options = $.extend({}, defaults, data.options || {}),
			code = '$("#' + id + '").click(function() {\n' +
				'  $.dialog(' + JSON.stringify(options, null, 2).replace(/\n/g, '\n  ') + ');\n' +
				'});';

		$('<li/>')
			.append($('<h2/>').text(data.name).append($('<button/>')
				.attr('id', id)
				.text('Launch dialog')))
			.append($('<pre/>').addClass('sunlight-highlight-javascript').text(code))
			.appendTo($ul);

		$('#' + id).click((function(options) {
			return function() {
				$.dialog(options);
			};
		}(options)));
	}

	function theCode() {
		$('#stacked').click(function() {
			$.dialog({
				title: 'Dialog #1',
				show: true,
				modal: true,
				width: 500,
				height: 500,
				footer: $('<div/>')
					.addClass('dialog-button')
					.attr('data-dialog-action', 'hide')
					.text('Close'),
				body: $('<button/>').text('Launch another dialog').click(function() {
					$.dialog({
						title: 'Dialog #2',
						show: true,
						modal: true,
						width: 400,
						height: 400,
						footer: $('<div/>')
							.addClass('dialog-button')
							.attr('data-dialog-action', 'hide')
							.text('Close'),
						body: $('<button/>').text('Launch yet another dialog').click(function() {
							$.dialog({
								title: 'Dialog #3',
								width: 300,
								height: 300,
								show: true,
								modal: true,
								body: 'Oh hi there!',
								footer: $('<div/>')
									.addClass('dialog-button')
									.attr('data-dialog-action', 'hide')
									.text('Close')
							});
						})
					});
				})
			});
		});
	}

	function formatCode(code) {
		return code.toString()
			.replace(/\t+/g, function(tabs) {
				return new Array(tabs.length - 2 + 1).join('  ');
			})
			.split('\n')
			.slice(1, -1)
			.join('\n');
	}

	$('<li/>')
		.append($('<h2/>').text('Stacked modals').append($('<button/>')
			.attr('id', 'stacked')
			.text('Launch dialog')))
		.append($('<pre/>').addClass('sunlight-highlight-javascript').text(formatCode(theCode)))
		.appendTo($ul);


	theCode();

	theCode = function() {
		$('#callback-body').click(function() {
			$.dialog({
				show: true,
				title: 'Loaded via callback',
				body: function(callback) {
					//"this" is the dialog instance
					window.setTimeout(function() {
						callback('Hello World (after two seconds)!');
					}, 2000);
				}
			});
		});
	};

	$('<li/>')
		.append($('<h2/>').text('Load body via callback').append($('<button/>')
			.attr('id', 'callback-body')
			.text('Launch dialog')))
		.append($('<pre/>').addClass('sunlight-highlight-javascript').text(formatCode(theCode)))
		.appendTo($ul);

	theCode();

	theCode = function() {
		$('#big-body').click(function() {
			$.dialog({
				show: true,
				title: 'Nice body',
				body: $(new Array(10).join('<p>You gotta big body</p>'))
			});
		});
	};

	$('<li/>')
		.append($('<h2/>').text('Dialog height grows to fit body').append($('<button/>')
			.attr('id', 'big-body')
			.text('Launch dialog')))
		.append($('<pre/>').addClass('sunlight-highlight-javascript').text(formatCode(theCode)))
		.appendTo($ul);

	theCode();

	window.Sunlight.highlightAll();
}(window));