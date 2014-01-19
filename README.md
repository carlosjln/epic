Merging properties
====

Returns a new object containing all the properties of the supplied objects

    epic.merge( { a: 1 } ).and( { b: 2} );
	epic.merge( { a: 1 } ).and( { b: 2}, { c: 2} );

	epic.merge.objects( { a: 1 }, { b: 2} );

Copying properties
====

Copies and/or overrides all properties in the target object

	var target = { c: 3};
	epic.copy( { a: 1 }, { b: 2 } ).into( target );
	console.log( target );

Only copies properties that are not defined in target object

	var target = { b: 3};
	epic.copy( { a: 1 }, { b: 2 } ).into_undefined( target );
	console.log( target );

