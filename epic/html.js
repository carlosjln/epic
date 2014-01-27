epic.html = ( function( epic ) {

	function selector( elements ) {
		var t = this;

		if( ( t instanceof selector ) == false ) {
			return new selector( elements );
		}

		t.elements = epic.type( elements ) == 'array' ? elements : [elements];
	}

	function create_document_fragment( content, callback ) {
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

	return selector;
} )( epic );