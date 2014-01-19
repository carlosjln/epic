var epic = (function () {
    function epic() {
    }
	
	epic.type = (function() {
		var core_types = {
			'[object Boolean]': 'boolean',
			'[object Number]': 'number',
			'[object String]': 'string',
			'[object Function]': 'function',
			'[object Array]': 'array',
			'[object Date]': 'date',
			'[object RegExp]': 'regexp',
			'[object Object]': 'object',
			'[object Error]': 'error'
		};
		
		var to_string = core_types.toString;
		
		function type( object ) {
			var typeof_object = typeof( object );
			
			if( object == null ) return 'null';
			
			if( typeof_object === 'object' || typeof_object === 'function' ) {
				return core_types[ to_string.call(object) ] || 'object';
			}
			
			return typeof_object;
		}

		type.is_window = function( object ) {
			return object != null && object == object.window;
		};
		
		type.is_numeric = function( object ) {
			return !isNaN( parseFloat(object) ) && isFinite( object );
		};
		
		type.is_undefined = function( object ) {
			return typeof( object ) == 'undefined';
		};
		
		type.is_array = function( object ) {
			return type( object ) === "array";
		};

		type.is_function = function( object ) {
			return type( object ) === "function";
		};
		
		type.is_string = function( object ) {
			return type( object ) === "string";
		};
		
		type.is_object = function( object ) {
			return type( object ) === "object";
		};

		type.is_boolean = function( object ) {
			return type( object ) == 'boolean';
		};
		
		type.is_regexp = function( object ) {
			return type( object ) == 'regexp';
		};
		
		type.is_element = function( object ) {
			return object && object.nodeName != null;
		};
		
		return type;
	})();
		
	epic.start = function( callback ) {
		callback();
	};
	
    return epic;
})();