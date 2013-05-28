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
					.addClass('dialog-mask ' + (this.options.transitionMask ? 'dialog-mask-transition' : ''))
					.appendTo('body');

				//force repaint for firefox: http://stackoverflow.com/a/12089264
				this.$mask
					.addClass('dialog-mask-active ' + 'a' + this.$mask[0].clientHeight);

				if (this.options.closeOnMaskClick) {
					this.$mask.click(function() {
						self.hide('mask');
					});
				}
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
					var marginLeft = (-parseFloat(this.options.width) / 2) +
						(/[a-z]+$/i.exec(String(this.options.width)) || ['px'])[0];
					this.$dialog.css('margin-left', marginLeft);
				}
				if (this.options.height) {
					var marginTop = (-parseFloat(this.options.height) / 2) +
						(/[a-z]+$/i.exec(String(this.options.height)) || ['px'])[0];
					this.$dialog.css('margin-top', marginTop);
				}
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
					.html('&times;')
					.attr('title', 'Close')
					.click(function() {
						self.hide('x');
					})
					.appendTo($header);
			}

			$body = $('<div/>').addClass('dialog-body');

			if (this.options.body) {
				if (typeof(this.options.body) === 'string') {
					$body.append($('<p/>').text(this.options.body));
				} else {
					$body.append(this.options.body);
				}
			}

			$footer = $('<div/>').addClass('dialog-footer');

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
							$button.addClass('btn-primary');
							$button.click(function() {
								self.hide('closeButton');
							});
							break;
						case 'ok':
							button.text = button.text || 'OK';
							$button.addClass('btn-primary');
							break;
						case 'cancel':
							button.text = button.text || 'Cancel';
							$button.addClass('btn-info');
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

			if (!this.options.dynamic) {
				var width = this.$dialog.outerWidth(),
					height = this.$dialog.outerHeight();
				this.$dialog.css({
					left: Math.max(0, $(window).width() / 2 - width / 2),
					top: Math.max(0, $(window).height() / 2 - height / 2)
				});
			}

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

	var defaults = {
		dynamic: true,
		modal: false,
		width: null,
		height: null,
		closeOnMaskClick: true,
		onHide: function(catalyst) {},
		onShowing: function() {},
		onShown: function() {},
		transitionMask: true,
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
			return this;
		});
	}

}(window, jQuery));