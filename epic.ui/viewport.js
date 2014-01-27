( function( epic ) {
	
	// VIEWPORT
	function viewport( target ) {
		this.views = [];
		this.target = target;
	}

	viewport.prototype.add_view = function( view ) {
		var t = this;
		var views = t.views;

		view = view || new epic.view( t );

		t.target.insertBefore( view.container );

		views[ views.length ] = view;

		return view;
	};


	// VIEW 
	function view( viewport ) {
		var container = $( '<div class="container stretch" style="display: none;"></div>' );
		var loader = $( '<span class="view-status" style="display: none;">Working...</span>' );

		this.container = container[ 0 ];
		this.loader = loader[ 0 ];
		this.viewport = viewport;

		container.append( loader );
	}

	view.prototype = {
		is_busy: function( state ) {
			var loader = this.loader;
			loader.style.display = 'none';
			loader.innerHTML = 'Working out...';

			if( state ) {
				loader.style.display = 'inline';
				
				if( typeof state == "string" ) {
					loader.innerHTML = state;
				}
			}
		},

		activate: function() {
			var t = this;

			var container = $( t.container );
			var viewport = t.viewport;
			var current_view = viewport.current_view;

			if( current_view ) {
				$( current_view.container ).css( 'display', 'none' );
			}

			container.css( 'display', 'block' );
			viewport.current_view = t;

			return t;
		},

		empty: function() {
			var t = this;
			var container = t.container;
			
			t.is_busy( false );
			
			epic.html( container ).empty().append( t.loader );

			return t;
		},

		append: function( html ) {
			$( this.container ).append( html );
			return this;
		}
	};
	
	epic.viewport = viewport;
	epic.view = view;
} )( epic );