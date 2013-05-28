(function(window, $) {

	function Dialog(options) {
		this.options = options;
		this.$mask = null;
		this.$dialog = null;
	}

	Dialog.prototype = {
		show: function() {
			if (this.$dialog && this.$dialog.is(':visible')) {
				return;
			}

			this.options.onShowing && this.options.onShowing();

			if (this.options.modal) {
				this.$mask = $('<div/>')
					.addClass('dialog-mask')
					.appendTo('body')
					.fadeIn('fast');
			}

			var $header, $body, $footer, self = this;

			this.$dialog = $('<div/>')
				.addClass('dialog-container')
				.data('dialog', this);

			if (this.options.width) {
				this.$dialog.width(this.options.width);
			}
			if (this.options.height) {
				this.$dialog.height(this.options.height);
			}
			if (this.options.dynamic) {
				this.$dialog.addClass('dynamic');
				if (this.options.width) {
					this.$dialog.css(
						'marginLeft',
						(-parseFloat(this.options.width) / 2) +
							(/[a-z]+$/i.exec(String(this.options.width)) || [''])[0]
					);
				}
				if (this.options.height) {
					this.$dialog.css(
						'marginTop',
						(-parseFloat(this.options.height) / 2) +
							(/[a-z]+$/i.exec(String(this.options.height)) || [''])[0]
					);
				}
			} else {
				this.$dialog.css({
					left: Math.max(0, $(window).width() / 2 - 200),
					top: Math.max(0, Math.min(100, $(window).height() - 20))
				});
			}

			$header = $('<div/>')
				.addClass('dialog-header');

			if (this.options.title) {
				$('<div/>')
					.addClass('dialog-title')
					.text(this.options.title)
					.appendTo($header);
			}
			if (this.options.closable !== false) {
				$('<div/>')
					.addClass('dialog-close')
					.html('&times;');
			}

			$body = $('<div/>').addClass('dialog-body');

			if (this.options.body) {
				if (typeof(this.options.body) === 'string') {
					$body.append($('<p/>').text(this.options.body));
				} else {
					$body.append(this.options.body);
				}
			}

			$footer = $('<div/>')
				.addClass('dialog-footer');

			if (this.options.buttons) {
				for (var type in this.options.buttons) {
					if (!this.options.buttons.hasOwnProperty(type)) {
						continue;
					}

					var button = $.extend({}, this.options.buttons[type]),
						$button = $('<div/>').addClass('dialog-button ' + (button.className || ''));

					switch (type.toLowerCase()) {
						case 'close':
							button.text = button.text || 'Close';
							$button.click(function() {
								self.hide('closeButton');
							});
							break;
						case 'ok':
							button.text = button.text || 'OK';
							break;
						case 'cancel':
							button.text = button.text || 'Cancel';
							break;
					}

					if (button.html) {
						$button.html(button.html);
					} else if (button.text) {
						$button.text(button.text);
					}

					$button.appendTo($footer);
				}
			}

			this.$dialog
				.append($header)
				.append($body)
				.append($footer)
				.appendTo('body');

			this.options.onShown && this.options.onShown();
		},

		hide: function(catalyst) {
			if (!this.$dialog || !this.$dialog.is(':visible')) {
				return;
			}

			this.$mask && this.$mask.remove();
			this.$dialog.remove();
			this.options.onHide && this.options.onHide(catalyst);
		}
	};

	var oldDialog = $.dialog,
		defaults = {
			dynamic: true,
			onHide: function(catalyst) {},
			onShowing: function() {},
			onShown: function() {},
			buttons: {
				close: 'Close'
			}
		};

	$.dialog = function(options) {
		options = $.extend({}, defaults, options || {});
		var dialog = new Dialog(options);

		if (options.show) {
			dialog.show();
		}

		return dialog;
	};

	$.fn.dialog = function(method) {
		return this.each(function() {
			var dialog = $(this).data('dialog');
			dialog && typeof(dialog[method]) === 'function' && dialog[method]();
		});
	}

}(window, jQuery));