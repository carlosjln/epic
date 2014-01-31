( function( epic, widnow, document ) {
	var is_html = epic.string.is_html;

	function html( input ) {
		this.input = input;
		this.arguments = epic.object.to_array( arguments );
	}

	function selector( query ) {
		query = query != null ? query : [];

		this.elements = epic.type( query ) == 'array' ? query : [query];
	}

	function create( element ) {
		var params = Array.prototype.slice.call( arguments );
		var node;

		if( is_html( element ) ) {
			return epic.string.to_dom( element );
		}

		if( element == 'option' ) {
			return create.option( params[ 0 ], params[ 1 ], params[ 2 ] );
		}

		if( element == "textnode" ) {
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
			elements = (
				elements instanceof selector ? elements.elements :
					elements instanceof Array ? elements : [elements]
			);

			var i = elements.length;

			var t = this;
			// var doc = create_document_fragment();
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
					if( node.nodeType == 1 || ( node.nodeType == 3 && trim( node.textContent ) != '' ) ) {
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
		var node = document.createElement( element );

		if( selected == undefined && value === true ) {
			selected = true;
			value = null;
		}

		value = value == null ? caption : value;

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
		
		setTimeout( function () {
			document.getElementsByTagName( 'head' )[0].insertBefore( script, null );
			script[ property ] = code;
		}, 10 );
		
		return new epic.html.selector( script );
	};

	create.style = function( css ) {
		var style = document.createElement( "style" );
		style.setAttribute( "type", "text/css" );
		
		if ( style.styleSheet ) { // IE
			style.styleSheet.cssText = css;

		} else { // the world
			style.insertBefore( document.createTextNode( css ), null );
		}
		
		document.getElementsByTagName( 'head' )[0].insertBefore( style, null );

		return new epic.html.selector( style );
	};

	html.select = function( query ) {
		if( query instanceof query ) {
			return query;
		}

		return new query( query );
	};

	html.selector = selector;

	html.create = create;

	epic.html = html;
} )( epic, window, document );