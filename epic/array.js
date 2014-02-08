
( function( epic ) {

	function array( list ) {
		return new dsl( list, epic.object.to_array( arguments ) );
	}

	function dsl( list, parameters ) {
		this.object = list;
		this.parameters = parameters;
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

	// EXPOSE THE DSL SO THAT ITS PROTOTYPE CAN BE ENHANCED WITH MORE METHODS
	array.dsl = dsl;

	epic.array = array;

} )( epic );