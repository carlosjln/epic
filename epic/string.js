
( function( epic ) {

	function string( input ) {
		return new dsl( input );
	}

	function dsl( input ) {
		this.input = input;
	}

	dsl.prototype = {
		encode_base64: encode_base64,
		decode_base64: decode_base64,

		encode_utf8: encode_utf8,
		decode_utf8: decode_utf8,

		encode_url: encode_url,
		decode_url: decode_url,
		
		encode_html_entities: encode_html_entities,
		decode_html_entities: decode_html_entities,

		ucase: ucase,
		lcase: lcase
	};

	epic.string = string;

	// ENCODE/DECODE BASE64
	var B64KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	function encode_base64() {
		var t = this;

		var key = B64KEY;

		var str = t.encode_utf8( t.input );
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
	}

	function decode_base64() {
		var t = this;

		var key = B64KEY;

		var str = t.input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
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

		output = t.decode_utf8( output );

		return output;
	}

	function encode_utf8() {
		var str = this.input.replace( /\r\n/g, "\n" );
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
	}

	function decode_utf8() {
		var str = this.input;
		var length = str.length;
		var index = 0;

		var output = "";
		var charcode;
		var c2;
		var c3;

		while( index < length ) {
			charcode = str.charCodeAt( index );

			if( charcode < 128 ) {
				output += String.fromCharCode( charcode );
				index++;
			} else if( ( charcode > 191 ) && ( charcode < 224 ) ) {
				c2 = str.charCodeAt( index + 1 );
				output += String.fromCharCode( ( ( charcode & 31 ) << 6 ) | ( c2 & 63 ) );
				index += 2;
			} else {
				c2 = str.charCodeAt( index + 1 );
				c3 = str.charCodeAt( index + 2 );
				output += String.fromCharCode( ( ( charcode & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
				index += 3;
			}
		}

		return output;
	}

	// ENCODE/DECODE URL
	function encode_url() {
		return encodeURIComponent( this.input );
	}

	function decode_url() {
		return decodeURIComponent( this.input );
	}

	// ENCODE/DECODE HTML ENTITIES
	function encode_html_entities( encode_reserved_chars ) {
		return this.input.replace( /./g, encode_reserved_chars ? replace_all_html_entities : replace_default_html_entities );
	}

	function decode_html_entities() {
		return this.input.replace( /&#(\d)+;/g, restore_html_entities );
	}

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

	// LOWER/UPPER CASE
	function ucase(){
		return this.input.toUpperCase();
	}
		
	function lcase(){
		return this.input.toLowerCase();
	}
} )( epic );