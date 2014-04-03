( function( epic, widnow, document ) {
	var is_html = epic.string.is_html;
	var get_epic_uid = epic.uid.get;
	var trim_spaces = epic.string.trim;
	var capitalize = epic.string.capitalize;

	var array = epic.array;
	var flatten = array.flatten;
	var for_each = array.each;
	var to_array = epic.object.to_array;

//	var match_id_selector = /^(?:#([\w-]+))$/i;
//	var match_tag_selector = /^(\w+)$/i;
//	var match_class_only = /^\.([\w\-]+)$/i;
	var match_id_tag_class = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
	
	var match_pixel_value = /^(\d*.?\d*)px$/;
	var match_spaces_between_css_rules = /\ *((;)|(:))+ *([\w]*)/ig;
	var match_css_rules = /\ *((-*\**[\w]+)+): *([\-()\w, .#%]*)/ig;
	var match_css_property_name = /^(\w*(-*)?)*$/i;

	var match_line_return = /\r/g;

	var document_element = document.documentElement;

	var contains = 'compareDocumentPosition' in document_element ? compare_document_position : container_contains;
	var get_computed_style = window.getComputedStyle ?
		function( element, property ) {
			var style = element.ownerDocument.defaultView.getComputedStyle( element, null );
			return style ? style.getPropertyValue( property ) || style[ property ] : undefined;
		} :
		function( element, property ) {
			return element.curentStyle[ property ];
		};

	function html( query, context ) {
		return new selector( query, context );
	}

	function selector( query, context ) {
		var t = this;
		var elements = [];

		// NORMALIZE CONTEXT
		if( !context ) {
			context = document;
			
		} else if( typeof context === 'string' ) {
			context = selector( context ).elements[ 0 ];
			
		} else if( !context.nodeType && isFinite( context.length ) ) {
			context = context[ 0 ];
		}

		// I ONLY KNOW WHAT TO DO WITH NON-DARK MATTER (NULL, FALSE, UNDEFINED, "")
		if( query ) {
			
			if( typeof query === "string" ) {
				if( query === "body" && !context && document.body ) {
					elements = [document.body];

				} else if( is_html( query ) ) {
					elements = to_array( create_document_fragment( query ).childNodes );

				} else {
					// LET THE FUN BEGIN :)
					elements = query_selector( query, context );
				}
				
			}else 
			// FEELING LAZY, TAKE IT BACK :P
			if( query instanceof selector ) {
				return query;
			}

			var node_type = query.nodeType;

			// IS AN HTML ELEMENT ?
			if( node_type ) {

				// IS A DOCUMENT FRAGMENT ?
				if( node_type === 11 ) {
					var child_nodes = query.cloneNode(true).childNodes;

					elements = to_array( child_nodes );
					context = to_array( child_nodes );
				} else {
					elements = [query];
					context = [query];
				}

			}

		}

		t.query = query;
		t.context = context;
		t.elements = elements;
		t.length = elements.length;
	}

	// UTILS
	function parse_elements( element, index, list ) {
		// IDENTIFIES THE ELEMENT TYPE AND "FIXES" IT BEFORE THE LIST IS FLATTENED
		if( element == null ) {
			return;
		}

		if( typeof element === "string" ) {
			if( is_html( element ) ) {
				list[ index ] = create( "fragment", element );

			} else {
				list[ index ] = create( "textnode", element );
			}

		} else if( element instanceof selector ) {
			list[ index ] = element.elements;

		} else if( element.nodeName ) {
			list[ index ] = element;
		}
	}

	function compare_document_position( container, element ) {
		return ( container.compareDocumentPosition( element ) & 16 ) === 16;
	}

	function container_contains( container, element ) {
		container = container === document || container === window ? document_element : container;
		return container !== element && container.contains( element );
	}

	function is_node( object ) {
		var node_type;
		return object && typeof object === 'object' && ( node_type = object.nodeType ) && ( node_type === 1 || node_type === 9 );
	}

	function get_uid( element ) {
		var node_type = ( element || {} ).nodeType;

		if( node_type === 1 || node_type === 9 ) {
			return get_epic_uid( element );
		}

		return null;
	}

	function query_selector( query, context ) {
		var context_node_type = context.nodeType;
		var match = match_id_tag_class.exec( query ) || {};
		var element;
		
		var id = match[1];
		var tag = match[2];
		var class_name = match[3];
		
		var result = [];
		
		// #ID
		if( id ) {
			// CONTEXT IS A DOCUMENT
			if( context_node_type === 9 ) {
				result = context.getElementById( id );
				
			}else if ( context.ownerDocument && (element = context.ownerDocument.getElementById( id )) && contains( context, element ) && element.id === id ) {
				result = element;
			}
			
		// TAG
		} else if( tag ) {
			result = context.getElementsByTagName( tag );
			
		// .CLASS
		}else if( class_name ) {
			result = context.getElementsByClassName( class_name );
			
		} else if( context.querySelectorAll ) {
			result = context.querySelectorAll( query );
		}
		
		return to_array( result );
	}

	// BUILDERS
	function create( tag /*, value1, value2*/ ) {
		tag = trim_spaces( tag );
		var parameters = arguments;
		var param_1 = parameters[ 1 ];
		var param_2 = parameters[ 2 ];
		var node;

		if( tag === "fragment" ) {
			node = create_document_fragment( param_1 );

		} else if( tag === 'option' ) {
			node = create_option( parameters[ 0 ], param_1, param_2 );

		} else if( tag === "textnode" ) {
			node = document.createTextNode( param_1 );

		} else {
			node = document.createElement( trim_spaces( tag ) );
		}

		return node;
	}

	function create_document_fragment( content, callback ) {
		var fragment = document.createDocumentFragment();
		var content_holder;
		var index;
		var nodes;

		if( content ) {
			content_holder = document.createElement( 'div' );
			content_holder.innerHTML = content;

			// USE NON-BLOCKING APPEND IF CALL BACK IS SPECIFIED
			if( callback ) {
				( function() {
					if( content_holder.firstChild ) {
						fragment.appendChild( content_holder.firstChild );
						setTimeout( arguments.callee, 0 );
					} else {
						callback( fragment );
					}
				} )();

			} else {
				nodes = content_holder.childNodes;
				index = nodes.length;

				while( index-- ) {
					fragment.insertBefore( nodes[ index ], fragment.firstChild );
				}
			}

		}

		return fragment;
	}

	function create_option( caption, value, selected ) {
		var node = document.createElement( "option" );

		if( selected === undefined && value === true ) {
			selected = true;
			value = undefined;
		}

		value = typeof value === "undefined" ? caption : value;

		// SET THE CAPTION
		node.insertBefore( document.createTextNode( caption ), null );

		// SET THE OPTION VALUE
		node.setAttribute( 'value', value );

		if( selected ) {
			node.setAttribute( 'selected', 'selected' );
		}

		return new epic.html.selector( node );
	}

	function create_script( code ) {
		var node = document.createElement( "script" );
		var property = ( 'innerText' in node ) ? 'innerText' : 'textContent';
		node.setAttribute( "type", "text/javascript" );

		setTimeout( function() {
			document.getElementsByTagName( 'head' )[ 0 ].insertBefore( node, null );
			node[ property ] = code;
		}, 10 );

		return new epic.html.selector( node );
	}

	function create_style( css ) {
		var node = document.createElement( "style" );
		node.setAttribute( "type", "text/css" );

		if( node.styleSheet ) { // IE
			node.styleSheet.cssText = css;

		} else { // the world
			node.insertBefore( document.createTextNode( css ), null );
		}

		document.getElementsByTagName( 'head' )[ 0 ].insertBefore( node, null );

		return new epic.html.selector( node );
	}

	function unique( elements, target, control ) {
		var list = target || [];
		var collection = control || {};

		var length = elements.length;
		var i = 0;
		var uid;
		var element;

		for( ; i < length; i++ ) {
			element = elements[ i ];
			uid = get_uid( element );

			if( collection[ uid ] ) {
				continue;
			}

			collection[ uid ] = true;
			list[ list.length ] = element;
		}

		return list;
	}

	// PROTOTYPED METHODS
	function add_class( element, class_names ) {
		var trim = trim_spaces;
		var class_list = trim( element.className, true ).split( ' ' );
		var class_count;
		var i = 0;
		var name;

		class_names = trim( class_names, true ).split( ' ' );

		for( class_count = class_names.length; i < class_count; i++ ) {
			name = class_names[ i ];

			if( class_list.indexOf( name ) === -1 ) {
				class_list[ class_list.length ] = name;
			}
		}

		element.className = trim( class_list.join( ' ' ) );

		return element;
	}

	function toggle_class( element, class_names ) {
		var trim = trim_spaces;
		var class_list = trim( element.className, true ).split( ' ' );
		var class_count;
		var i = 0;
		var name;
		var index;

		class_names = trim( class_names, true ).split( ' ' );

		for( class_count = class_names.length; i < class_count; i++ ) {
			name = class_names[ i ];
			index = class_list.indexOf( name );
			
			if( index === -1 ) {
				class_list[ class_list.length ] = name;
			}else {
				class_list.splice( index );
			}
		}

		element.className = trim( class_list.join( ' ' ) );

		return element;
	}

	function gs_value( val ) {
		var t = this;

		var elements = t.elements;
		var length = elements.length;
		var element;
		var getter;
		var result;
		var i = 0;

		// GET
		if( arguments.length === 0 ) {
			if( (element = elements[0]) ) {
				getter = gs_value[ element.nodeName.toLowerCase() ];

				if( getter && "get" in getter && (result = getter.get( element )) !== undefined ) {
					return result;
				}
				
				result = element.value;

				return typeof result === "string" ? result.replace( match_line_return, "" ) :
					result === null ? "" : result;
			}

			return undefined;
		}

		// SET
		for( ; i < length; i++ ) {
			element = elements[i];

			if ( element.nodeType !== 1 ) {
				continue;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val === null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			}

			getter = gs_value[ element.nodeName.toLowerCase() ];

			if( !getter || !("set" in getter) && getter.set( element ) === undefined ) {
				element.value = val;
			}
		}

		return t;
	}

	// TODO: IMPROVE, EXTRACT INNER METHODS
	function set_css( element, css, merge ) {
		// INDICATES IF THE NEW RULES WILL BE MERGED INTO THE EXISTING ONES
		merge = typeof merge === "undefined" ? true : false;

		// REMOVES SPACES BETWEEN PROPERTIES
		css = css.replace( match_spaces_between_css_rules, '$2$3$4' );

		var element_style = element.style;

		// COLLAPSE SPACES BETWEEN CSS RULES AND VALUES
		var clean_style = element_style.cssText.replace( match_spaces_between_css_rules, '$2$3$4' );

		if( clean_style && !/;$/.test( clean_style ) ) {
			clean_style += ';';
		}

		if( merge ) {
			var replacer = function( a, property ) {
				var value = a;

				// CREATE NEW REGEXP TO MATCH THE SPECIFIED CSS PROPERTY NAME
				var p = RegExp( "(^|;)+(" + property + "): *([-()\\w, .#%=]*)", "ig" );

				// REPLACE ANY MATCHING CSS PROPERTY WITH THE NEW VALUE
				css = css.replace( p, function( t, x, y, z ) {
					if( z === '-' ) {
						value = '';
					} else {
						value = y + ':' + z;
					}

					return '';
				} );

				return value;
			};

			css = clean_style.replace( match_css_rules, replacer ) + css;
		}

		element_style.cssText = css;

		return element;
	}

	function get_dimension( element, property ) {
		var offset_name = "offset" + capitalize( property );

		if( element ) {
			// IS WINDOW?
			element = element === element.window ? element.document : element;

			if( element.nodeType === 9 ) {
				element = element.document.documentElement;
				return Math.max( element.body[ offset_name ], element[ offset_name ] );
			}

			var value = get_computed_style( element, property );
			if( value !== null && value !== "" ) {
				value = value.replace( match_pixel_value, '$1' );
				return isNaN( value ) ? value : parseFloat( value );
			}
		}

		return null;
	}

	selector.prototype = {
		// CONTENT HANDLING
		empty: function() {
			var t = this;
			var elements = t.elements;
			var index = elements.length;
			var element;

			while( index-- ) {
				element = elements[ index ];

				while( element.firstChild ) {
					element.removeChild( element.firstChild );
				}
			}

			return t;
		},

		insert: function( elements, position ) {
			elements = flatten( for_each( elements, parse_elements ) );
			
			var t = this;
			var elements_count = elements.length;
			var target = t.elements[ 0 ];
			var reference = null;

			var element;
			var valid_nodes = [];

			if( t.elements.length === 0 ) {
				return t;
			}

			if( position !== undefined ) {
				var child_nodes = target.childNodes;
				var j = child_nodes.length;
				var trim = epic.string.trim;
				var index = 0;
				var node;

				while( j-- ) {
					node = child_nodes[ index++ ];

					// ENSURE ONLY ELEMENTS OR TEXT NODES WITH CONTENT ARE CONSIDERED ON THE INDEX
					if( node.nodeType === 1 || ( node.nodeType === 3 && trim( node.textContent ) !== '' ) ) {
						valid_nodes[ valid_nodes.length ] = node;
					}
				}

				if( position > -1 && position < valid_nodes.length ) {
					reference = valid_nodes[ position ];
				}
			}

			while( elements_count-- ) {
				element = elements[ elements_count ];

				if( !element ) {
					continue;
				}

				if( !element.nodeType ) {
					element = document.createTextNode( element );
				}

				target.insertBefore( element, reference );
			}

			return t;
		},

		append: function() {
			return this.insert( arguments, undefined );
		},

		html: function( content ) {
			var self = this;
			var element = self.elements[ 0 ];

			if( element ) {
				if( typeof content === "undefined" ) {
					return element.innerHTML;
				}

				element.innerHTML = content;
			}

			return self;
		},

		// ELEMENTS ACCESS
		get: function( index ) {
			var elements = this.elements;
			var upper_limit = elements.length - 1;

			if( index < 0 ) {
				index = 0;
			} else if( index > upper_limit ) {
				index = upper_limit;
			}

			return elements[ index ];
		},

		find: function( query ) {
			var context = this.elements;
			var length = context.length;
			var i = 0;

			var new_selector = new selector();
			var elements = new_selector.elements;
			var result;
			var collection = {};

			for( ; i < length; i++ ) {
				result = query_selector( query, context[ i ] );
				unique( result, elements, collection );
			}

			new_selector.length = elements.length;
			return new_selector;
		},

		// CLASS HANDLING
		has_class: function( name ) {
			var t = this;

			var elements = t.elements;
			var length = elements.length;
			var i = 0;

			for( ; i < length; ) {
				if( elements[ i++ ].className.indexOf( name ) > -1 ) {
					return true;
				}
			}

			return false;
		},

		add_class: function( class_names ) {
			var t = this;

			var elements = t.elements;
			var length = elements.length;
			var i = 0;

			for( ; i < length; i++ ) {
				add_class( elements[ i ], class_names );
			}

			return t;
		},
		
		toggle_class: function( class_names ) {
			var t = this;

			var elements = t.elements;
			var length = elements.length;
			var i = 0;

			for( ; i < length; i++ ) {
				toggle_class( elements[i], class_names );
			}

			return t;
		},

		remove_class: function( class_name ) {
			var t = this;
			var trailing_spaces = /^\s+|\s+$/g;
			var multiple_spaces = /\s+/g;

			// TRIM, MAKE REGEXP
			var pattern = new RegExp( class_name.replace( trailing_spaces, '' ).replace( multiple_spaces, '|' ), 'g' );

			var elements = t.elements;
			var j = elements.length;
			var element;

			while( j-- ) {
				element = elements[ j ];
				element.className = element.className.replace( pattern, '' ).replace( multiple_spaces, ' ' ).replace( trailing_spaces, ' ' );
			}

			return t;
		},

		// STYLE
		width: function() {
			return get_dimension( this.elements[ 0 ], "width" );
		},

		height: function() {
			return get_dimension( this.elements[ 0 ], "height" );
		},

		css: function( property ) {
			var element = this.elements[ 0 ];

			if( !property ) {
				return element.style.cssText;
			}

			if( match_css_property_name.test( property ) ) {
				return get_computed_style( element, property );
			}
			
			return set_css( element, property );
		},

		// MISC
		contains: function( element ) {
			return contains( this.elements[ 0 ], element );
		},

		prop: function( name, value ) {
			var t = this;
			var elements = t.elements;
			var length = elements.length;
			var element;
			var i = 0;
			
			if( value === undefined ) {
				element = elements[0];
				return element ? element[name]: undefined;
			}

			for( ; i < length; i++ ) {
				element = elements[i];

				if( element ) {
					element[ name ] = value;
				}
			}

			return t;
		},

		value: gs_value
	};

	// STATIC METHODS
	create.document_fragment = create_document_fragment;
	create.option = create_option;
	create.script = create_script;
	create.style = create_style;

	html.contains = contains;
	html.selector = selector;
	html.create = create;
	
	html.add_class = add_class;
	html.toggle_class = toggle_class;

	html.is_node = is_node;
	html.get_uid = get_uid;

	epic.html = html;

} )( epic, window, document );