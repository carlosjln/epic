( function( epic, window, document ) {
	var $ = epic.html;

	function create( tag, classname, style, content ) {
		var element = document.createElement( tag );
		
		element.className = classname || "";
		element.style.cssText = style || "";
		element.innerHTML = content || "";
		
		return element;
	}

	// VIEWPORT
	function viewport() {
		var self = this;

		self.views = [];
		self.container = create( "div", "epic-viewport" );
	}

	viewport.prototype.add_view = function() {
		var self = this;
		var views = self.views;
		var v = new view( self );

		self.container.insertBefore( v.container, null );

		views[ views.length ] = v;

		return v;
	};


	// VIEW 
	function view( viewport ) {
		var container = create("div", "epic-view", "");
		var loader = create("span", "epic-view-status", "", "Working..."); 
		var t = this;
		
		t.container = container;
		t.loader = loader;
		t.viewport = viewport;

		container.insertBefore( loader, null );
	}

	view.prototype = {
		is_busy: function( state ) {
			var loader = this.loader;

			loader.style.display = 'none';
			loader.innerHTML = 'Working out...';

			if( state ) {
				loader.style.display = 'inline';

				if( typeof state === "string" ) {
					loader.innerHTML = state;
				}
			}
		},

		activate: function() {
			var self = this;

			var vp = self.viewport;
			var current_view = vp.current_view;

			if( current_view ) {
				current_view.container.style.display = "none";
			}

			self.container.style.display = 'block';
			vp.current_view = self;

			return self;
		},

		empty: function() {
			var self = this;
			var container = self.container;

			self.is_busy( false );

			$( container ).empty().append( self.loader );

			return self;
		},

		append: function( html ) {
			var self = this;
			var content = $.create.document_fragment( html );

			self.container.insertBefore( content, null );

			return self;
		}
	};

	epic.viewport = viewport;
	epic.view = view;
} )( epic, window, document );