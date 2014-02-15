( function( epic, widnow, document ) {
	var is_html = epic.string.is_html;
	var array = epic.array;
	var to_array = Array.prototype.slice;

	function html( query, context ) {
		return new selector( query, context );
	}

	function selector( query, context ) {
		var t = this;

		// RETURN AN EMPTY SELECTOR WHEN QUERY IS DARK MATTER (NULL, FALSE, UNDEFINED, "")
		if( !query ) {
			return t;
		}

		// FEELING LAZY, TAKE IT BACK :P
		if( query instanceof selector ) {
			return query;
		}
		
		var elements = [];
		var node_type = query.nodeType;

		// IS AN HTML ELEMENT ?
		if( node_type ) {
			context = query;

			// IS DOCUMENT FRAGMENT ?
			if( node_type === 11 ) {
				elements = to_array.call( query.childNodes );
			}else {
				elements[0] = query;
			}
		}

		if( typeof query === "string" ) {
			if( query === "body" && !context && document.body ) {
				t.context = document;
				t.elements = [document.body];
				return t;
			}
			
			if( is_html( query ) ) {
				elements = to_array.call( document_fragment( query ).childNodes );
			}
		}

		t.query = query;
		t.context = context || [document];
		t.elements = elements;
	}

	function flatten( list ) {
		return array.flatten(
			array.each( list, parse_elements )
		);
	}

	function parse_elements( element, index, list ) {
		// IDENTIFIES THE ELEMENT TYPE AND "FIXES" IT BEFORE THE LIST IS FLATTENED
		
		if( element instanceof selector ) {
			list[ index ] = element.elements;

		} else if( is_html( element ) ) {
			list[ index ] = epic.html.create( element );

		} else if( typeof element === "string" ) {
			list[ index ] = create( "textnode", element );

		} else if( element.nodeName ) {
			list[ index ] = element;
		}
	}

	function create( tag /*, value1, value2*/ ) {
		var parameters = arguments;
		var param_1 = parameters[ 1 ];
		var param_2 = parameters[ 2 ];
		var node;

		if( tag === "fragment" ) {
			node = document_fragment( param_1 );

		} else if( tag === 'option' ) {
			node = option( parameters[ 0 ], param_1, param_2 );

		} else if( tag === "textnode" ) {
			node = document.createTextNode( param_1 );

		} else {
			node = document.createElement( tag );
		}

		return node;
	}

	function document_fragment( content, callback ) {
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

	function option( caption, value, selected ) {
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

	function script( code ) {
		var node = document.createElement( "script" );
		var property = ( 'innerText' in node ) ? 'innerText' : 'textContent';
		node.setAttribute( "type", "text/javascript" );

		setTimeout( function() {
			document.getElementsByTagName( 'head' )[ 0 ].insertBefore( node, null );
			node[ property ] = code;
		}, 10 );

		return new epic.html.selector( node );
	}

	function style( css ) {
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

	function contains( container, element ) {
		return container.contains ? container.contains( element ) : !!( container.compareDocumentPosition( element ) & 16 );
	}

	selector.prototype = {
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
			elements = flatten( elements );
			
			var self = this;

			var i = elements.length;
			var target = self.elements[ 0 ];
			var reference = null;

			var element;
			var valid_nodes = [];

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

			while( i-- ) {
				element = elements[ i ];

				if( !element ) {
					continue;
				}

				if( !element.nodeType ) {
					element = document.createTextNode( element );
				}

				target.insertBefore( element, reference );
			}

			return self;
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

		contains: function( element ) {
			return html.contains( this.elements[0], element );
		},

		find: function( query ) {
			throw new epic.fail("selector.find() is feeling sick :(" );
		}
	};

	// STATIC METHODS
	create.document_fragment = document_fragment;
	create.option = option;
	create.script = script;
	create.style = style;
	
	html.contains = contains;
	html.selector = selector;
	html.create = create;

	epic.html = html;

} )( epic, window, document );