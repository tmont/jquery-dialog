(function(window, document, $) {

	var dialogId = 0;

	function Dialog(options) {
		this.options = options;
		this.$mask = null;
		this.$dialog = null;
		this.$scrollContainer = null;
		this.id = ++dialogId;
	}

	Dialog.prototype = {
		show: function() {
			if (this.$dialog && this.$dialog.is(':visible')) {
				return;
			}

			var self = this;
			this.options.onShowing.call(this, function(nope) {
				if (nope) {
					return;
				}

				self.render();
			});
		},

		render: function() {
			var $header, $body, $footer, self = this;
			if (this.options.modal) {
				this.$mask = $('<div/>')
					.addClass('dialog-mask ' + (this.options.transitionMask ? 'dialog-mask-transition' : ''))
					.appendTo('body');

				//force repaint for firefox: http://stackoverflow.com/a/12089264
				this.$mask
					.data('forceRepaint', this.$mask[0].clientHeight)
					.addClass('dialog-mask-active');

				if (this.options.closeOnMaskClick) {
					this.$mask.click(function() {
						self.hide('mask');
					});
				}

				if (!this.options.allowScrolling) {
					$('body').addClass('dialog-no-scroll');
					this.$scrollContainer = $('<div/>')
						.addClass('dialog-scroll-container')
						.click(function() {
							self.hide('mask');
						})
						.appendTo('body');
				}
			}

			if (this.options.closeOnEscape) {
				$(document).on('keyup.dialog-' + this.id, function(e) {
					if (e.keyCode === 27) {
						e.preventDefault();
						e.stopImmediatePropagation();
						self.hide('escape');
						$(document).off('keyup.dialog-' + self.id);
					}
				});
			}

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
			if (this.options.closeX) {
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

					var data = this.options.buttons[type];
					if (!data) {
						continue;
					}
					if (typeof(data) === 'string') {
						data = { text: data };
					}

					var button = $.extend({}, data),
						$button = $('<div/>').addClass('dialog-button ' + (button.className || ''));

					type = type.toLowerCase();
					switch (type) {
						case 'close':
						case 'ok':
							button.text = button.text || (type === 'ok' ? 'OK' : 'Close');
							if (!button.className) {
								$button.addClass('dialog-button-primary');
							}
							$button.click((function(type) {
								return function() {
									self.hide(type === 'ok' ? 'okButton' : 'closeButton');
								};
							}(type)));
							break;
						case 'cancel':
							button.text = button.text || 'Cancel';
							if (!button.className) {
								$button.addClass('dialog-button-info');
							}
							$button.click(function() {
								self.hide('cancelButton');
							});
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
				.appendTo(this.$scrollContainer || 'body');

			if (!this.options.dynamic) {
				var width = this.$dialog.outerWidth(),
					height = this.$dialog.outerHeight();
				this.$dialog.css({
					left: Math.max(this.options.gutter, $(window).width() / 2 - width / 2),
					top: Math.max(this.options.gutter, $(window).height() / 2 - height / 2)
				});
			}

			this.options.onShown.call(this);
		},

		hide: function(catalyst) {
			if (!this.$dialog || !this.$dialog.is(':visible')) {
				return;
			}

			var self = this;
			this.options.onHiding.call(this, catalyst, function(nope) {
				if (nope) {
					return;
				}

				self.$mask && self.$mask.remove();
				self.$scrollContainer && self.$scrollContainer.remove();
				self.$dialog.remove();
				$(document).off('.dialog-' + self.id);

				if (self.options.modal && !self.options.allowScrolling) {
					if (!$('.dialog-scroll-container').length) {
						$('body').removeClass('dialog-no-scroll');
					}
				}
				self.options.onHidden.call(this, catalyst);
			});
		}
	};

	var defaults = {
		dynamic: true,
		modal: false,
		width: null,
		height: null,
		closeOnMaskClick: true,
		closeOnEscape: true,
		closeX: true,
		allowScrolling: false,
		gutter: 20,
		onHiding: function(catalyst, callback) { callback(); },
		onHidden: function(catalyst) {},
		onShowing: function(callback) { callback(); },
		onShown: function() {},
		transitionMask: true,
		buttons: {}
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

}(window, document, jQuery));