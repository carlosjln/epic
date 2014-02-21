var epic;
( function( epic ) {

	function collection() {
		var self = this;
		self.collection = {};
		self.list = [];
		self.handlers = {};
	}

	function set( key, item, override ) {
		if( key === undefined || item === undefined ) {
			return undefined;
		}
		
		key = to_string( key );
		
		var self = this;
		var current = self.collection[ key ];
		var index = current ? current.index : self.list.length;

		item = call_event( "ITEM_RECEIVED", self, key, item );
		
		if( current && !override) {
			return call_event( "ITEM_EXISTS", self, key, item, current );
		}

		if( item === undefined ) {
			return call_event( "ITEM_SKIPPED", self, key, item );
		}

		self.collection[ key ] = {
			key: key,
			value: item,
			index: index
		};
		
		self.list[ index ] = item;

		return call_event( "ITEM_ADDED", self, key, item );
	}

	function set_items( key_name, items, override ) {
		if( !(items instanceof Array) ) {
			return;
		}
		
		var self = this;
		var length = items.length;
		var index = 0;
		var item;
		var key;
		var processed = [];

		call_event( "ITEMS_RECEIVED", self, key_name, items );

		while( length-- ) {
			item = items[ index++ ];
			key = item[key_name];
			self.set( key, item, override );

			processed[ processed.length ] = (self.collection[key]||{}).value;
		}

		call_event( "ITEMS_PROCESSED", self, key_name, processed );
	}

	function get( key ) {
		key = to_string( key );

		var self = this;
		var record = self.collection[ key ] || {};
		var item = record.value;
		
		call_event( "ITEM_RETRIEVED", self, key, item );

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

			call_event( "ITEM_REMOVED", self, key, item );

			return item;
		}

		return undefined;
	}

	function to_string( key ) {
		return String( key );
	}

	function handle( event, context, handler ) {
		this.handlers[event] = {
			context: context,
			handler: handler
		};
	}

	function call_event( event_name, self, key, item, param3, param4 ) {
		var event = self.handlers[ event_name ];
		
		if( event ) {
			return event.handler.call( event.context, key, item, param3, param4 );
		}

		return item;
	}

	collection.prototype = {
		set: set,
		get: get,
		remove: remove,
		set_items: set_items,

		handle: handle
	};

	epic.collection = collection;
} )( epic );