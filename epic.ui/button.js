( function( epic, $ ) {
	var create_document_fragment = epic.html.create.document_fragment;
	
	function button( settings ) {
		settings = settings || {};

		var self = this;
		
		// APPLY ALL SETTINGS TO THE CURRENT INSTANCE
		for( var property in settings ) {
			self[ property ] = settings[ property ];
		}

		var id = self.id = (self.id || "BTN-" + epic.uid.next());
		
		var caption = self.caption;
		var tag = self.tag;
		var size = self.size;
		var style = self.style;
		var attributes = self.attributes;

		var classes = self.classes = ('btn ' + self.classes);
		var role = tag === button.size.button ? 'type="' + self.role + '"' : "";

		var icon = self.icon = settings.icon || new epic.icon();
		var align = epic.ui.align;

		// SETS DEFAULT ALIGNMENT TO THE LEFT
		if( icon.align === align.default ){
			icon.set_align( align.left );
		}
		
		// WHEN THERE'S NO CAPTION
		if( caption === "" ) {
			// INDICATE THAT IT ONLY CONTAINS AN ICON
			if( icon.name !== "" ) {
				classes += " btn-icon-only";
			}
			
			// REMOVE ALIGNMENT
			icon.set_align( align.default );
		}

		var html_tag = '<' + tag + ' id="' + id + '"' + role + ' class="' + classes + ' btn-size-' + size + ' btn-' + style + '" ' + attributes + '></' + tag + '>';
		var element = $( create_document_fragment( html_tag ) ).append( icon.container, caption );

		self.container = element.get( 0 );
	}

	// STATIC PROPERTIES
	button.size = {
		mini: 'mini',
		small: 'small',
		normal: 'normal',
		large: 'large'
	};

	button.tag = {
		anchor: 'a',
		button: 'button'
	};

	button.role = {
		button: 'button',
		submit: 'submit',
		reset: 'reset'
	};

	button.style = {
		'default': 'default',
		primary: 'primary',
		warning: 'warning',
		danger: 'danger',
		success: 'success',
		info: 'info'
	};

	// PROTOTYPED DEFAULT SETTINGS
	var prototype = {
		caption: "",
		classes: "",
		attributes: "",
		tag: button.tag.button,
		size: button.size.normal,
		role: button.role.button,
		style: button.style.default,
	};
	
	epic.object.extend( button, prototype );

	epic.button = button;

} )( epic, epic.html );