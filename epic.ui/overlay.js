( function( epic ) {
	var $ = epic.html;

	function create( tag, classname, style, content ) {
		var element = document.createElement( tag );
		
		element.className = classname || "";
		element.style.cssText = style || "";
		element.innerHTML = content || "";
		
		return element;
	}

	function overlay( settings ) {
		var container = $( create("div", "modal-container" ) );
		var dark_side = $( create("div", "modal-overlay" ) );
		var content = $( settings.content ).add_class( "modal-content" );

		var btn_hide = content.find( ".btn-hide-overlay" );
		var btn_remove = container.find( ".btn-remove-overlay" );

		var handle = dark_side.events;
		var self = this;

		var event_data = {
			container: container,
			btn_close: ( btn_remove || btn_hide ),
			overlay: self
		};

		container.append( dark_side, content );

		self.container = container.get( 0 );
		self.overlay = dark_side.get( 0 );
		self.content = content.get( 0 );

		btn_hide.click( event_data, handle.on_hide );

		btn_remove.click( event_data, handle.on_hide );

		container.keyup( event_data, handle.on_escape );

		$( settings.target || "body" ).append( container );

		var margin_top = content.height() / 2;
		var margin_left = content.width() / 2;

		content.css( "margin", "-" + margin_top + "px 0 0 -" + margin_left + "px" );
	}

	var prototype = overlay.prototype;

	prototype.hide = function() {
		this.container.style.display = 'none';
		return this;
	};

	prototype.show = function() {
		this.container.style.display = 'block';
		return this;
	};

	overlay.events = {
		on_hide: function( e ) {
			e.preventDefault();
			e.data.overlay.hide();
		},

		on_escape: function( e ) {
			e.preventDefault();
			if( e.which === 27 ) {
				e.data.btn_close.click();
			}
		}
	};

	epic.overlay = overlay;

} )( epic );