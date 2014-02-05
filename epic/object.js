
( function( epic ) {

	function _object( object ) {
		return new dsl( object, to_array( arguments ) );
	}

	function dsl( object, arguments ) {
		this.object = object;
		this.arguments = arguments;
	}

	dsl.prototype = {
		extends_from: function( base_class ) {
			var target = this.object;

			for( var property_name in base_class ) {
				if( base_class.hasOwnProperty( property_name ) ) {
					target[ property_name ] = base_class[ property_name ];
				}
			}

			function object() {
				this.constructor = target;
				this.base_class = base_class;
				this.base = function() {
					this.base_class.apply( this, arguments );
				};
			}

			object.prototype = base_class.prototype;

			target.prototype = new object();
		}

	};

	function __extends( d, b ) {
		for( var p in b ) {
			if( b.hasOwnProperty( p ) ) {
				d[ p ] = b[ p ];
			}
		}

		function __() {
			this.constructor = d;
		}

		__.prototype = b.prototype;

		d.prototype = new __();
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

		for( ; i < length; i++ ) {
			copy( objects[ i ], target );
		}

		return target;
	}

	// TO ARRAY
	function to_array( object ) {
		if( object == null ) {
			return null;
		}

		var array = Array.prototype.slice.call( object );
		return array.length > 0 ? array : [object];
	}

	_object.merge = merge;
	_object.clone = copy;
	_object.to_array = to_array;

	epic.object = _object;

} )( epic );