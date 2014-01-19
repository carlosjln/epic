// BASE64 ENCODE / DECODE
( function( epic ) {
	var key_str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	function encode( input ) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

		var i = 0;
		var key = key_str;

		input = utf8_encode( input );
		var length = input.length;

		while( i < length ) {

			chr1 = input.charCodeAt( i++ );
			chr2 = input.charCodeAt( i++ );
			chr3 = input.charCodeAt( i++ );

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

	function decode( input ) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );

		while( i < input.length ) {

			enc1 = key_str.indexOf( input.charAt( i++ ) );
			enc2 = key_str.indexOf( input.charAt( i++ ) );
			enc3 = key_str.indexOf( input.charAt( i++ ) );
			enc4 = key_str.indexOf( input.charAt( i++ ) );

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

		output = utf8_encode( output );

		return output;

	}

	function utf8_encode( str ) {
		str = str.replace( /\r\n/g, "\n" );
		var utftext = "";
		var i = str.length;
		var n = 0;

		while( i-- ) {
			var c = str.charCodeAt( n++ );

			if( c < 128 ) {
				utftext += String.fromCharCode( c );
			} else if( ( c > 127 ) && ( c < 2048 ) ) {
				utftext += String.fromCharCode( ( c >> 6 ) | 192 );
				utftext += String.fromCharCode( ( c & 63 ) | 128 );
			} else {
				utftext += String.fromCharCode( ( c >> 12 ) | 224 );
				utftext += String.fromCharCode( ( ( c >> 6 ) & 63 ) | 128 );
				utftext += String.fromCharCode( ( c & 63 ) | 128 );
			}
		}

		return utftext;
	}
	
	epic.base64 = {
		encode: encode,
		decode: decode
	};

} )( epic );