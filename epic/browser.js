
( function( epic, window, document, navigator ) {
	var agent = navigator.userAgent;
	var vendor = navigator.vendor;
	var platform = navigator.platform;

	// [ USERAGENT, IDENTITY, IDENTITYSEARCH, VERSIONSEARCH ]
	var browser_agent = [
		[agent, "Chrome"],
		[agent, "OmniWeb", '', "OmniWeb/"],
		[vendor, "Safari", "Apple", "Version"],
		[window.opera, "Opera"],
		[vendor, "iCab"],
		[vendor, "Konqueror", "KDE"],
		[agent, "Firefox"],
		[vendor, "Camino"],
		// FOR NEWER NETSCAPES (6+)
		[agent, "Netscape"],
		[agent, "Explorer", "MSIE"],
		[agent, "Gecko", "Mozilla", "rv"],
		// FOR OLDER NETSCAPES (4-)
		[agent, "Netscape", "Mozilla"]
	];

	var browser_os = [
		[platform, "Windows", "Win"],
		[platform, "Mac"],
		[agent, "iPhone", "iPhone/iPod"],
		[platform, "Linux"]
	];

	// GETS THE BROWSER NAME AND VERSION
	var browser_info = search( browser_agent );

	var browser = epic.browser = {
		webkit: agent.indexOf( 'AppleWebKit/' ) > -1,
		gecko: agent.indexOf( 'Gecko' ) > -1 && agent.indexOf( 'KHTML' ) === -1,

		name: browser_info[ 0 ],
		os: search( browser_os )[ 0 ],
		version: browser_info[ 1 ],

		load: function( url, type, callback ) {
			setTimeout( function() {
				request( url, type, callback );
			}, 10 );
		}
	};

	var loaded_documents = [];

	// INTERNET EXPLORER
	browser.ie = ( browser.name === 'explorer' );

	// GET'S THE CURRENT URL PARTS
	browser.get_current_url = get_current_url;

	// AVOID BACKGROUND IMAGE FLICKERING ON INTERNET EXPLORER
	if( browser.ie ) {
		try {
			document.execCommand( "BackgroundImageCache", false, true );
		} catch( er ) {
		}
	}

	// SEARCH BROWSER DATA RETURNS AN ARRAY LIKE: [BROWSER/OS NAME, VERSION]

	function search( array ) {
		var len = array.length;
		var index = 0;

		var item;
		var user_agent;
		var identity;
		var identity_search;
		var version_search;

		while( len-- ) {
			item = array[ index++ ];

			// USERAGENT
			user_agent = item[ 0 ];

			// IDENTITY
			identity = item[ 1 ];

			// IDENTITY SEARCH
			identity_search = item[ 2 ];

			// VERSION SEARCH
			version_search = item[ 3 ];

			if( user_agent ) {
				if( user_agent.indexOf( identity_search || identity ) > -1 ) {
					new RegExp( ( version_search || identity_search || identity ) + "[\\/\\s](\\d+\\.\\d+)" ).test( user_agent );

					// BROWSER/OS NAME, VERSION
					return [epic.string.lowercase( identity ), parseFloat( RegExp.$1 )];
				}
			}
		}

		return null;
	}

	function get_current_url( relative ) {
		var anchor = document.createElement( "a" );
		var port;
		var pathname = '';

		anchor.href = document.location;
		port = parseInt( anchor.port, 10 );

		if( relative ) {
			pathname = anchor.pathname.replace( /^[\/]/, '' );

			if( pathname ) {
				pathname = pathname.substring( 0, pathname.lastIndexOf( "/" ) ) + "/";
			}
		}

		return anchor.protocol + '//' + anchor.hostname + ( port && port !== 0 ? ':' + port : '' ) + '/' + pathname;
	}

	// ASYNC SCRIPTS/STYLESHEETS LOADING
	function request( url, type, callback ) {
		var tag;
		var src = 'src';
		var rel;
		var typeof_script = typeof( type );

		// ADDING BASE URL
		if( /^http/i.test( url ) === false ) {
			url = browser.url + url;
		}

		// ENSURES THE SCRIPT IS REQUESTED ONLY ONCE
		if( loaded_documents[ url ] !== null ) {
			if( callback ) {
				callback.free();
			}

			return loaded_documents[ url ].element;
		}

		if( typeof_script === 'function' ) {
			callback = type;
		}

		if( typeof_script !== 'string' ) {
			type = url.split( '?' )[ 0 ].file_ext();
		}

		if( type === 'js' ) {
			tag = 'script';
			rel = type = 'javascript';

		} else {
			tag = 'link';
			src = 'href';
			rel = 'stylesheet';
		}

		var element = document.createElement( tag );
		element.setAttribute( "type", "text/" + type );
		element.setAttribute( 'rel', rel );
		element.setAttribute( src, url );

		// POOL OF LOADED FILES
		var data = {
			element: element,
			loaded: false,
			callback: callback
		};

		// CALLBACK
		if( callback ) {
			element.onreadystatechange = function() {
				var state = this.readyState;

				if( ( state === 'loaded' || state === 'complete' ) && data.loaded === false ) {
					this.onreadystatechange = null;
					data.loaded = true;
					data.callback();
				}
			};

			element.onload = function() {
				if( data.loaded === false ) {
					data.loaded = true;
					data.callback();
				}
			};

			if( type === 'css' ) {
				if( browser.name === "firefox" ) {
					element.textContent = '@import "' + url + '"';

					var foo = setInterval( function() {
						try {
							// var css_rules = element.sheet.cssRules;

							clearInterval( foo );

							if( callback ) {
								callback();
							}

						} catch( e ) {
						}
					}, 50 );
				}
			}

			// SAFARI DOESN'T SUPPORT EITHER ONLOAD OR READYSTATE, CREATE A TIMER, ONLY WAY TO DO THIS IN SAFARI
			/*
				if( browser.webkit && browser.name == 'opera' ){
					
					loaded_timer[url] = setInterval(function() {
						if (/loaded|complete/.test(document.readyState)) {
							clearInterval( loaded_timer[url] );
							callback();
						}
					}, 100);
					
				}
			*/
		}

		setTimeout( function() {
			document.getElementsByTagName( 'head' )[ 0 ].insertBefore( element, null );
		}, 10 );

		loaded_documents[ url ] = data;

		return element;
	}

} )( epic, window, document, navigator );