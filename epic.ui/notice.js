( function( epic, document ) {

	function get_notification_rail() {
		var id = "epic-notification-rail";
		var rail = document.getElementById( id );

		if( rail === null ) {
			rail = document.createElement( "div" );
			rail.id = id;
		}

		if( rail.parentNode === null ) {
			document.body.insertBefore( rail, null );
		}

		return rail;
	}

	function notice( settings ) {
		settings = epic.object.merge( notice.default_settings, settings );

		var t = this;

		var container = t.container = document.createElement( 'div' );
		var title_bar = t.title = document.createElement( 'span' );
		var close_button = t.close_button = document.createElement( 'span' );
		var message = t.message = document.createElement( 'div' );

		var notice_type = settings.type;
		var title = settings.title;
		var timeout = settings.timeout;

		title = title || ( notice_type === notice.type.default ? "Information!" : ( notice_type.charAt( 0 ).toUpperCase() + notice_type.slice( 1 ) ) + "!" );

		t.settings = settings;
		t.set_type( notice_type );

		close_button.innerHTML = "";
		close_button.className = "epic-notice-close";
		epic.event.add( close_button, "click", notice.event.close, container );

		title_bar.innerHTML = title;
		title_bar.className = "epic-notice-title";

		message.innerHTML = settings.message;
		message.className = "epic-notice-content";

		container.insertBefore( close_button, null );
		container.insertBefore( title_bar, null );
		container.insertBefore( message, null );

		epic.event.add( container, "mouseover", notice.event.mouseover, close_button );
		epic.event.add( container, "mouseout", notice.event.mouseout, close_button );

		get_notification_rail().insertBefore( container, null );

		if( typeof timeout === "number" ) {
			setTimeout( function() {
				!t.is_closed() && fade( t.container );
			}, timeout * 1000 );
		}
	}

	function notify( settings ) {
		return new notice( settings );
	}

	function fade( element ) {
		var opacity = 1; // initial opacity
		var timer = setInterval( function() {
			if( opacity <= 0.1 ) {
				clearInterval( timer );
				element.style.opacity = '1';
				element.style.display = 'none';
			}

			element.style.opacity = opacity;
			element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
			opacity -= opacity * 0.3;
		}, 50 );
	}

	// NOTICE PROPERTIES
	notice.prototype = {
		set_content: function( content ) {
			var t = this;
			t.message.innerHTML = content;
			return t;
		},

		show: function() {
			var t = this;
			var container = t.container;

			container.style.display = 'block';

			if( t.parentNode === null ) {
				get_notification_rail().insertBefore( container, null );
			}

			return t;
		},

		hide: function() {
			var t = this;
			t.container.style.display = 'none';
			return t;
		},

		is_closed: function() {
			return this.container.style.display == 'none';
		},

		as_success: function() {
			return this.set_type( alert.type.success );
		},

		as_info: function() {
			return this.set_type( alert.type.info );
		},

		as_warning: function() {
			return this.set_type( alert.type.warning );
		},

		as_danger: function() {
			return this.set_type( alert.type.danger );
		},

		set_type: function( type ) {
			var t = this;
			t.container.className = "epic-notice epic-notice-" + type;
			return t;
		}
	};

	notice.type = {
		'default': 'default',
		success: 'success',
		info: 'info',
		warning: 'warning',
		danger: 'danger'
	};

	notice.default_settings = {
		type: notice.type.default,
		message: "",
		closable: false,

		// AMOUNT OF TIME THE NOTICE WILL REMAIN VISIBLE (IN SECONDS)
		timeout: 5
	};

	notice.event = {
		close: function( e, container ) {
			var parent = container.parentNode;
			parent.removeChild( container );
		},

		mouseover: function( e, close_button ) {
			close_button.style.display = "block";
		},

		mouseout: function( e, close_button ) {
			close_button.style.display = "none";
		}
	};

	// NOTIFY PROPERTIES
	notify.success = function( message, closable ) {
		return new notice( {
			type: notice.type.success,
			message: message,
			closable: closable
		} );
	};

	notify.danger = function( message, closable ) {
		return new notice( {
			type: notice.type.danger,
			message: message,
			closable: closable
		} );
	};

	notify.warning = function( message, closable ) {
		return new notice( {
			type: notice.type.warning,
			message: message,
			closable: closable
		} );
	};

	notify.info = function( message, closable ) {
		return new notice( {
			type: notice.type.info,
			message: message,
			closable: closable
		} );
	};

	epic.notice = notice;
	epic.notify = notify;

} )( epic, document );