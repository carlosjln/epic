
( function( epic ) {
	
	epic.collection = (function () {
		
        function collection() {
            this.collection = {};
        }

		var prototype = collection.prototype;
		
		prototype.get = function (key) {
            var t = this;

            var key_str = t.to_string(key);
            var pair = t.collection[key_str];

            if ((typeof pair) === 'undefined') {
                return undefined;
            }

            return pair.value;
        };

        prototype.set = function (key, value) {
            if (key === undefined || value === undefined) {
                return undefined;
            }

            var previous_value = this.get(key);

            this.collection[this.to_string(key)] = {
                key: key,
                value: value
            };

            return previous_value;
        };

        prototype.remove = function (key) {
            var t = this;
            var k = t.to_string(key);
            var previous_element = t.collection[k];

            if (previous_element != undefined) {
                delete this.collection[k];
                return previous_element.value;
            }

            return undefined;
        };

        prototype.to_string = function (key) {
            return String(key);
        };
		
        return collection;
    })();

} )( epic );