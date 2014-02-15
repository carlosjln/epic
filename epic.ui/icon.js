( function( epic ) {

	function icon( settings ) {
		settings = settings || {};

		var self = this;
		var i = self.container = document.createElement( 'i' );
		
		self.name = settings.name || "";
		self.align = settings.align || "";
		self.classes = settings.classes || "";

		self.set_caption( settings.caption );
		i.className = get_class( self );
	}

	function get_class( self ) {
		return (self.name + ' ' + self.align + ' ' + self.classes).replace(/ +/, " ");
	}

	icon.prototype = {
		change: function( name ) {
			var self = this;

			if( name ) {
				self.name = name;
				self.container.className = get_class( self );
			}

			return self;
		},

		set_align: function( alignment ) {
			var self = this;
			
			if( typeof alignment === "string" ) {
				self.align = alignment;
				self.container.className = get_class( self );				
			}

			return self;
		},

		set_caption: function( caption ) {
			var self = this;
			
			if( typeof caption === "string" ) {
				self.container.innerHTML = caption;
			}

			return self;
		},

		hide: function() {
			var self = this;
			self.container.style.display = 'none';
			return self;
		},

		show: function() {
			var self = this;
			self.container.style.display = '';
			return self;
		}
	};

	epic.icon = icon;
	
} )( epic );