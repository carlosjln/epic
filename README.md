About epic.js
====

This JavaScript library aims at being:

1. Readable - No matter how much code you write, things should always make sense.
2. Fast - Every method, variable declaration, closure, etc... will be written taking into account JavaScript best practices to keep it running as fast as possible.

**This is still work on progress.**

On the following commits the code will be imported from my previous JavaScript libraries and then some unit test should be added.

Feedback, suggestions, ideas, bug-fix & constructive critics are always welcome :)

----------

# Usage sample #

## Merging properties ##

Returns a new object containing all the properties of the supplied objects

    epic.merge( { a: 1 } ).and( { b: 2} );
	epic.merge( { a: 1 } ).and( { b: 2}, ... );

	epic.merge.objects( { a: 1 }, ... );

## Copying properties ##

Copies and/or overrides all properties in the target object

	var target = { c: 3};
	epic.copy( { a: 1 }, { b: 2 } ).into( target );
	console.log( target );

Only copies properties that are not defined in target object

	var target = { b: 3};
	epic.copy( { a: 1 }, { b: 2 } ).into_undefined( target );
	console.log( target );

