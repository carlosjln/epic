
// var epic = epic || (epic = function(){});

(function (tools) {
	
	// UNIQUE IDENTIFIER
    tools.uid = (function () {
        function uid() {}
	    
		uid.seed = (new Date()).getTime();
	    
        uid.new = function () {
            return ++uid.seed;
        };
	    
        return uid;
    })();
    
    // MERGE
    tools.merge = ( function() {
		function merge( obj ) {
			return new dsl( obj );
		}
	    
		function merge_objects( objects, target ) {
			var length = objects.length;
			var source;
			
			target = target || {};
			
			for( var i = 0; i < length; i++ ) {
				source = objects[i];
				
				for (var attribute in source) {
					target[ attribute ] = source[ attribute ];
				}
			}
			
			return target;
		};
	    
		function dsl( source ) {
			this.objects = source;
		}
	    
		dsl.prototype.and = function() {
			var objects = [ this.objects ];
			var args = arguments;
			var index = args.length;
			
			while( index-- ) {
				objects[index + 1] = args[index];
			}
			
			return merge_objects( objects, {} );
		}

		merge.objects = merge_objects;
		
		return merge;
    } )();

    // COPY
    tools.copy = ( function( merge_objects ) {
		function copy() {
			return new dsl( arguments );
		}
	    
		function dsl( objects ) {
			this.objects = objects;
		}
	    
		// copies or overrides all properties
		dsl.prototype.into = function( target ) {
			merge_objects( this.objects, target );
//			var objects = this.objects;
//			var length = objects.length;
//			var source;
//			
//			for( var i = 0; i < length; i++ ) {
//				source = objects[i];
//				
//				for (var attribute in source) {
//					target[ attribute ] = source[ attribute ];
//				}
//			}
		};

		// only copies properties that are not defined in target object
		dsl.prototype.into_undefined = function( target ) {
			var objects = this.objects;
			var length = objects.length;
			var source;
			
			for( var i = 0; i < length; i++ ) {
				source = objects[i];
				
				for (var attribute in source) {
					if( target[ attribute ]  === undefined ) target[ attribute ] = source[ attribute ];
				}
			}
		};
	    
		return copy;
    } )( tools.merge.objects );

})(epic.tools || (epic.tools = {}));