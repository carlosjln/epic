( function( epic, document ) {

	function get_notification_rail() {
		var id = "epic-notification-rail";
		var rail = document.getElementById( id );

		if( rail == null ) {
			rail = document.createElement( "div" );
			rail.id = id;
//			rail.style.cssText = "position: fixed; right: 20px; bottom: 20px; width: 301px; z-index: 9999;";
		}

		if( rail.parentNode == null ) {
			document.body.insertBefore( rail, null );
		}

		return rail;
	}

	function notice( settings ) {
		settings = epic.object.merge( notice.default_settings, settings );

		var t = this;

		var container = t.element = document.createElement( 'div' );
		var title = t.message = document.createElement( 'span' );
		var close_btn = t.message = document.createElement( 'span' );
		var message = t.message = document.createElement( 'div' );

		var type = settings.type;
		var header = settings.title || type == notice.type.default ? "Information!" : ( type.charAt( 0 ).toUpperCase() + type.slice( 1 ) ) + "!";

		t.settings = settings;
		t.set_type( type );

		close_btn.innerHTML = "";
		close_btn.className = "notice-close";
		epic.event.add( close_btn, "click", notice.event.close, container );
		
		title.innerHTML = header;
		title.className = "notice-title";

		message.innerHTML = settings.message;
		message.className = "notice-content";

		container.insertBefore( close_btn, null );
		container.insertBefore( title, null );
		container.insertBefore( message, null );

		get_notification_rail().insertBefore( container, null );
	}

	function notify( settings ) {
		return new notice( settings );
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
			t.element.style.display = 'block';
			return t;
		},

		hide: function() {
			var t = this;
			t.element.style.display = 'none';
			return t;
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
			t.element.className = "notice notice-" + type;
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
			parent.removeChild( container);
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