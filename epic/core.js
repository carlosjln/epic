var epic = ( function() {
	// FAIL LIKE A NINJA, SILENTLY :)
	if( window[ 'console' ] === undefined ) {
		window[ 'console' ] = {
			log: function() {
			}
		};
	}

	function epic() {
	}

	// OBJECT TYPE VERIFICATION
	epic.type = ( function() {
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

			if( object == null ) {
				return 'null';
			}

			if( typeof_object === 'object' || typeof_object === 'function' ) {
				return core_types[ to_string.call( object ) ] || 'object';
			}

			return typeof_object;
		}

		type.is_window = function( object ) {
			return object != null && object == object.window;
		};

		type.is_numeric = function( object ) {
			return !isNaN( parseFloat( object ) ) && isFinite( object );
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
	} )();

	// DATA PARSING
	epic.parse = {
		currency: function( expression, symbol ) {
			var numbers = expression + '';
			var array = numbers.split( '.' );

			var digits = array[ 0 ];
			var decimals = array.length ? '.' + array[ 1 ] : '';

			var pattern = /(\d+)(\d{3})/;

			while( pattern.test( digits ) ) {
				digits = digits.replace( pattern, '$1' + ',' + '$2' );
			}

			return ( symbol ? symbol + ' ' : '' ) + digits + decimals;
		},

		url: function( url ) {
			var anchor = document.createElement( "a" );
			var query = {};

			anchor.href = url;

			anchor.search.replace( /([^?=&]+)(=([^&]*))?/g,
				function( $0, $1, $2, $3 ) {
					query[ $1 ] = $3;
					return $0;
				}
			);

			var json = {
				href: anchor.href,

				protocol: anchor.protocol,

				host: anchor.host,
				hostname: anchor.hostname,

				port: anchor.port,

				path: anchor.pathname,

				query: query,
				bookmark: anchor.hash
			};

			return json;
		}
	};

	epic.fail = function( message ) {
		console.log( message );
	};

	epic.start = function( callback ) {
		callback();
	};

	return epic;
} )();