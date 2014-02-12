var epic;
( function( epic ) {

	function collection() {
		var self = this;
		self.collection = {};
		self.list = [];
	}

	function set( key, value ) {
		if( key === undefined || value === undefined ) {
			return undefined;
		}
		
		key = to_string( key );

		var self = this;
		var old_record = self.collection[ key ];
		var index = old_record ? old_record.index : self.list.length;

		self.collection[ key ] = {
			key: key,
			value: value,
			index: index
		};
		
		self.list[ index ] = value;

		self.event_handler.call( self.event_context, "ITEM_ADDED", value );

		return old_record;
	}

	function get( key ) {
		key = to_string( key );

		var self = this;
		var record = self.collection[ key ] || {};
		var value = record.value;

		if( value ) {
			// ONLY TRIGGER EVENT HANDLER IF AN ACTUAL RECORD/VALUE EXIST
			self.event_handler.call( self.event_context, "ITEM_RETRIEVED", value );
		}
		
		return value;
	}
	
	function remove( key ) {
		key = to_string( key );
		
		var self = this;
		
		// PROVIDE AN EMPTY RECORD TO AVOID EXCEPTION
		var record = self.collection[ key ] || {};
		var value = record.value;
		var index = record.index;

		if( value ) {
			// REMOVE THE ITEM FROM THE COLLECTION
			delete self.collection[ key ];

			// REMOVE THE ITEM FROM THE ARRAY
			self.list.splice( index, 1 );

			// TRIGGER EVENT HANDLER
			self.event_handler.call( self.event_context, "ITEM_REMOVED", value );
			return value;
		}

		return undefined;
	}

	function to_string( key ) {
		return String( key );
	}

	function set_event_handler( handler, context ) {
		var self = this;
		self.event_handler = handler;
		self.event_context = context;
	}

	collection.prototype = {
		set: set,
		get: get,
		remove: remove,

		set_event_handler: set_event_handler,
		event_handler: function( /*event_name, value*/) {},
		event_context: null
	};

	epic.collection = collection;
} )( epic );