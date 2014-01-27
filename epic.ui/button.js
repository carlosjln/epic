( function( epic ) {
	
	function button( settings ) {
		var btn = this;

		var id = btn.id = settings.id || epic.tools.uid.next().toString();
		var caption = btn.caption = settings.caption || "";

		var tag = btn.tag = settings.tag || button.tag.button;
		var size = btn.size = settings.size || button.size.normal;
		var role = tag == button.size.button ? 'type="' + ( btn.role = settings.role || button.role.button ) + '"' : "";
		var style = btn.style = settings.style || button.style.none;

		var classes = btn.classes = 'btn ' + ( settings.classes || "" );
		var attributes = btn.attributes = settings.attributes || "";

		var icon = btn.icon = settings.icon || new epic.icon();

		if( icon.align == epic.ui.align.none ){
			icon.set_align( Align.left );
		}
		
		if( caption == "" ) {
			if( icon.name != "" ) {
				classes += " btn-icon-only";
			}
			
			icon.set_align( Align.none );
		}

		var html_tag = '<' + tag + ' id="' + id + '"' + role + ' class="' + classes + ' btn-size-' + size + ' btn-' + style + '" ' + attributes + '></' + tag + '>';
		var element = $( html_tag ).append( icon.element, caption );

		btn.element = element.get( 0 );
	}

	button.size = {
		mini: 'mini',
		small: 'small',
		normal: 'normal',
		large: 'large'
	};

	button.size = {
		anchor: 'a',
		button: 'button'
	};

	button.role = {
		button: 'button',
		submit: 'submit',
		reset: 'reset'
	};

	button.style = {
		none: 'none',
		primary: 'primary',
		warning: 'warning',
		danger: 'danger',
		success: 'success',
		info: 'info'
	};

	epic.button = button;
} )( epic );