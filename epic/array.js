
( function( epic ) {

	function array() {
		
	}

	array.flatten = function( items ) {
		var a = [];
		return a.concat.apply( a, items );
	};

	array.each = Array.prototype.forEach || function( list, callback, self ) {
		var i = 0;
		var length = list.length;
		self = self || list;

		for(; i < length; i++ ) {
			if( callback.call( self,  list[i], i, list ) === false ) {
				break;
			}
		}
	};

	epic.array = array;

} )( epic );