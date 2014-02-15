var epic;
( function( epic ) {
	var get_type = epic.type;

	function object( obj ) {
		return new dsl( obj, to_array( arguments ) );
	}

	function dsl( obj, parameters ) {
		this.object = obj;
		this.parameters = parameters;
	}

	// COPYCAT ENGINE B-)
	function copy( source, target, undefined_only ) {
		var new_value;
		var current_value;
		var source_type = get_type( source );
		
		undefined_only = undefined_only === true;

		// HANDLE DATE
		if( source_type === "date" ) {
			target = new Date();
			target.setTime( source.getTime() );
			
			return target;
		}

		// HANDLE ARRAY
		if( source_type === "array" && undefined_only === false ) {
			var index = source.length;
			
			target = target === undefined ? [] : target;
			
			while( index-- ) {
				target[ index ] = copy( source[ index ], target[ index ], undefined_only );	
			}

			return target;
		}

		// HANDLE OBJECTS
		if( source_type === "object" ) {
			target = target === undefined ? {} : target;
			
			for( var attribute in source ) {
				if( source.hasOwnProperty( attribute ) ) {
					new_value = source[ attribute ];
					current_value = target[ attribute ];

					target[ attribute ] = copy( new_value, current_value, undefined_only );
				}
			}

			return target;
		}

		// HANDLE PRIMITIVE TYPES: boolean, number, string, function, error
		return undefined_only ? (target !== undefined ? target : source) : source;
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
		if( typeof object === "undefined" ) {
			return null;
		}

		if( object instanceof Array ) {
			return object;
		}

		var array = Array.prototype.slice.call( object );
		return array.length > 0 ? array : [object];
	}

	// CLASS HIERARCHY EXTENSOR
	function extend( klass, base ) {
		if( typeof klass !== "function" ) {
			return null;
		}
		
		var klass_prototype = klass.prototype;

		// COPY ALL "STATIC" PROPERTIES TO THE INHERITOR
		copy( base, klass, true );

		if( typeof base === "function" ) {
			// COPY ALL PROTOTYPED PROPERTIES TO THE INHERITOR
			copy( base.prototype, klass_prototype, true );
		} else {
			// ASSUME IT IS A PLAIN OBJECT & COPY PROPERTIES TO THE INHERITORS PROTOTYPE
			copy( base, klass_prototype, true );
		}

		klass_prototype.constructor = klass;
		klass_prototype.baseclass = base;
		klass_prototype.base = function() {
			this.baseclass.apply( this, arguments );
		};
	}

	// STATIC METHODS
	object.merge = merge;
	object.copy = copy;
	object.to_array = to_array;
	object.extend = extend;

	// EXPOSE THE DSL SO THAT ITS PROTOTYPE CAN BE ENHANCED WITH MORE METHODS
	object.dsl = dsl;

	epic.object = object;

} )( epic );