( function( epic, window, document ) {
	var REGISTRY = {};
	var REGISTRY_POLICE = {};
	var HANDLERS = {};
	
	var next_uid = epic.uid.next;
	var set_event_handler = document.addEventListener ? add_event_listener : attach_event;

	function event() {
		
	}

	function add( element, event_name, method, parameters ) {
		if( typeof event_name != "string" ) {
			return epic.fail("[event_name] must be a valid event name.");
		}
		
		var element_uid = element.uid || ( element.uid = next_uid() );
		var element_events = REGISTRY[ element_uid ] || ( REGISTRY[ element_uid ] = {} );

		var method_uid = method.uid || ( method.uid = next_uid() );

		// PREVENT THE SNEAKY METHOD FROM REGISTERING MORE THAN ONCE :P
		var police_key = element_uid + "_" + event_name + "_" + method_uid;
		if( REGISTRY_POLICE[ police_key ] ) {
			return false;
		}

		var handler = {
			method: method,
			parameters: parameters || {}
		};

		( element_events[ event_name ] || ( element_events[ event_name ] = [] ) ).push( handler );

		set_event_handler( element, event_name, element_uid );

		// NOTIFY THE REGISTRY POLICE THAT THIS KEY HAVE BEEN USED
		REGISTRY_POLICE[ police_key ] = true;

		return true;
	}

	function remove( element, event_name, handler, data ) {

	}

	function trigger( element, event_name, handler, data ) {

	}

	function add_event_listener( element, event_name, element_uid ) {
		var element_event = element_uid + "_" + event_name;

		if( !HANDLERS[ element_event ] ) {
			HANDLERS[ element_event ] = true;

			element.addEventListener( event_name, epic_event_handler, false );
		}
	}

	function attach_event( element, event_name, element_uid ) {
		var element_event = element_uid + "_" + event_name;

		if( !HANDLERS[ element_event ] ) {
			HANDLERS[ element_event ] = true;

			element.attachEvent( 'on' + event_name, epic_event_handler );
		}
	}

	function epic_event_handler( e ) {
		var evt = new epic_event( e );

		var element = evt.target;
		var events = REGISTRY[ element.uid ];
		var handlers;
		var handler;
		var len;
		var index = 0;

		if( events ) {
			handlers = events[ evt.type ];
			len = handlers.length;

			while( len-- ) {
				handler = handlers[ index++ ];
				handler.method.call( element, evt, handler.parameters );
			}
		}

		return this;
	}

	function epic_event( e ) {
		var target = ( e.target || e.srcElement ) || document;
		
		var which = e.which;
		var charcode = e.charCode;
		var keycode = e.keyCode;
		var event_name = e.type;
		var delta = 0;
		
		var page_x;
		var page_y;

		var key_map = {
			8: 'BACKSPACE',
			9: 'TAB',
			10: 'ENTER',
			13: 'ENTER',

			20: 'CAPSLOCK',

			27: 'ESC',
			33: 'PAGEUP',
			34: 'PAGEDOWN',
			35: 'END',
			36: 'HOME',

			37: 'LEFT',
			38: 'UP',
			39: 'RIGHT',
			40: 'DOWN',

			45: 'INSERT',
			46: 'DELETE'
		};

		var capslock = false;

		var key_code = which ? which : keycode;
		var key_value = '';

		var meta_key;

		if( event_name == 'DOMMouseScroll' ) {
			event_name = 'mousewheel';
		}

		if( e.altKey ) {
			meta_key = 'ALT';
		} else if( e.ctrlKey || e.metaKey ) {
			meta_key = 'CTRL';
		} else if( e.shiftKey || charcode == 16 ) {
			meta_key = 'SHIFT';
		} else if( key_code == 20 ) {
			meta_key = 'CAPSLOCK';
		}
		
		// IE
		if( which === undefined && charcode === undefined ) {
			key_code = keycode;

		// THE REST
		} else {

			// IF wich IS DIFFERENT FROM ZERO, IT IS A LETTER, OTHERWISE IS AN SPECIAL CHARACTER
			key_code = which != 0 && charcode != 0 ? which : keycode;
		}

		key_value = key_code > 31 ? String.fromCharCode( key_code ) : '';

		// IF SHIFT KEY IS NOT PRESSED AND THE KEY CODE RETURNS 'A-Z'
		// OR SHIFT KEY IS PRESSED BUT THE KEY CODE RETURNS 'a-z'.		
		if( key_code > 96 && key_code < 123 && meta_key == 'SHIFT' || key_code > 64 && key_code < 91 && meta_key != 'SHIFT' ) {
			capslock = true;
		}

		// A BIT OF CORRECTION TO THE BUGGY KEYDOWN AND KEYUP EVENTS
		if( event_name == 'keydown' || event_name == 'keyup' ) {

			if( key_value == 'CAPSLOCK' ) {
				capslock = !capslock;
			}

			if( key_code > 64 && key_code < 91 && meta_key != 'SHIFT' ) {
				key_code = key_code + 32;
				key_value = String.fromCharCode( key_code );
			}
		}

		if( key_map[ key_code ] ) {
			key_value = key_map[ key_code ];
		}
		
		// CORRECT WHEEL SCROLL DIRECTION 
		if( event_name == 'mousewheel' ) {
			delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;;
			delta = delta > 0 ? 1 : -1;
		}

		if( e.pageX == null && e.clientX != null ) {
			var document_element = document.documentElement;
			var body = document.body;
			
			page_x = e.clientX + ( document_element && document_element.scrollLeft || body && body.scrollLeft || 0 ) - ( document_element && document_element.clientLeft || body && body.clientLeft || 0 );
			page_y = e.clientY + ( document_element && document_element.scrollTop || body && body.scrollTop || 0 ) - ( document_element && document_element.clientTop || body && body.clientTop || 0 );
		}

		// IF TARGET ELEMENT IS A TEXT NODE THEN USE ITS PARENT NODE
		this.target = target.nodeType === 3 ? target.parentNode : target;;

		this.from_element = ( e.fromElement || e.originalTarget );

		 // RECEPTOR ELEMENT WHILE DRAGGIN
		this.to_element = e.toElement || target;

		this.type = event_name;

		this.page_x = page_x;
		this.page_y = page_y;

		this.key_code = key_code;
		this.key_value = key_value;
		this.metaKey = meta_key;

		this.delta = delta;

		this.capslock = capslock;

		this.button = e.button;
		
		this.relatedTarget = e.relatedTarget ||
			event_name == 'mouseover' ? e.fromElement :
			event_name == 'mouseout' ? e.toElement : null;
	}

	epic_event.prototype = {
		preventDefault: function() {
			this.original.preventDefault();
		},

		stopPropagation: function() {
			var original_event = this.original;
			
			original_event.cancelBubble = true;
			original_event.stopPropagation();
			original_event.preventDefault();
			
			return false;
		}
	};

	event.add = add;
	event.remove = remove;
	event.trigger = trigger;
	event.registry = REGISTRY;

	epic.event = event;

//	function get_uid( object ) {
//		if( is_element( object ) == false ) {
//			return null;
//		}
//
//		return object.uid || ( object.uid = next_uid() );
//	}

//	function new_registry_entry() {
//		var event_names = [
//			"blur", "focus", "focusin", "focusout", "load", "resize", "scroll", "unload",
//			"click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout",
//			"mouseenter", "mouseleave", "change", "select", "submit", "keydown", "keypress",
//			"keyup", "error", "contextmenu"
//		];
//
//		var i = event_names.length;
//		var object = {};
//
//		while( i-- ) {
//			object[ event_names[ i ] ] = [];
//		}
//
//		return object;
//	}

//	epic.event( element, "click", create_user, data );
//	epic.event.handle( element, "click", create_user, data );
//
//	epic.html( element ).handle( create_user, "click", data );
//	epic.html( element ).on( "click" ).handle( create_user, data );

//	function is_registered( element_uid, event_name, method_uid  ) {
//		var element;
//		var event_data;
//		var method;
//		
//
//		if( element = REGISTRY_POLICE[ element_uid ] ) {
//			if( event_data = element[ event_name ] ) {
//				if( method = event_data[ event_name ] ) {
//					return method[ method_uid ] ? true : false;
//				}
//			}
//		}
//
//		return false;
//	}

} )( epic, window, document )