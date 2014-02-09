( function( epic ) {

	function icon( settings ) {
		settings = settings || {};

		var t = this;
		var i = t.element = document.createElement( 'i' );

		t.name = settings.name || "";
		t.align = settings.align || epic.ui.align.none;
		t.classes = settings.classes || "";

		t.set_caption( settings.caption );

		i.addClass( t.name ).addClass( t.align.toString() ).addClass( t.classes );
	}

	function get_class( t ) {
		return ( t.name = name ) + ' ' + t.align + ' ' + t.classes;
	}

	icon.prototype = {
		change: function( name ) {
			var t = this;

			if( name ) {
				t.name = name;
				t.element.className = get_class( t );
			}

			return t;
		},

		set_align: function( alignment ) {
			var t = this;

			t.align = alignment;
			t.element.className = get_class( t );

			return t;
		},

		set_caption: function( caption ) {
			if( caption ) {
				this.element.innerHTML = caption;
			}

			return this;
		},

		hide: function() {
			this.element.style.display = 'none';
			return this;
		},

		show: function() {
			this.element.style.display = '';
			return this;
		}
	};

	epic.icon = icon;
	
} )( epic );