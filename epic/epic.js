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
			var type = typeof( object );
			
			if( object == null ) return 'null';
			
			if( type === 'object' || type === 'function' ) {
				return core_types[ to_string.call(object) ] || 'object';
			}
			
			return type;
		}
		
		return type;
	})();
		
	epic.start = function( callback ) {
		callback();
	};
	
    return epic;
})();