
( function( tools ) {

	function array() {
		
	}

	array.flatten = function( items ) {
		var a = [];
		return a.concat.apply( a, items );
	};

	array.each = Array.prototype.forEach || function( list, callback ) {
		var i = 0;
		var length = list.length;
		
		for(; i < length; i++ ) {
			if( callback( list[i], i, list ) === false ) {
				break;
			}
		}
	};

	tools.array = array;

} )( epic.tools || ( epic.tools = {} ) );