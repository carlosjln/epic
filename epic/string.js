
( function( epic ) {

	function string( input ) {
		return new dsl( input, epic.object.to_array( arguments ) );
	}

	function dsl( input, arguments ) {
		this.input = input;
		this.arguments = arguments;
	}

	// ENCODE/DECODE BASE64
	var B64KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	string.encode_base64 = function ( input ) {
		var key = B64KEY;

		var str = string.encode_utf8( input );
		var length = str.length;
		var index = 0;

		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

		while( index < length ) {
			chr1 = str.charCodeAt( index++ );
			chr2 = str.charCodeAt( index++ );
			chr3 = str.charCodeAt( index++ );

			enc1 = chr1 >> 2;
			enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
			enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
			enc4 = chr3 & 63;

			if( isNaN( chr2 ) ) {
				enc3 = enc4 = 64;
			} else if( isNaN( chr3 ) ) {
				enc4 = 64;
			}

			output = output + key.charAt( enc1 ) + key.charAt( enc2 ) + key.charAt( enc3 ) + key.charAt( enc4 );
		}

		return output;
	};

	string.decode_base64 = function ( input ) {
		var key = B64KEY;

		var str = input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
		var length = str.length;
		var index = 0;

		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;

		while( index < length ) {
			enc1 = key.indexOf( str.charAt( index++ ) );
			enc2 = key.indexOf( str.charAt( index++ ) );
			enc3 = key.indexOf( str.charAt( index++ ) );
			enc4 = key.indexOf( str.charAt( index++ ) );

			chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
			chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
			chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;

			output = output + String.fromCharCode( chr1 );

			if( enc3 != 64 ) {
				output = output + String.fromCharCode( chr2 );
			}
			if( enc4 != 64 ) {
				output = output + String.fromCharCode( chr3 );
			}
		}

		output = string.decode_utf8( output );

		return output;
	};

	string.encode_utf8 = function ( input ) {
		var str = input.replace( /\r\n/g, "\n" );
		var length = str.length;
		var index = 0;

		var output = "";
		var charcode;

		while( length-- ) {
			charcode = str.charCodeAt( index++ );

			if( charcode < 128 ) {
				output += String.fromCharCode( charcode );
			} else if( ( charcode > 127 ) && ( charcode < 2048 ) ) {
				output += String.fromCharCode( ( charcode >> 6 ) | 192 );
				output += String.fromCharCode( ( charcode & 63 ) | 128 );
			} else {
				output += String.fromCharCode( ( charcode >> 12 ) | 224 );
				output += String.fromCharCode( ( ( charcode >> 6 ) & 63 ) | 128 );
				output += String.fromCharCode( ( charcode & 63 ) | 128 );
			}
		}

		return output;
	};

	string.decode_utf8 = function ( input ) {
		var length = input.length;
		var index = 0;

		var output = "";
		var charcode;
		var c2;
		var c3;

		while( index < length ) {
			charcode = input.charCodeAt( index );

			if( charcode < 128 ) {
				output += String.fromCharCode( charcode );
				index++;
			} else if( ( charcode > 191 ) && ( charcode < 224 ) ) {
				c2 = input.charCodeAt( index + 1 );
				output += String.fromCharCode( ( ( charcode & 31 ) << 6 ) | ( c2 & 63 ) );
				index += 2;
			} else {
				c2 = input.charCodeAt( index + 1 );
				c3 = input.charCodeAt( index + 2 );
				output += String.fromCharCode( ( ( charcode & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
				index += 3;
			}
		}

		return output;
	};

	// ENCODE/DECODE URL
	string.encode_url = function ( input ) {
		return encodeURIComponent( input );
	};

	string.decode_url = function ( input ) {
		return decodeURIComponent( input );
	};

	// ENCODE/DECODE HTML ENTITIES
	string.encode_html_entities = function ( input, encode_reserved_chars ) {
		return input.replace( /./g, encode_reserved_chars ? replace_all_html_entities : replace_default_html_entities );
	};

	string.decode_html_entities = function( input ) {
		return input.replace( /&#(\d)+;/g, restore_html_entities );
	};

	// LOWER/UPPER CASE
	string.uppercase = function( str ) {
		return str.toUpperCase();
	};

	string.lowercase = function( str ) {
		return str.toLowerCase();
	};

	// MISC
	string.is_html = function( str ) {
		return /^<(\w)+(\b[^>]*)\/?>(.*?)(<\w+\/?>)?$/i.test( str );
	};
	
	string.to_dom = function( str ) {
		var container = document.createElement("div");
		container.innerHTML = str;

		return new epic.html.selector( Array.prototype.slice.call( container.childNodes ));
	};


	// PRIVATE USE ONLY
	function replace_default_html_entities( str ) {
		var i = str.charCodeAt( 0 );

		if( ( i > 31 && i < 96 ) || ( i > 96 && i < 127 ) ) {
			return str;
		} else {
			return '&#' + i + ';';
		}
	}

	function replace_all_html_entities( str ) {
		var i = str.charCodeAt( 0 );

		if( ( i != 34 && i != 39 && i != 38 && i != 60 && i != 62 ) && ( ( i > 31 && i < 96 ) || ( i > 96 && i < 127 ) ) ) {
			return str;
		} else {
			return '&#' + i + ';';
		}
	}

	function restore_html_entities( str ) {
		return String.fromCharCode( str.replace( /[#&;]/g, '' ) );
	}

	epic.string = string;
} )( epic );