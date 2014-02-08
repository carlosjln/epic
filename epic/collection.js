
epic.collection = ( function() {

	function collection() {
		this.collection = {};
	}

	collection.prototype = {
		get: get,
		set: set,
		remove: remove,
		to_string: to_string
	};

	function get( key ) {
		var t = this;

		var key_str = t.to_string( key );
		var pair = t.collection[ key_str ];

		if( ( typeof pair ) === 'undefined' ) {
			return undefined;
		}

		return pair.value;
	}

	function set( key, value ) {
		if( key === undefined || value === undefined ) {
			return undefined;
		}

		var previous_value = this.get( key );

		this.collection[ this.to_string( key ) ] = {
			key: key,
			value: value
		};

		return previous_value;
	}

	function remove( key ) {
		var t = this;
		var k = t.to_string( key );
		var previous_element = t.collection[ k ];

		if( previous_element != undefined ) {
			delete this.collection[ k ];
			return previous_element.value;
		}

		return undefined;
	}

	function to_string( key ) {
		return String( key );
	}
	
	return collection;
} )();