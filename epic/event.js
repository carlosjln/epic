( function( epic, window, document ) {
	var REGISTRY = {};
	var REGISTRY_POLICE = {};
	var HANDLERS = {};

	var get_uid = epic.uid.get;
	var contains = epic.html.contains;
	var set_event_handler = document.addEventListener ? add_event_listener : attach_event;
	var trigger = document.createEvent ? dispatch_event : fire_event;
	var get_element_uid = epic.html.get_uid;

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

	function add( element, event_name, method, event_data ) {
		if( typeof event_name !== "string" ) {
			return epic.fail( "[event_name] must be a valid event name." );
		}

		var element_uid = get_element_uid( element );
		var element_events = REGISTRY[ element_uid ] || ( REGISTRY[ element_uid ] = {} );
		var method_uid = get_uid( method );

		// PREVENT THE SNEAKY METHOD FROM REGISTERING MORE THAN ONCE :P
		var police_key = element_uid + "_" + event_name + "_" + method_uid;

		if( REGISTRY_POLICE[ police_key ] ) {
			return false;
		}

		var handler = {
			context: element,
			method: method,
			event_data: event_data || {}
		};

		// FIX THE MOUSEENTER/MOUSEOVER SO THAT IT DOESN'T GET TRIGGERED WHEN HOVERING ELEMENTS WITHIN THE CURRENT NODE
		if( event_name === "mouseover" || event_name === "mouseout" ) {

			// OVERRIDE THE CONTEXT AND USE THAT DATA ON THE OVERRIDEN METHOD
			// THIS AVOIDS THE NEED TO KEEP REFERENCES OVER THE ORIGINAL METHOD OR THE ELEMENT
			handler.context = {
				element: element,
				method: method
			};

			handler.method = function( e, data ) {
				var t = this;
				var elem = t.element;

				if( !contains( elem, e.related_target ) ) {
					t.method.call( elem, e, data );
				}
			};
		}

		( element_events[ event_name ] || ( element_events[ event_name ] = [] ) ).push( handler );

		set_event_handler( element, event_name, element_uid );

		// NOTIFY THE REGISTRY POLICE THAT THIS KEY HAVE BEEN USED
		REGISTRY_POLICE[ police_key ] = true;

		return true;
	}

	function remove( element, event_name, handler ) {

	}

	function dispatch_event( element, event_name ) {
		// Syntax: event.initMouseEvent(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget);
		
		var evt = document.createEvent( 'HTMLEvents' );
		evt.initEvent( event_name, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
		element.dispatchEvent( evt );
		
		return element;
	}

	function fire_event( element, event_name ) {
		var evt = document.createEventObject();
		element.fireEvent( 'on' + event_name , evt );
		
		return element;
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

		var target = evt.target;
		var execution_path = [target];

		while( target = target.parentNode ) {
			execution_path[ execution_path.length ] = target;
		}

		process_execution_path( evt, execution_path );

		if( evt.propagation_stopped === false ) {
			e.cancelBubble = true;
			e.stopPropagation();
		}

		return this;
	}

	function process_execution_path( evt, elements ) {
		var elements_count = elements.length;
		var handlers;
		var handler;
		var element;
		var events;
		var i = 0;
		var j;
		var handlers_count;
		var type = evt.type;

		for( ; i < elements_count; i++ ) {
			element = elements[ i ];
			events = REGISTRY[ get_element_uid( element ) ];

			if( events && ( handlers = events[ type ] ) ) {
				handlers_count = handlers.length;

				// CALLING EPIC HANDLERS
				for( j = 0; j < handlers_count; j++ ) {
					handler = handlers[ j ];
					handler.method.call( handler.context, evt, handler.event_data );

					// CALL IT OFF IF PROPAGATION HAVE BEEN STOPPED
					if( evt.propagation_stopped === true ) {
						return evt;
					}

					// CALLLING INLINE HANDLERS?
					// LOOK AT ME @_@ - THEY SHOULDN'T EXIST!
				}
			}
		}

		return evt;
	}

	function epic_event( e ) {
		var target = ( e.target || e.srcElement ) || document;

		var event_name = event_name_map[ e.type ] || e.type;
		var from_element = e.fromElement;
		var related_target = from_element === target ? e.toElement : e.relatedTarget || from_element;

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
		} else if( e.shiftKey || charcode === 16 ) {
			meta_key = 'SHIFT';
		} else if( keycode === 20 ) {
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
		if( keycode > 96 && keycode < 123 && meta_key === 'SHIFT' || keycode > 64 && keycode < 91 && meta_key !== 'SHIFT' ) {
			capslock = true;
		}

		// A BIT OF CORRECTION TO THE BUGGY KEYDOWN AND KEYUP EVENTS
		if( event_name === 'keydown' || event_name === 'keyup' ) {
			if( keyvalue === 'CAPSLOCK' ) {
				capslock = !capslock;
			}

			if( keycode > 64 && keycode < 91 && meta_key !== 'SHIFT' ) {
				keycode = keycode + 32;
				keyvalue = String.fromCharCode( keycode );
			}
		}

		// REPLACE THE KEY VALUE WITH THE ALIAS SPECIFIED ON THE MAP
		if( keycode_map[ keycode ] ) {
			keyvalue = keycode_map[ keycode ];
		}

		// CORRECT WHEEL SCROLL DIRECTION 
		if( event_name === 'mousewheel' ) {
			delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;
			delta = delta > 0 ? 1 : -1;
		}

		if( typeof e.pageX === "undefined" && e.clientX !== null ) {
			var document_element = document.documentElement;
			var body = document.body;

			page_x = e.clientX + ( document_element && document_element.scrollLeft || body && body.scrollLeft || 0 ) - ( document_element && document_element.clientLeft || body && body.clientLeft || 0 );
			page_y = e.clientY + ( document_element && document_element.scrollTop || body && body.scrollTop || 0 ) - ( document_element && document_element.clientTop || body && body.clientTop || 0 );
		}

		var self = this;

		// LET'S KEEP TRACK OF THE ORIGINAL EVENT, FOR FUN :P
		self.original = e;

		self.event_phase = e.eventPhase;

		// IF TARGET ELEMENT IS A TEXT NODE THEN USE ITS PARENT NODE
		self.target = target.nodeType === 3 ? target.parentNode : target;
		self.type = event_name;

		self.from_element = from_element;
		self.to_element = e.toElement || target;

		self.pagex = page_x;
		self.pagey = page_y;

		self.keycode = keycode;
		self.keyvalue = keyvalue;
		self.metaKey = meta_key;

		self.delta = delta;
		self.capslock = capslock;
		self.button = e.button;

		self.related_target = related_target;
		self.propagation_stopped = false;
	}

	epic_event.prototype = {
		prevent_default: function() {
			var foo = this;
			foo.original.preventDefault();
			foo.original.result = false;
		},

		stop_propagation: function() {
			var self = this;
			var original = self.original;

			original.cancelBubble = true;
			original.stopPropagation();

			self.propagation_stopped = true;
		},

		stop: function() {
			var self = this;
			self.prevent_default();
			self.stop_propagation();
		}
	};

	event.add = add;
	event.remove = remove;
	event.trigger = trigger;
	event.registry = REGISTRY;

	epic.event = event;

	// ADD EVENT HANDLING SHORTCUT TO THE HTML SELECTOR
	var plugins = {
		click: function( event_handler, data ) {
			var t = this;
			
			var elements = t.elements;
			var i = elements.length;
			
			while( i-- ) {
				add( elements[i], "click", event_handler, data );
			}

			return t;
		}	
	};

	epic.object.copy( plugins, epic.html.selector.prototype );

} )( epic, window, document );