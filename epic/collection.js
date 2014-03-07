
( function( epic ) {

	function collection() {
		var self = this;
		self.collection = {};
		self.list = [];
	}

	function set( key, item, override ) {
		if( key === undefined || item === undefined ) {
			return null;
		}
		
		key = to_string( key );
		
		var self = this;
		var current = self.collection[ key ];
		var index = current ? current.index : self.list.length;

		if( current && !override) {
			return null;
		}
		
		self.collection[ key ] = {
			key: key,
			value: item,
			index: index
		};
		
		self.list[ index ] = item;

		return item;
	}

	function set_items( key_name, items, override ) {
		if( !(items instanceof Array) ) {
			return null;
		}
		
		var self = this;
		var length = items.length;
		var index = 0;
		var item;
		var key;
		var processed = [];

		while( length-- ) {
			item = items[ index++ ];
			key = item[key_name];
			self.set( key, item, override );

			processed[ processed.length ] = (self.collection[key]||{}).value;
		}

		return processed;
	}

	function get( key ) {
		key = to_string( key );

		var self = this;
		var record = self.collection[ key ] || {};
		var item = record.value;
		
		return item;
	}
	
	function remove( key ) {
		key = to_string( key );
		
		var self = this;
		
		// PROVIDE AN EMPTY RECORD TO AVOID EXCEPTION
		var record = self.collection[ key ] || {};
		var item = record.value;
		var index = record.index;

		if( item ) {
			// REMOVE THE ITEM FROM THE COLLECTION
			delete self.collection[ key ];

			// REMOVE THE ITEM FROM THE ARRAY
			self.list.splice( index, 1 );

			return item;
		}

		return undefined;
	}

	function to_string( key ) {
		return String( key );
	}


	collection.prototype = {
		set: set,
		get: get,
		remove: remove,
		set_items: set_items
	};

	epic.collection = collection;
} )( epic );