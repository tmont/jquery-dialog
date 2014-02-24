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

				self.fetchBodyAndRender();
			});
		},

		createMask: function(loading) {
			this.$mask = $('<div/>')
				.addClass('dialog-mask ' + (this.options.transitionMask ? 'dialog-mask-transition' : ''))
				.appendTo('body');

			if (loading) {
				this.$mask.addClass('dialog-mask-loading');
			}

			//force repaint for firefox: http://stackoverflow.com/a/12089264
			this.$mask
				.data('forceRepaint', this.$mask[0].clientHeight)
				.addClass('dialog-mask-active');
		},

		fetchBodyAndRender: function() {
			var body = this.options.body,
				self = this;
			if (typeof(body) === 'function') {
				this.createMask(true);

				body.call(this, function(body) {
					self.render(body);
				});
			} else {
				self.render(body);
			}
		},

		render: function(body) {
			var $header, $body, $footer, self = this;
			if (this.options.modal) {
				if (!this.$mask) {
					this.createMask(false);
				} else {
					this.$mask.removeClass('dialog-mask-loading');
				}

				if (this.options.closeOnMaskClick) {
					this.$mask.click(function() {
						self.hide('mask');
					});
				}

				if (!this.options.allowScrolling) {
					$('body').addClass('dialog-no-scroll');
					this.$scrollContainer = $('<div/>')
						.addClass('dialog-scroll-container')
						.appendTo('body');

					if (this.options.closeOnMaskClick) {
						this.$scrollContainer.click(function(e) {
							if (e.target !== this) {
								return;
							}

							self.hide('mask');
						});
					}
				}
			} else if (this.$mask) {
				this.$mask.remove();
			}

			if (this.options.closeOnEscape) {
				$(document).on('keyup.dialog-' + this.id, function(e) {
					if (e.keyCode === 27) {
						//make sure it's the topmost dialog
						//the topmost dialog is the one that was added to the DOM last
						var dialog = $('.dialog-container').last().data('dialog');
						if (dialog !== self) {
							return;
						}

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
				this.$dialog.css(this.options.fixedDimensions ? 'width' : 'min-width', this.options.width);
			}
			if (this.options.height) {
				this.$dialog.css(this.options.fixedDimensions ? 'height' : 'min-height', this.options.height);
			}

			if (this.options.position) {
				if (this.options.position.top) {
					this.$dialog.css({ marginTop: 'auto', top: this.options.position.top });
				}
				if (this.options.position.left) {
					this.$dialog.css({ marginLeft: 'auto', left: this.options.position.left });
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
					.attr({ title: 'Close', 'data-dialog-action': 'hide' })
					.appendTo($header);
			}
			if (!this.options.closeX && !this.options.title) {
				$header = $();
			}

			$body = $('<div/>').addClass('dialog-body');

			if (body) {
				if (typeof(body) === 'string') {
					$body.append($('<p/>').text(body));
				} else {
					$body.append(body);
				}
			}

			$footer = $('<div/>').addClass('dialog-footer');
			if (this.options.footer) {
				if (typeof(this.options.footer) === 'string') {
					$footer.html(this.options.footer);
				} else {
					$footer.append(this.options.footer);
				}
			}

			this.$dialog
				.append($header)
				.append($body)
				.append($footer)
				.appendTo(this.$scrollContainer || 'body');

			this.$dialog.on('click', '[data-dialog-action]', function() {
				var action = $(this).attr('data-dialog-action');
				switch (action) {
					case 'hide':
						self.hide();
						break;
				}
			});

			var width = this.$dialog.outerWidth(),
				height = this.$dialog.outerHeight();

			if (this.options.dynamic) {
				this.$dialog.addClass('dynamic');
				if (!this.options.position || !this.options.position.left) {
					this.$dialog.css('margin-left', -width / 2);
				}
				if (!this.options.position || !this.options.position.top) {
					this.$dialog.css('margin-top', -height / 2);
				}
			} else {
				if (!this.options.position || !this.options.position.top) {
					this.$dialog.css('top', Math.max(this.options.gutter, $(window).height() / 2 - height / 2));
				}
				if (!this.options.position || !this.options.position.left) {
					this.$dialog.css('left', Math.max(this.options.gutter, $(window).width() / 2 - width / 2));
				}
			}

			this.$dialog.trigger('show');
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

				self.$dialog.trigger('hide');
				self.$mask && self.$mask.remove();
				self.$scrollContainer && self.$scrollContainer.remove();
				self.$dialog.remove();
				$(document).off('.dialog-' + self.id);

				if (self.options.modal && !self.options.allowScrolling) {
					if (!$('.dialog-scroll-container').length) {
						$('body').removeClass('dialog-no-scroll');
					}
				}
			});
		}
	};

	var defaults = {
		body: '',
		title: '',
		dynamic: true,
		modal: false,
		fixedDimensions: false,
		width: null,
		height: null,
		closeOnMaskClick: true,
		closeOnEscape: true,
		closeX: true,
		allowScrolling: false,
		gutter: 20,
		position: null,
		onHiding: function(catalyst, callback) { callback(); },
		onShowing: function(callback) { callback(); },
		transitionMask: true,
		footer: null
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

}(window, document, jQuery));