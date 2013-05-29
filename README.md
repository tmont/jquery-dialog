# jQuery Dialog!
What could possibly go wrong with another one of these?

## Installation
Reference `jquery.dialog.js` somewhere. You'll also need to add the
`dialog.css` stylesheet as well.

If you're feeling frisky, you can also rock the `dialog.less` file
and configure Less compilation.

## Usage
Default options:

```javascript
$.dialog({
	// body of the dialog, either a string for text or a jQuery/DOM element
	body: '',

	// title text
	title: '',

	// dynamically keep the dialog in the center of the screen
	dynamic: true,

	// use an overlay to prevent interaction with the background
    modal: false,

    // customize the dimensions of the dialog
    width: null,
    height: null,

    // with "modal: true", specifies whether clicking on the background
    // will close the dialog
    closeOnMaskClick: true,

    // close the dialog when the user presses ESC
    closeOnEscape: true,

    // show the li'l "X" in the top right corner
    closeX: true,

    // with "modal: true", allow scrolling of the background
    allowScrolling: false,

    // top and left gutter for long/wide dialogs
    gutter: 20,

    // event callbacks (always remember to invoke the callback argument!)
    onHiding: function(catalyst, callback) { callback(); },
    onHidden: function(catalyst) {},
    onShowing: function(callback) { callback(); },
    onShown: function() {},

    // enable CSS transitions for the modal mask
    transitionMask: true,

    // show some buttons (see examples below)
    buttons: {}
});
```

Here's how you might actually use it:

```javascript
$('button').click(function() {
	var dialog = $.dialog({
		body: 'If I said you had a nice body would you hold it against me?',
		title: 'Corny pickup lines',
		buttons: { close: 'Close' }
	});

	window.setTimeout(function() {
		dialog.hide();
	}, 1000);

	// you can also get a hold of ALL dialogs:
	$('.dialog-container').dialog('hide');
});
```

And buttons!

```javascript
$.dialog({
	buttons: {
		// bootstrap style
		'delete': {
			className: 'btn btn-danger',
			text: 'Delete'
		},

		save: {
			html: '<span class="icon-checkmark"></span> Save'
		},

		ok: 'OK',
		cancel: 'Cancel',
	}
});
```

## Development
```bash
git clone git@github.com:tmont/jquery-dialog.git
cd jquery-dialog
npm install
npm start
```