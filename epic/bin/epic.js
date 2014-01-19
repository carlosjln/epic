var epic = (function () {
    function epic() {
    }
    return epic;
})();

var epic;
(function (epic) {
    epic.xxx = function () {
    };
})(epic || (epic = {}));
var epic;
(function (epic) {
    (function (data) {
        (function (collections) {
            var Dictionary = (function () {
                function Dictionary() {
                    this.collection = {};
                }
                Dictionary.prototype.get = function (key) {
                    var t = this;

                    var key_str = t.to_string(key);
                    var pair = t.collection[key_str];

                    if ((typeof pair) === 'undefined') {
                        return undefined;
                    }

                    return pair.value;
                };

                Dictionary.prototype.set = function (key, value) {
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

                Dictionary.prototype.remove = function (key) {
                    var t = this;
                    var k = t.to_string(key);
                    var previous_element = t.collection[k];

                    if (previous_element != undefined) {
                        delete this.collection[k];
                        return previous_element.value;
                    }

                    return undefined;
                };

                Dictionary.prototype.to_string = function (key) {
                    return String(key);
                };
                return Dictionary;
            })();
            collections.Dictionary = Dictionary;
        })(data.collections || (data.collections = {}));
        var collections = data.collections;
    })(epic.data || (epic.data = {}));
    var data = epic.data;
})(epic || (epic = {}));
//# sourceMappingURL=epic.js.map
