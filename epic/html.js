( function( epic, widnow, document ) {
	var is_html = epic.string.is_html;
	var array = epic.array;

	function html( query, context ) {
		return new selector( query, context );
	}

	function selector( query, context ) {
		// RETURN AN EMPTY SELECTOR WHEN QUERY IS DARK MATTER (NULL, FALSE, UNDEFINED, "")
		if( !query ) {
			return this;
		}

		if( query instanceof selector ) {
			return query;
		}

		this.query = query;
		this.elements = [];
	}

	function flatten( list ) {
		return array.flatten(
			array.each( list, html_element_parser )
		);
	}

	function html_element_parser( element, index, list ) {
		// IDENTIFIES THE ELEMENT TYPE AND "FIXES" IT BEFORE THE LIST IS FLATTENED

		if( element instanceof selector ) {
			list[ index ] = element.elements;
		} else if( typeof element === "string" ) {
			list[ index ] = epic.html.create( element );
		}
	}

	function create( element ) {
		var params = Array.prototype.slice.call( arguments );
		var node;

		if( is_html( element ) ) {
			return epic.string.to_dom( element );
		}

		if( element === 'option' ) {
			return create.option( params[ 0 ], params[ 1 ], params[ 2 ] );
		}

		if( element === "textnode" ) {
			node = document.createTextNode( element );
		} else {
			node = document.createElement( element );
		}

		return new epic.html.selector( node );
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

			var t = this;

			var i = elements.length;
			var target = t.elements[ 0 ];
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

				// doc.insertBefore( element, doc.firstChild );
				target.insertBefore( element, reference );
			}

			// t.insertBefore( doc, reference );
		},

		append: function() {
			return this.insert( arguments, undefined );
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
		}
	};

	create.document_fragment = function( content, callback ) {
		var document_fragment = document.createDocumentFragment();
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
						document_fragment.appendChild( content_holder.firstChild );
						setTimeout( arguments.callee, 0 );
					} else {
						callback( document_fragment );
					}
				} )();

			} else {
				nodes = content_holder.childNodes;
				index = nodes.length;

				while( index-- ) {
					document_fragment.insertBefore( nodes[ index ], document_fragment.firstChild );
				}
			}

		}

		return document_fragment;
	};

	create.option = function( caption, value, selected ) {
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
	};

	create.script = function( code ) {
		var script = document.createElement( "script" );
		var property = ( 'innerText' in script ) ? 'innerText' : 'textContent';
		script.setAttribute( "type", "text/javascript" );

		setTimeout( function() {
			document.getElementsByTagName( 'head' )[ 0 ].insertBefore( script, null );
			script[ property ] = code;
		}, 10 );

		return new epic.html.selector( script );
	};

	create.style = function( css ) {
		var style = document.createElement( "style" );
		style.setAttribute( "type", "text/css" );

		if( style.styleSheet ) { // IE
			style.styleSheet.cssText = css;

		} else { // the world
			style.insertBefore( document.createTextNode( css ), null );
		}

		document.getElementsByTagName( 'head' )[ 0 ].insertBefore( style, null );

		return new epic.html.selector( style );
	};

	html.contains = function( container, element ) {
		return container.contains ? container.contains( element ) : !!( container.compareDocumentPosition( element ) & 16 );
	};

	html.selector = selector;
	
	html.create = create;

	epic.html = html;

} )( epic, window, document );