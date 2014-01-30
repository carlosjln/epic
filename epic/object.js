
( function( epic ) {

	function object() {
	}

	// COPYCAT ENGINE B-)
	function copy( object, target ) {
		var object_type = epic.type( object );
		var clone;

		switch( object_type ) {
			case "object":
				clone = target || {};

				for( var attribute in object ) {
					if( object.hasOwnProperty( attribute ) ) {
						clone[ attribute ] = copy( object[ attribute ] );
					}
				}

				break;

			case "array":
				clone = target || [];

				for( var i = 0, len = object.length; i < len; i++ ) {
					clone[ i ] = copy( object[ i ] );
				}

				break;

			case "date":
				clone = new Date();
				clone.setTime( object.getTime() );
				break;

			// HANDLE PRIMITIVE TYPES: "null", "number", "boolean", "string" "function"
			default:
				clone = object;
				// epic.fail( "Unable to copy. Object type [" + object_type + "] isn't supported." );
		}

		return clone;
	}

	function merge() {
		var objects = arguments;
		var length = objects.length;
		var target = {};
		var i = 0;

		for(; i < length; i++ ) {
			copy( objects[ i ], target );
		}

		return target;
	}

	object.merge = merge;
	object.clone = copy;

	object.to_array = function( object ) {
		if( object == null ) {
			return null;
		}

		var array = Array.prototype.slice.call( object );
		return array.length > 0 ? array : [object];
	};

	epic.object = object;
} )( epic );