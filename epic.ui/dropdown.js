( function( epic, window, document, undefined ) {
	var add_event = epic.event.add;
	var trim_spaces = epic.string.trim;
	var epic_button = epic.button;
	var add_class = epic.html.add_class;
	var last_dropdown_toggled;
	var epic_uid = epic.uid;

	var choice = (function() {
		function choice( settings ) {
			var self = this;
			var container = self.container = document.createElement( "a" );
			
			container.setAttribute( "href", "#" );

			self.set_caption( settings.caption );
			self.data = settings.data;
			self.onclick = settings.onclick;
		}

		choice.prototype = {
			constructor: choice,

			disable: function() {
				var self = this;
				var container = self.container;
				
				container.className = "disabled";
				container.setAttribute( "disabled", "true" );

				self.disabled = true;
			},

			enable: function() {
				var self = this;
				var container = self.container;

				container.className = "";
				container.removeAttribute( "disabled" );

				self.disabled = false;
			},

			set_caption: function( caption ) {
				var self = this;

				if( typeof caption === "string" ) {
					self.caption = caption;
					self.container.innerHTML = caption;
				}
				
				return self;
			}
		};
		return choice;
	})();

	function choice_selected( e, context ) {
		e.prevent_default();
		var option = context.option;

		if( option.disabled !== true ) {
			( option.onclick || context.dropdown.onselect ).call( e.target, e, option );
		}
	}

	function options_collection( context ) {
		var items = [];
		var collection = {};

		this.add = function( options ) {
			if( options === undefined ) {
				return;
			}

			options = options instanceof Array ? options : [options];

			var length = options.length;
			var i = 0;
			var option;
			var li;
			var document_fragment = document.createDocumentFragment();
			var container;

			for( ; i < length; i++ ) {
				option = options[i];

				li = document.createElement("li");

				if( option.divide === true ) {
					li.className = 'divider';
				}else {
					option = items[ items.length ] = new choice( option );
					container = option.container;
					add_event( container, "click", choice_selected, { dropdown: context, option: option} );
					li.insertBefore( container, null );
				}
				
				document_fragment.insertBefore( li, null );
			}
			
			context.list.insertBefore( document_fragment, null );
		};

		this.get = function( index ) {
			return items[ index ];
		};
	}

	function dropdown( settings ) {
		var self = this;

		var container = self.container = document.createElement( "span" );
		var toggle = self.toggle_button = settings.toggle_button || new epic_button( {
			style: epic_button.style.primary,
			icon: new epic.icon( { name: "caret" } )
		} );
		var toggle_container = toggle.container;
		var list = self.list = document.createElement( "ul" );
		var options = self.options = new options_collection( self );

		// ENSURE THE TOGGLE BUTTON HAS THE ITS IDENTIFYING CLASS
		add_class( toggle_container, "dropdown-toggle" );

		list.className = "dropdown-menu";

		container.id = settings.id || "DD-" + epic_uid.next();
		container.insertBefore( toggle_container, null );
		container.insertBefore( list, null );
		add_class( container, "dropdown " + settings.classes );

		self.onselect = settings.onselect || do_nothing;
		
		add_event( toggle_container, "click", handle_toggle_click, self );

		options.add( settings.options );
	}

	// EVENT HANDLERS
	function do_nothing( e ) {
		e.prevent_default();
	}

	function open_dropdown( instance ) {
		close_dropdown( last_dropdown_toggled );

		var container = instance.container;

		if( container.className.indexOf( "open" ) === -1 ) {
			container.className += " open";
		}

		last_dropdown_toggled = instance;
	}

	function close_dropdown( instance ) {
		if( ( instance instanceof dropdown ) === false ) {
			return;
		}

		var container = instance.container;
		container.className = trim_spaces( container.className.replace( /open/, "" ), true );

		last_dropdown_toggled = undefined;
	}

	function handle_toggle_click( e, instance ) {
		e.stop_propagation();
		instance.toggle();
	}

	dropdown.prototype = {
		constructor: dropdown,

		divide: function() {
			var divider = document.createElement( "hr" );
			divider.className = "divider unselectable";
			this.options.insertBefore( divider );

			return divider;
		},

		open: function() {
			open_dropdown( this );
		},

		close: function() {
			close_dropdown( this );
		},

		toggle: function() {
			var self = this;

			if( self.is_opened() ) {
				self.close();
			} else {
				self.open();
			}
		},

		is_opened: function() {
			return this.container.className.indexOf( "open" ) > -1;
		}
	};

	add_event( document, "click", function( e ) {
		var target = e.target;
		var parent = target.parentNode;

		var target_is_dropdown = target.className && target.className.indexOf( "dropdown" ) > -1;
		var parent_is_dropdown = parent && parent.className && parent.className.indexOf( "dropdown" ) > -1;

		if( target_is_dropdown || parent_is_dropdown ) {
			return;
		}

		close_dropdown( last_dropdown_toggled );
	} );

	epic.dropdown = dropdown;
} )( epic, window, document );