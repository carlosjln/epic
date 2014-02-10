var epic;
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

	array.each = function( list, callback, self ) {
		var i = 0;
		var length = list.length;
		self = self || list;
		
		for(; i < length; i++ ) {
			callback.call( self,  list[i], i, list );
		}
	};

	array.every = function( list, callback, self ) {
		var i = 0;
		var length = list.length;
		self = self || list;
		
		for(; i < length; i++ ) {
			if( callback.call( self,  list[i], i, list ) ) {
				continue;
			}
			
			return false;
		}
		
		return true;
	};
	
	array.filter = function( list, condition, self ) {
		var length = list.length;
		var i = 0;
		
		var result = [];
		var item;
		
		self = self || list;
		
		for(; i < length; i++ ) {
			item = list[i];
			
			if( condition.call(self, item, i, list ) ) {
				result[ result.length ] = item;
			}
		}
		
		return result;
	};

	// EXPOSE THE DSL SO THAT ITS PROTOTYPE CAN BE ENHANCED WITH MORE METHODS
	array.dsl = dsl;

	epic.array = array;

} )( epic );