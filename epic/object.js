
( function( epic ) {
	
	function object() {
	}

	// (MERGE | COPY | CLONE) ENGINE B-)
	function merge() {
		var objects = arguments;
		var length = objects.length;
		var target = {};
		var source;

		for( var i = 0; i < length; i++ ) {
			source = objects[ i ];

			for( var attribute in source ) {
				target[ attribute ] = source[ attribute ];
			}
		}

		return target;
	}

	merge.deep = function() {

	};

	object.merge = merge;

	object.to_array = function( object ) {
		if( object == null ) {
			return null;
		}

		var array = Array.prototype.slice.call( object );
		return array.length > 0 ? array : [object];
	};

	epic.object = object;
} )( epic );