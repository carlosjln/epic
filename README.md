epic
====

Simple &amp; awesome JavaScript library for BROGRAMMERS B-)


merging properties
====

returns a new object containing all the properties of the supplied objects
epic.merge( { a: 1 } ).and( { b: 2} );

epic.merge.objects( { a: 1 }, { b: 2} );

copying properties
====

// copies and overrides all properties
var target = { c: 3};
epic.copy( { a: 1 }, { b: 2 } ).into( target );
console.log( target );

// only copies properties that are not defined in target object
var target = { b: 3};
epic.copy( { a: 1 }, { b: 2 } ).into_undefined( target );
console.log( target );
