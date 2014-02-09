( function( epic, window, document ) {
	var REGISTRY = {};
	var REGISTRY_POLICE = {};
	var HANDLERS = {};

	var next_uid = epic.uid.next;
	var contains = epic.html.contains;
	var set_event_handler = document.addEventListener ? add_event_listener : attach_event;

	var event_name_map = {
		"mouseenter": "mouseover",
		"mouseleave": "mouseout",
		"DOMMouseScroll": "mousewheel"
	};

	var keycode_map = {
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

	function event() {

	}

	function add( element, event_name, method, parameters ) {
		if( typeof event_name != "string" ) {
			return epic.fail( "[event_name] must be a valid event name." );
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
			context: element,
			method: method,
			parameters: parameters || {}
		};

		// FIX THE MOUSEENTER/MOUSEOVER SO THAT IT DOESN'T GET TRIGGERED WHEN HOVERING ELEMENTS WITHIN THE CURRENT NODE
		if( event_name == "mouseover" || event_name == "mouseout" ) {

			// OVERRIDE THE CONTEXT AND USE THAT DATA ON THE OVERRIDEN METHOD
			// THIS AVOIDS THE NEED TO KEEP REFERENCES OVER THE ORIGINAL METHOD OR THE ELEMENT
			handler.context = {
				element: element,
				method: method
			};

			handler.method = function( e, params ) {
				var t = this;
				var elem = t.element;
				
				if( !contains( elem, e.related_target ) ) {
					t.method.call( elem, e, params );
				}
			};
		}

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
		var evt = e instanceof epic_event ? e : new epic_event( e );

		var element = evt.target;
		var type = evt.type;
		var events = REGISTRY[ element.uid ];
		var handlers;
		var handler;
		var len;
		var index = 0;
		
		if( events && ( handlers = events[ type ] ) ) {
			len = handlers.length;

			// CALLING EPIC HANDLERS
			while( len-- ) {
				handler = handlers[ index++ ];
				handler.method.call( handler.context, evt, handler.parameters );
			}

			// CALLLING NATIVE HANDLERS
			// READ ME WELL: THEY SHOULDN'T EXIST!
		} 

		// TRIGGER THE HANDLERS ON THE ELEMENT'S PATH
		if( !evt.propagation_stopped ) {
			var parent = element.parentNode;

			if( parent ) {
				evt.target = parent;
				epic_event_handler( evt );
			}
		}
		
		return this;
	}

	function epic_event( e ) {
		var target = ( e.target || e.srcElement ) || document;

		var event_name = event_name_map[ e.type ] || e.type;
		var from_element = e.fromElement;
		var related_target = from_element == target ? e.toElement : e.relatedTarget || from_element;

		var which = e.which;
		var keycode = which ? which : keycode;
		var charcode = e.charCode;
		var keyvalue = '';
		var meta_key;

		var delta = 0;

		var page_x;
		var page_y;

		var capslock = false;

		if( e.altKey ) {
			meta_key = 'ALT';
		} else if( e.ctrlKey || e.metaKey ) {
			meta_key = 'CTRL';
		} else if( e.shiftKey || charcode == 16 ) {
			meta_key = 'SHIFT';
		} else if( keycode == 20 ) {
			meta_key = 'CAPSLOCK';
		}

		// IE
		if( which === undefined && charcode === undefined ) {
			keycode = keycode;

			// THE REST
		} else {

			// IF wich IS DIFFERENT FROM ZERO, IT IS A LETTER, OTHERWISE IS AN SPECIAL CHARACTER
			keycode = which !== 0 && charcode !== 0 ? which : keycode;
		}

		keyvalue = keycode > 31 ? String.fromCharCode( keycode ) : '';

		// IF SHIFT KEY IS NOT PRESSED AND THE KEY CODE RETURNS 'A-Z'
		// OR SHIFT KEY IS PRESSED BUT THE KEY CODE RETURNS 'a-z'.		
		if( keycode > 96 && keycode < 123 && meta_key == 'SHIFT' || keycode > 64 && keycode < 91 && meta_key != 'SHIFT' ) {
			capslock = true;
		}

		// A BIT OF CORRECTION TO THE BUGGY KEYDOWN AND KEYUP EVENTS
		if( event_name == 'keydown' || event_name == 'keyup' ) {
			if( keyvalue == 'CAPSLOCK' ) {
				capslock = !capslock;
			}

			if( keycode > 64 && keycode < 91 && meta_key != 'SHIFT' ) {
				keycode = keycode + 32;
				keyvalue = String.fromCharCode( keycode );
			}
		}

		// REPLACE THE KEY VALUE WITH THE ALIAS SPECIFIED ON THE MAP
		if( keycode_map[ keycode ] ) {
			keyvalue = keycode_map[ keycode ];
		}

		// CORRECT WHEEL SCROLL DIRECTION 
		if( event_name == 'mousewheel' ) {
			delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;
			delta = delta > 0 ? 1 : -1;
		}

		if( typeof e.pageX == "undefined" && e.clientX !== null ) {
			var document_element = document.documentElement;
			var body = document.body;

			page_x = e.clientX + ( document_element && document_element.scrollLeft || body && body.scrollLeft || 0 ) - ( document_element && document_element.clientLeft || body && body.clientLeft || 0 );
			page_y = e.clientY + ( document_element && document_element.scrollTop || body && body.scrollTop || 0 ) - ( document_element && document_element.clientTop || body && body.clientTop || 0 );
		}

		// LET'S KEEP TRACK OF THE ORIGINAL EVENT, FOR FUN :P
		this.original = e;

		// IF TARGET ELEMENT IS A TEXT NODE THEN USE ITS PARENT NODE
		this.target = target.nodeType === 3 ? target.parentNode : target;
		this.type = event_name;

		this.from_element = from_element;
		this.to_element = e.toElement || target;
		
		this.pagex = page_x;
		this.pagey = page_y;

		this.keycode = keycode;
		this.keyvalue = keyvalue;
		this.metaKey = meta_key;

		this.delta = delta;
		this.capslock = capslock;
		this.button = e.button;

		this.related_target = related_target;
		this.propagation_stopped = false;
	}

	epic_event.prototype = {
		prevent_default: function() {
			this.original.preventDefault();
			this.result = false;
		},

		stop_propagation: function() {
			var original = this.original;

			original.cancelBubble = true;
			original.stopPropagation();
			
			this.propagation_stopped = true;
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

} )( epic, window, document );