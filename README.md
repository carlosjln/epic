ABOUT EPIC.JS (v 1.0.0)
====

This JavaScript library aims at being:

1. Readable - No matter how much code you write, things should always make sense.
2. Simple - No complicated options or crazy argument swapping.
3. Fast - Everything is written taking into account JavaScript best practices to keep it running as fast as possible.

**This is still work on progress, expect bugs and missing features. Please be patient :)**

On the following commits the code will be imported from my previous JavaScript libraries and then some unit test should be added.

Feedback, suggestions, ideas, bug-fixes & constructive criticisms are always welcome :)

----------

# SAMPLES #


**Identify object types**

	var foo = function(){}
	var date = new Date();
	var error = new Error();
	var match = /./;
	
    epic.type( "" ) === "string";	// true 
	epic.type( 10 ) === "number";	// true
	epic.type( {} ) === "object";	// true
	epic.type( [] ) === "array";	// true
	
	epic.type( date ) === "date";		// true
	epic.type( foo ) === "function";	// true
	epic.type( error ) === "error";		// true
	epic.type( match ) === "regexp";	// true
	
	epic.type( true ) === "boolean";	// true
	epic.type( false ) === "boolean";	// true

**Data parsing**

	epic.parse.url( "http://www.foo.com:9999/virtual/path/?name=foo" );
	
	// returns 
	{
	   "href":"http://www.foo.com:9999/virtual/path/?name=foo",
	   "protocol":"http:",
	   "host":"www.foo.com:9999",
	   "hostname":"www.foo.com",
	   "port":"9999",
	   "path":"/virtual/path/",
	   "query":{
	      "name":"foo"
	   },
	   "bookmark":""
	}

**Logging**
	
The stylish way of saying "console.log" ;)
	
	epic.log( "something" ); 

Logs an *new Error(...)* with the specified message

	epic.fail( "Oops!" );

Logs an *new Error(...)* with the specified message & error number/id

	epic.fail( "Wrong!", 99 ); 

When *epic.fail(...)* is preceded with the keyword *new* then it returns the error object instead of logging it
 
	throw new epic.fail( "Oops!" );		// returns the error so it can be thrown as an exception 


**Executing code when the page loads**

	epic.start( function(){
		// conquer the world!
	} );

A better approach is to place your JavaScript tags at the end of the document right before the closing *</ body >* tag.

**Generating unique identifier**

	epic.uid.next()	// outputs an incremental integer like: 1392264993125

**Copying and cloning objects**

	var default_settings = {
	    timeout: 10,
		foo: "bar"
	};
	
	var settings = {
	    timeout: 5
	};
	
*epic.object.merge( obj[,...] )* **returns a new object** containing all properties from the passed sources.  
	
	epic.object.merge( default_settings, settings );
	
	{
		timeout: 10,
		foo: "bar"
	}

*epic.object.copy( source, target, undefined_only )* copies all properties from the *source* object into the *target* object. This **affects the actual *target* object**.

If you want to preserve the values already defined on the target object, then pass the 3rd parameter flag as *true*

	epic.object.merge( default_settings, settings, true );
	
	{
		timeout: 5,
		foo: "bar"
	}