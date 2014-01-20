
( function( epic ) {
	
	var object = epic.object = {};
	
	object.to_array = function( object ) {
		return Array.prototype.slice.call( object );
	};

} )( epic );