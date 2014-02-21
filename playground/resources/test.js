var settings = {
	// id: "acapunoteabaje",

	options: [
		{ caption: "0", data: "0" },
		{ caption: "1", data: "1" },
		{ divide: true }
	],
	
//	onselect: function( option ) {
//		console.log( option );
//	}
};

var numbers = new epic.dropdown( settings );

numbers.options.add( {
	caption: "2",
	data: "2",
	// onselect: function( option ) {console.log( "I'm the boss :)", option );}
} );

//numbers.options.get("delete").disable();
//numbers.options.get("delete").remove();

document.body.insertBefore( numbers.container, null );

// BOX TEST
//var box = new epic.box( {
//	width: 300,
//	height: 200,
//	caption: "Hello!",
//	target: document.body,
//	singleview: true
//} );

// BUTTON
//var button = new epic.button( {
//	classes: "epic-box-btn",
//	style: epic.button.style.primary,
//	icon: new epic.icon( {
//		name: "fa-times",
//		classes: "fa"
//	} )
//} );

//box.controls.insertBefore( button.container, null );

// COPYCAT ENGINE TEST
//			var default_settings = {
//				attributes: {
//					name: "a",
//					active: true
//				}
//			};
//
//			var settings = {
//				
//			};
//			
//			var x = epic.object.copy( default_settings, null );
//			
//			console.clear();
//			console.log( JSON.stringify( default_settings ) );
//			console.log( JSON.stringify( settings ) );
//			console.log(default_settings.settings == settings.attributes);

// COLLECTION TEST
//			var collection = new epic.collection();
//			collection.set_event_handler( function( event, value ) {
//				epic.notify( {
//					title: event,
//					message: "Something happened."
//				});
//			} );

// VIEWPORT TEST
//			var viewport = new epic.viewport();
//			var element = viewport.container;
//			viewport.add_view().append("hello!").activate();
//			document.body.insertBefore( element, null );

//			var x = epic.html(element);
//			x.empty().append("boom!");

//			epic.notify( {
//				title: "Hello ^_^",
//				message: "Can you see me? :P"
//			});
//
//			epic.notify.success( "We made it! ^_^ " );
//			epic.notify.warning( "Be careful!" );
//			epic.notify.danger( "RUN!!!" );