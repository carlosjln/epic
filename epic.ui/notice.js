( function( epic ) {

	function notice( settings ) {
		settings = this.settings = epic.object.merge( notice.default_settings, settings );

		var element = this.element = document.createElement( 'div' );
//		var inner = this.inner = document.createElement( 'span' );
//		
//		var type = settings.type;
//		var message = settings.message;
//		var target = settings.target;
//		
//		element.insertBefore( inner, null );
//		inner.className = 'message';
//		
//		element.className = "notice notice-" + (type ? type : "default");
//		
//		if( message ) {
//			inner.innerHTML = message;
//		}
//		
//		if( target ){
//			target.insertBefore( element, null );
//		}
	}

	notice.prototype = {
		message: function( message ) {
			this.inner.innerHTML = message;
			return this;
		},

		show: function (){
			this.element.style.display = 'block';
			return this;
		},

		hide: function (){
			this.element.style.display = 'none';
			return this;
		},
		
		as_success: function() {
			this.element.className = "notice-success";
			return this;
		},
		
		as_info: function() {
			this.element.className = "notice-info";
			return this;
		},
		
		as_warning: function() {
			this.element.className = "notice-warning";
			return this;
		},
		
		as_danger: function() {
			this.element.className = "notice-danger";
			return this;
		}
	};
	
	notice.default_settings = {
		message: "",
		type: "",
		target: null,
		
		closable: false
	};

	notice.type = {
		success: 'success',
		info: 'info',
		warning: 'warning',
		danger: 'danger'
	};

	epic.notice = notice;
} )( epic );