( function( epic, document ) {
	var copy = epic.object.copy;
	var purge_spaces = epic.string.purge_spaces;
	var prototype = {
		constructor: icon,
		family: "",
		prefix: "",
		classes: "",

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

	function icon( settings ) {
		settings = settings || {};

		var self = this;
		var i = self.container = document.createElement( 'i' );
		
		copy( settings, self );

		i.className = get_class( self );

//		self.family = settings.family || "";
//		self.prefix = settings.prefix || "";
//		self.name = settings.name || "";
//		
//		self.align = settings.align || "";
//		self.classes = settings.classes || "";

		self.set_caption( self.caption );
	}

	function get_class( self ) {
		return purge_spaces( self.family + ' ' + (self.prefix + '-' + self.name) + ' ' + self.align + ' ' + self.classes );
	}

	icon.setup = function( default_settings ) {
		copy( default_settings, icon.prototype );
	};

	icon.setup( prototype );

	epic.icon = icon;
	
} )( epic, document );