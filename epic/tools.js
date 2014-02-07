
( function( epic ) {

	// UNIQUE IDENTIFIER
	epic.uid = ( function() {

		function uid() {
		}

		uid.seed = ( new Date() ).getTime();

		uid.next = function() {
			return ++uid.seed;
		};

		return uid;
	} )();

} )( epic );