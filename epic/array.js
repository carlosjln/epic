( function( epic ) {

	function array( list ) {
		return new dsl( list, epic.object.to_array( arguments ) );
	}

	function dsl( list, parameters ) {
		this.object = list;
		this.parameters = parameters;
	}

	function remove( list, index, howmany ) {
		list.splice( index, howmany );
	}

	function locate( list, element ) {
		// HACK TO CONVERT OBJECT.LENGTH TO A UInt32
		var length = list.length >>> 0;

		while( length-- ) {
			if( list[ length ] === element ) {
				return length;
			}
		}

		return -1;
	}

	array.flatten = function( items ) {
		var a = [];
		return a.concat.apply( a, items );
	};

	array.each = function( list, callback, self ) {
		var i = 0;
		var length = list.length;
		self = self || list;

		for( ; i < length; i++ ) {
			callback.call( self, list[ i ], i, list );
		}

		return list;
	};

	array.every = function( list, callback, self ) {
		var i = 0;
		var length = list.length;
		self = self || list;

		for( ; i < length; i++ ) {
			if( callback.call( self, list[ i ], i, list ) ) {
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

		for( ; i < length; i++ ) {
			item = list[ i ];

			if( condition.call( self, item, i, list ) ) {
				result[ result.length ] = item;
			}
		}

		return result;
	};

	array.indexof = function( list, element, from_index ) {
		// HACK TO CONVERT OBJECT.LENGTH TO A UInt32
		var length = list.length >>> 0;

		from_index = +from_index || 0;

		if( Math.abs( from_index ) === Infinity ) {
			from_index = 0;
		}

		if( from_index < 0 ) {
			from_index += length;
			if( from_index < 0 ) {
				from_index = 0;
			}
		}

		for( ; from_index < length; from_index++ ) {
			if( list[ from_index ] === element ) {
				return from_index;
			}
		}

		return -1;
	};

	array.locate = locate;

	array.contains = function( list, element ) {
		return locate( list, element) > -1 ? true : false;
	};

	array.remove = remove;

	// EXPOSE THE DSL SO THAT ITS PROTOTYPE CAN BE ENHANCED WITH MORE METHODS
	array.dsl = dsl;

	epic.array = array;
} )
( epic );