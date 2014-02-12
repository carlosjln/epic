( function( epic ) {
		var $ = epic.html;
		
		function box( settings ) {
			var self = this;
			var id = settings.id || ( "box-" + epic.uid.next() );

			var container = $( '<div id="' + id + '" class="box"></div>' );
			var header = $( '<div class="box-header"></div>' );

			var caption_wrapper = $( '<div class="box-caption-wrapper"></div>' );
			var caption = $( '<span class="box-caption"></span>' );

			var controls = $( '<div class="box-controls"></div>' );

			var body = $( '<div class="box-body"></div>' );

			var viewport = self.viewport = new epic.viewport();

			self.settings = settings;
			self.container = container.get( 0 );
			self.header = header.get( 0 );

			self.caption_wrapper = caption_wrapper.get( 0 );
			self.icon = settings.icon || new epic.icon();
			self.caption = caption.get( 0 );

			self.controls = controls.get( 0 );

			self.body = body.get( 0 );
			
			body.append( viewport.container );

			caption_wrapper.append( self.icon.element );
			caption_wrapper.append( caption );

			header.append( caption_wrapper );
			header.append( controls );

			container.append( header );
			container.append( body );

			self.set_caption( settings.caption );
			self.resize( settings.width, settings.height );

			if( settings.singleview ) {
				self.viewport.add_view().activate();
			}

			if( settings.controls ) {
				controls.append( settings.controls );
			}

			if( settings.target ) {
				settings.target.append( container );
			}
		}

		var prototype = box.prototype;
		
		prototype.set_caption = function( caption ) {
			if( caption ) {
				$( this.caption ).html( caption );
			}
		};
		
		prototype.resize = function( width, height ) {
			if( width && height ) {
				var style = this.container.style;

				style.width = width + 'px';
				style.height = height + 'px';
			}
		};

	epic.box = box;

} )( epic );