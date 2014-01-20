
( function( tools ) {

	// UNIQUE IDENTIFIER
	tools.uid = ( function() {
		function uid() {}

		uid.seed = ( new Date() ).getTime();

		uid.new = function() {
			return ++uid.seed;
		};

		return uid;
	} )();

	// MERGE
	tools.merge = ( function() {
		function merge( obj ) {
			return new dsl( obj );
		}

		function merge_objects( objects, target ) {
			var length = objects.length;
			var source;

			target = target || {};

			for( var i = 0; i < length; i++ ) {
				source = objects[ i ];

				for( var attribute in source ) {
					target[ attribute ] = source[ attribute ];
				}
			}

			return target;
		}

		function dsl( source ) {
			this.objects = source;
		}

		dsl.prototype.and = function() {
			var objects = [this.objects];
			var args = arguments;
			var index = args.length;

			while( index-- ) {
				objects[ index + 1 ] = args[ index ];
			}

			return merge_objects( objects, {} );
		}

		merge.objects = merge_objects;

		return merge;
	} )();

	// COPY
	tools.copy = ( function( merge_objects ) {

		function copy() {
			return new dsl( arguments );
		}

		function dsl( objects ) {
			this.objects = objects;
		}

		// copies or overrides all properties
		dsl.prototype.into = function( target ) {
			merge_objects( this.objects, target );
		};

		// only copies properties that are not defined in target object
		dsl.prototype.into_undefined = function( target ) {
			var objects = this.objects;
			var length = objects.length;
			var source;

			for( var i = 0; i < length; i++ ) {
				source = objects[ i ];

				for( var attribute in source ) {
					if( target[ attribute ] === undefined ) target[ attribute ] = source[ attribute ];
				}
			}
		};

		return copy;
	} )( tools.merge.objects );

	// CLONE
	tools.clone = ( function() {
		
		function clone( object, target, deep ) {
			var object_type = epic.type( object );
			var copy;

			switch( object_type ) {
				case "object":
					copy = target || {};
					
					for( var attribute in object ) {
						if( object.hasOwnProperty( attribute ) ){
							copy[ attribute ] = clone( object[ attribute ], null, deep );
						}
					}
					
					break;
					
				case "array":
					copy = target || [];
					
					for( var i = 0, len = object.length; i < len; i++ ) {
						copy[ i ] = clone( object[ i ], null, deep );
					}
					
					break;
					
				case "date":
					copy = new Date();
					copy.setTime( object.getTime() );
					break;
					
				case "null":
				case "string":
				case "function":
					copy = object;

					break;
					
				default:
					epic.fail( "Unable to copy. Object type ["+ object_type +"] isn't supported." );
			}
			
			return copy;
		}

		return clone;
	} )();

} )( epic.tools || ( epic.tools = {} ) );