( function( epic, window, document, undefined ) {
	var add_event = epic.event.add;
	var purge_spaces = epic.string.purge_spaces;
	var last_dropdown_toggled;

	function create_element( tag ) {
		return document.createElement( tag );
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
		if( (instance instanceof dropdown) === false ) {
			return;
		}

		var container = instance.container;
		container.className = purge_spaces( container.className.replace( /open/, "" ) );
		
		last_dropdown_toggled = undefined;
	}

	function dropdown( settings ) {
		var self = this;

		var container = self.container = create_element( "span" );
		var options = self.options = create_element( "ul" );
		
		var toggle = self.toggle_button = new epic.button( {
			classes: "dropdown-toggle",
			style: epic.button.style.primary,
			icon: new epic.icon( {
				name: "chevron-down"
			} )
		} );
		var toggle_btn = toggle.container;
		
		container.className = "dropdown";
		options.className = "dropdown-menu";

		container.insertBefore( toggle_btn, null );
		container.insertBefore( options, null );

		add_event( toggle_btn, "click", handle_toggle_click, self );
		self.on_select = settings.on_select || self.on_select;
		
		self.add( settings.options );
	}

	function handle_toggle_click( e, instance ) {
		e.stop_propagation();
		instance.toggle();
	}
	
	dropdown.prototype = {
		constructor: dropdown,

		on_select: function( e, option ) {
			e.prevent_default();
			console.log( option );
		},

		divide: function() {
			var divider = create_element( "hr" );
			divider.className = "divider unselectable";
			this.options.insertBefore( divider );

			return divider;
		},

		add: function( option ) {
			var self = this;

			var options = option instanceof Array ? option : [option];
			var length = options.length;
			var list = self.options;
			var i = 0;
			var item;
			var div = create_element( "div" );
			var li;
			var on_select = self.on_select;
			
			for( ; i < length; i++ ) {
				item = options[ i ];
				
				div.innerHTML = '<li class="unselectable"><a href="#">' + item.caption + '</a></li>';
				li = div.firstChild;
				
				add_event( li, "click", on_select, item );
				
				list.insertBefore( li, null );
			}
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
			}else {
				self.open();
			}
		},

		is_opened: function() {
			return this.container.className.indexOf( "open" ) > -1;
		}
	};

	add_event( document, "click", function ( e ) {
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