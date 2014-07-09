( function( epic, undefined ) {
	var object_merge = epic.object.merge;
	var object_copy = epic.object.copy;

	var default_settings = {
		on_start: nothing,
		execute: nothing,
		on_stop: nothing,

		interval: 1000
	};

	function nothing() {}

	function task( settings ) {
		var self = this;
		object_copy( object_merge( default_settings, settings ), self, true );
	}

	task.prototype = {
		construtor: task,

		start: function() {
			var self = this;

			self.timer = setInterval( function() {
				self.execute.call( self );
			}, self.interval );

			self.on_start.call( self );
		},

		stop: function() {
			var self = this;
			clearInterval( self.timer );
			self.on_stop.call( self );
		}
	};

	epic.task = task;
} )( epic );


( function( epic, undefined ) {
	var object_merge = epic.object.merge;
	var object_copy = epic.object.copy;
	var epic_task = epic.task;

	var default_worker_settings = {
		tasks: {}
	};

	function worker( settings ) {
		var self = this;
		object_copy( object_merge( default_worker_settings, settings ), self, true );
	}

	worker.prototype = {
		construtor: worker,

		add: function( id, task ) {
			var self = this;
			var tasks = self.tasks;

			if( !( task instanceof epic_task ) ) {
				throw new Error( "Not a valid task" );
			}

			if( tasks[ id ] !== undefined ) {
				throw new Error( "Task id [" + id + "] is already taken." );
			}

			tasks[ id ] = task;

			return self;
		},

		remove: function( id ) {
			var self = this;

			if( typeof id === "string" ) {
				delete self.tasks[ id ];
			}

			return self;
		},

		start: function( id ) {
			if( typeof id !== "string" ) {
				throw new Error( "The id parameter must be a string." );
			}

			var self = this;
			var task = self.tasks[ id ];

			if( self.current ) {
				self.current.stop();
			}

			self.current = task;
			task.start();

			return self;
		},

		stop: function( id ) {
			var self = this;
			var task = self.tasks[ id ];

			if( task instanceof epic_task ) {
				self.current = null;
				task.stop();
			}

			return self;
		}
	};

	epic.worker = worker;
} )( epic );