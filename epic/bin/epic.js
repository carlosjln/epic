/*!
 * EPIC.JS - v1.0.4
 * Simple & awesome JavaScript library for BROGRAMMERS B-)
 * https://github.com/carlosjln/epic
 * 
 * Copyright 2014
 * Released under MIT License
 * https://github.com/carlosjln/epic/blob/master/LICENSE
 * 
 * Author: Carlos J. Lopez
 * https://github.com/carlosjln
 */
var epic = (function() {
        function epic(){}
        function log(message) {
            if (typeof window.console !== "undefined") {
                console.log(epic.object.to_array(arguments))
            }
        }
        function fail(message, number) {
            var error = new Error(message, number);
            if (this instanceof fail) {
                return error
            }
            log(error)
        }
        epic.type = (function() {
            var core_types = {
                    '[object Boolean]': 'boolean', '[object Number]': 'number', '[object String]': 'string', '[object Function]': 'function', '[object Array]': 'array', '[object Date]': 'date', '[object RegExp]': 'regexp', '[object Object]': 'object', '[object Error]': 'error'
                };
            var to_string = core_types.toString;
            function type(object) {
                var typeof_object = typeof(object);
                if (object === null) {
                    return 'null'
                }
                if (typeof_object === 'object' || typeof_object === 'function') {
                    return core_types[to_string.call(object)] || 'object'
                }
                return typeof_object
            }
            type.is_window = function(object) {
                return object !== null && object === object.window
            };
            type.is_numeric = function(object) {
                return !isNaN(parseFloat(object)) && isFinite(object)
            };
            type.is_undefined = function(object) {
                return typeof(object) === 'undefined'
            };
            type.is_array = function(object) {
                return type(object) === "array"
            };
            type.is_function = function(object) {
                return type(object) === "function"
            };
            type.is_string = function(object) {
                return type(object) === "string"
            };
            type.is_object = function(object) {
                return type(object) === "object"
            };
            type.is_boolean = function(object) {
                return type(object) === 'boolean'
            };
            type.is_regexp = function(object) {
                return type(object) === 'regexp'
            };
            type.is_element = function(object) {
                var html_element = typeof HTMLElement === "object";
                return html_element ? object instanceof HTMLElement : object && typeof object === "object" && object.nodeType === 1 && typeof object.nodeName === "string"
            };
            return type
        })();
        epic.parse = {
            currency: function(symbol, expression) {
                if (arguments.length === 1) {
                    expression = symbol;
                    symbol = null
                }
                var numbers = expression + '';
                var array = numbers.split('.');
                var digits = array[0];
                var decimals = array.length > 1 ? '.' + array[1] : '';
                var pattern = /(\d+)(\d{3})/;
                while (pattern.test(digits)) {
                    digits = digits.replace(pattern, '$1' + ',' + '$2')
                }
                return (symbol ? symbol + ' ' : '') + digits + decimals
            }, url: function(url) {
                    var anchor = document.createElement("a");
                    var query = {};
                    anchor.href = url;
                    anchor.search.replace(/([^?=&]+)(=([^&]*))?/g, function($0, $1, $2, $3) {
                        query[$1] = $3;
                        return $0
                    });
                    var json = {
                            href: anchor.href, protocol: anchor.protocol, host: anchor.host, hostname: anchor.hostname, port: anchor.port, path: anchor.pathname, query: query, bookmark: anchor.hash
                        };
                    return json
                }
        };
        epic.log = log;
        epic.fail = fail;
        epic.uid = (function() {
            var token = "__::UID::__";
            function uid(){}
            function next() {
                return ++uid.seed
            }
            uid.seed = (new Date).getTime();
            uid.token = token;
            uid.next = next;
            uid.get = function(object) {
                return object[token] || (object[token] = ++uid.seed)
            };
            return uid
        })();
        epic.start = function(callback) {
            this.fail("Oops! :$ The [onready] feature isn't ready yet.")
        };
        return epic
    })();
(function(epic) {
    var get_type = epic.type;
    function object(obj) {
        return new dsl(obj, to_array(arguments))
    }
    function dsl(obj, parameters) {
        this.object = obj;
        this.parameters = parameters
    }
    function copy(source, target, undefined_only) {
        var new_value;
        var current_value;
        var source_type = get_type(source);
        undefined_only = undefined_only === true;
        if (source_type === "date") {
            target = new Date;
            target.setTime(source.getTime());
            return target
        }
        if (source_type === "array" && undefined_only === false) {
            var index = source.length;
            target = target === undefined ? [] : target;
            while (index--) {
                target[index] = copy(source[index], target[index], undefined_only)
            }
            return target
        }
        if (source_type === "object") {
            target = target === undefined ? {} : target;
            for (var attribute in source) {
                if (source.hasOwnProperty(attribute)) {
                    new_value = source[attribute];
                    current_value = target[attribute];
                    target[attribute] = copy(new_value, current_value, undefined_only)
                }
            }
            return target
        }
        return undefined_only ? (target !== undefined ? target : source) : source
    }
    function merge() {
        var objects = arguments;
        var length = objects.length;
        var target = {};
        var i = 0;
        for (; i < length; i++) {
            copy(objects[i], target)
        }
        return target
    }
    function to_array(object) {
        if (object === undefined || object === null) {
            return []
        }
        if (object instanceof Array) {
            return object
        }
        if (isFinite(object.length)) {
            return Array.prototype.slice.call(object)
        }
        return [object]
    }
    function extend(klass, base) {
        if (typeof klass !== "function") {
            return false
        }
        var klass_prototype = klass.prototype;
        copy(base, klass, true);
        if (typeof base === "function") {
            copy(base.prototype, klass_prototype, true);
            klass_prototype.constructor = klass;
            klass_prototype.baseclass = base;
            klass_prototype.base = function() {
                this.baseclass.apply(this, arguments)
            }
        }
        else {
            copy(base, klass_prototype, true)
        }
        return true
    }
    object.merge = merge;
    object.copy = copy;
    object.to_array = to_array;
    object.extend = extend;
    object.dsl = dsl;
    epic.object = object
})(epic);
(function(epic) {
    var to_array = Array.prototype.slice;
    function string(input) {
        return new dsl(input, to_array.call(arguments))
    }
    function dsl(input, parameters) {
        this.input = input;
        this.parameters = parameters
    }
    function replace_default_html_entities(str) {
        var i = str.charCodeAt(0);
        if ((i > 31 && i < 96) || (i > 96 && i < 127)) {
            return str
        }
        else {
            return '&#' + i + ';'
        }
    }
    function replace_all_html_entities(str) {
        var i = str.charCodeAt(0);
        if ((i !== 34 && i !== 39 && i !== 38 && i !== 60 && i !== 62) && ((i > 31 && i < 96) || (i > 96 && i < 127))) {
            return str
        }
        else {
            return '&#' + i + ';'
        }
    }
    function restore_html_entities(str) {
        return String.fromCharCode(str.replace(/[#&;]/g, ''))
    }
    var B64KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function encode_base64(input) {
        var key = B64KEY;
        var str = string.encode_utf8(input);
        var length = str.length;
        var index = 0;
        var output = "";
        var chr1,
            chr2,
            chr3,
            enc1,
            enc2,
            enc3,
            enc4;
        while (index < length) {
            chr1 = str.charCodeAt(index++);
            chr2 = str.charCodeAt(index++);
            chr3 = str.charCodeAt(index++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            }
            else if (isNaN(chr3)) {
                enc4 = 64
            }
            output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4)
        }
        return output
    }
    function decode_base64(input) {
        var key = B64KEY;
        var str = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var length = str.length;
        var index = 0;
        var output = "";
        var chr1,
            chr2,
            chr3;
        var enc1,
            enc2,
            enc3,
            enc4;
        while (index < length) {
            enc1 = key.indexOf(str.charAt(index++));
            enc2 = key.indexOf(str.charAt(index++));
            enc3 = key.indexOf(str.charAt(index++));
            enc4 = key.indexOf(str.charAt(index++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3)
            }
        }
        output = string.decode_utf8(output);
        return output
    }
    function encode_utf8(input) {
        var str = input.replace(/\r\n/g, "\n");
        var length = str.length;
        var index = 0;
        var output = "";
        var charcode;
        while (length--) {
            charcode = str.charCodeAt(index++);
            if (charcode < 128) {
                output += String.fromCharCode(charcode)
            }
            else if ((charcode > 127) && (charcode < 2048)) {
                output += String.fromCharCode((charcode >> 6) | 192);
                output += String.fromCharCode((charcode & 63) | 128)
            }
            else {
                output += String.fromCharCode((charcode >> 12) | 224);
                output += String.fromCharCode(((charcode >> 6) & 63) | 128);
                output += String.fromCharCode((charcode & 63) | 128)
            }
        }
        return output
    }
    function decode_utf8(input) {
        var length = input.length;
        var index = 0;
        var output = "";
        var charcode;
        var c2;
        var c3;
        while (index < length) {
            charcode = input.charCodeAt(index);
            if (charcode < 128) {
                output += String.fromCharCode(charcode);
                index++
            }
            else if ((charcode > 191) && (charcode < 224)) {
                c2 = input.charCodeAt(index + 1);
                output += String.fromCharCode(((charcode & 31) << 6) | (c2 & 63));
                index += 2
            }
            else {
                c2 = input.charCodeAt(index + 1);
                c3 = input.charCodeAt(index + 2);
                output += String.fromCharCode(((charcode & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                index += 3
            }
        }
        return output
    }
    function encode_url(input) {
        return encodeURIComponent(input)
    }
    function decode_url(input) {
        return decodeURIComponent(input)
    }
    function encode_html_entities(input, encode_reserved_chars) {
        return input.replace(/./g, encode_reserved_chars ? replace_all_html_entities : replace_default_html_entities)
    }
    function decode_html_entities(input) {
        return input.replace(/&#(\d)+;/g, restore_html_entities)
    }
    function uppercase(str) {
        return str.toUpperCase()
    }
    function lowercase(str) {
        return str.toLowerCase()
    }
    function trim(str, collapse_spaces) {
        str = str.replace(/^\s+|\s+$/gm, '');
        if (collapse_spaces) {
            str = str.replace(/\s+/g, ' ')
        }
        return str
    }
    function is_html(str) {
        return (/^(?:\s*(<[\w\W]+>)[^>]*)$/img).test(str)
    }
    function to_dom(str) {
        return epic.html.create.document_fragment(str)
    }
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    string.encode_base64 = encode_base64;
    string.decode_base64 = decode_base64;
    string.encode_utf8 = encode_utf8;
    string.decode_utf8 = decode_utf8;
    string.encode_url = encode_url;
    string.decode_url = decode_url;
    string.encode_html_entities = encode_html_entities;
    string.decode_html_entities = decode_html_entities;
    string.uppercase = uppercase;
    string.lowercase = lowercase;
    string.capitalize = capitalize;
    string.trim = trim;
    string.is_html = is_html;
    string.to_dom = to_dom;
    string.dsl = dsl;
    epic.string = string
})(epic);
(function(epic) {
    function array(list) {
        return new dsl(list, epic.object.to_array(arguments))
    }
    function dsl(list, parameters) {
        this.object = list;
        this.parameters = parameters
    }
    function remove(list, index, howmany) {
        list.splice(index, howmany)
    }
    function locate(list, element) {
        var length = list.length >>> 0;
        while (length--) {
            if (list[length] === element) {
                return length
            }
        }
        return -1
    }
    array.flatten = function(items) {
        var a = [];
        return a.concat.apply(a, items)
    };
    array.each = function(list, callback, self) {
        var i = 0;
        var length = list.length;
        self = self || list;
        for (; i < length; i++) {
            callback.call(self, list[i], i, list)
        }
        return list
    };
    array.every = function(list, callback, self) {
        var i = 0;
        var length = list.length;
        self = self || list;
        for (; i < length; i++) {
            if (callback.call(self, list[i], i, list)) {
                continue
            }
            return false
        }
        return true
    };
    array.filter = function(list, condition, self) {
        var length = list.length;
        var i = 0;
        var result = [];
        var item;
        self = self || list;
        for (; i < length; i++) {
            item = list[i];
            if (condition.call(self, item, i, list)) {
                result[result.length] = item
            }
        }
        return result
    };
    array.indexof = function(list, element, from_index) {
        var length = list.length >>> 0;
        from_index = +from_index || 0;
        if (Math.abs(from_index) === Infinity) {
            from_index = 0
        }
        if (from_index < 0) {
            from_index += length;
            if (from_index < 0) {
                from_index = 0
            }
        }
        for (; from_index < length; from_index++) {
            if (list[from_index] === element) {
                return from_index
            }
        }
        return -1
    };
    array.locate = locate;
    array.contains = function(list, element) {
        return locate(list, element) > -1 ? true : false
    };
    array.remove = remove;
    array.dsl = dsl;
    epic.array = array
})(epic);
(function(epic) {
    function collection() {
        var self = this;
        self.collection = {};
        self.list = []
    }
    function set(key, item, override) {
        if (key === undefined || item === undefined) {
            return null
        }
        key = to_string(key);
        var self = this;
        var current = self.collection[key];
        var index = current ? current.index : self.list.length;
        if (current && !override) {
            return null
        }
        self.collection[key] = {
            key: key, value: item, index: index
        };
        self.list[index] = item;
        return item
    }
    function set_items(key_name, items, override) {
        if (!(items instanceof Array)) {
            return null
        }
        var self = this;
        var length = items.length;
        var index = 0;
        var item;
        var key;
        var processed = [];
        while (length--) {
            item = items[index++];
            key = item[key_name];
            self.set(key, item, override);
            processed[processed.length] = (self.collection[key] || {}).value
        }
        return processed
    }
    function get(key) {
        key = to_string(key);
        var self = this;
        var record = self.collection[key] || {};
        var item = record.value;
        return item
    }
    function remove(key) {
        key = to_string(key);
        var self = this;
        var record = self.collection[key] || {};
        var item = record.value;
        var index = record.index;
        if (item) {
            delete self.collection[key];
            self.list.splice(index, 1);
            return item
        }
        return undefined
    }
    function to_string(key) {
        return String(key)
    }
    collection.prototype = {
        set: set, get: get, remove: remove, set_items: set_items
    };
    epic.collection = collection
})(epic);
(function(epic, window, document, navigator) {
    var agent = navigator.userAgent;
    var vendor = navigator.vendor;
    var platform = navigator.platform;
    var browser_agent = [[agent, "Chrome"], [agent, "OmniWeb", '', "OmniWeb/"], [vendor, "Safari", "Apple", "Version"], [window.opera, "Opera"], [vendor, "iCab"], [vendor, "Konqueror", "KDE"], [agent, "Firefox"], [vendor, "Camino"], [agent, "Netscape"], [agent, "Explorer", "MSIE"], [agent, "Gecko", "Mozilla", "rv"], [agent, "Netscape", "Mozilla"]];
    var browser_os = [[platform, "Windows", "Win"], [platform, "Mac"], [agent, "iPhone", "iPhone/iPod"], [platform, "Linux"]];
    var browser_info = search(browser_agent);
    var browser = epic.browser = {
            webkit: agent.indexOf('AppleWebKit/') > -1, gecko: agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') === -1, name: browser_info[0], os: search(browser_os)[0], version: browser_info[1], load: function(url, type, callback) {
                    setTimeout(function() {
                        request(url, type, callback)
                    }, 10)
                }
        };
    var loaded_documents = [];
    browser.ie = (browser.name === 'explorer');
    browser.get_current_url = get_current_url;
    if (browser.ie) {
        try {
            document.execCommand("BackgroundImageCache", false, true)
        }
        catch(er) {}
    }
    function search(array) {
        var len = array.length;
        var index = 0;
        var item;
        var user_agent;
        var identity;
        var identity_search;
        var version_search;
        while (len--) {
            item = array[index++];
            user_agent = item[0];
            identity = item[1];
            identity_search = item[2];
            version_search = item[3];
            if (user_agent) {
                if (user_agent.indexOf(identity_search || identity) > -1) {
                    new RegExp((version_search || identity_search || identity) + "[\\/\\s](\\d+\\.\\d+)").test(user_agent);
                    return [epic.string.lowercase(identity), parseFloat(RegExp.$1)]
                }
            }
        }
        return null
    }
    function get_current_url(relative) {
        var anchor = document.createElement("a");
        var port;
        var pathname = '';
        anchor.href = document.location;
        port = parseInt(anchor.port, 10);
        if (relative) {
            pathname = anchor.pathname.replace(/^[\/]/, '');
            if (pathname) {
                pathname = pathname.substring(0, pathname.lastIndexOf("/")) + "/"
            }
        }
        return anchor.protocol + '//' + anchor.hostname + (port && port !== 0 ? ':' + port : '') + '/' + pathname
    }
    function request(url, type, callback) {
        var tag;
        var src = 'src';
        var rel;
        var typeof_script = typeof(type);
        if (/^http/i.test(url) === false) {
            url = browser.url + url
        }
        if (loaded_documents[url] !== null) {
            if (callback) {
                callback.free()
            }
            return loaded_documents[url].element
        }
        if (typeof_script === 'function') {
            callback = type
        }
        if (typeof_script !== 'string') {
            type = url.split('?')[0].file_ext()
        }
        if (type === 'js') {
            tag = 'script';
            rel = type = 'javascript'
        }
        else {
            tag = 'link';
            src = 'href';
            rel = 'stylesheet'
        }
        var element = document.createElement(tag);
        element.setAttribute("type", "text/" + type);
        element.setAttribute('rel', rel);
        element.setAttribute(src, url);
        var data = {
                element: element, loaded: false, callback: callback
            };
        if (callback) {
            element.onreadystatechange = function() {
                var state = this.readyState;
                if ((state === 'loaded' || state === 'complete') && data.loaded === false) {
                    this.onreadystatechange = null;
                    data.loaded = true;
                    data.callback()
                }
            };
            element.onload = function() {
                if (data.loaded === false) {
                    data.loaded = true;
                    data.callback()
                }
            };
            if (type === 'css') {
                if (browser.name === "firefox") {
                    element.textContent = '@import "' + url + '"';
                    var foo = setInterval(function() {
                            try {
                                clearInterval(foo);
                                if (callback) {
                                    callback()
                                }
                            }
                            catch(e) {}
                        }, 50)
                }
            }
        }
        setTimeout(function() {
            document.getElementsByTagName('head')[0].insertBefore(element, null)
        }, 10);
        loaded_documents[url] = data;
        return element
    }
})(epic, window, document, navigator);
(function(epic, widnow, document) {
    var is_html = epic.string.is_html;
    var get_epic_uid = epic.uid.get;
    var trim_spaces = epic.string.trim;
    var capitalize = epic.string.capitalize;
    var array = epic.array;
    var flatten = array.flatten;
    var for_each = array.each;
    var array_contains = array.contains;
    var to_array = epic.object.to_array;
    var encode_url = epic.string.encode_url;
    var match_id_tag_class = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    var match_pixel_value = /^(\d*.?\d*)px$/;
    var match_spaces_between_css_rules = /\ *((;)|(:))+ *([\w]*)/ig;
    var match_css_rules = /\ *((-*\**[\w]+)+): *([\-()\w, .#%]*)/ig;
    var match_css_property_name = /^(\w*(-*)?)*$/i;
    var match_line_return = /\r/g;
    var match_trailing_spaces = /^\s+|\s+$/g;
    var match_multiple_spaces = /\s+/g;
    var document_element = document.documentElement;
    var contains = 'compareDocumentPosition' in document_element ? compare_document_position : container_contains;
    var get_computed_style = window.getComputedStyle ? function(element, property) {
            var style = element.ownerDocument.defaultView.getComputedStyle(element, null);
            return style ? style.getPropertyValue(property) || style[property] : undefined
        } : function(element, property) {
            return element.curentStyle[property]
        };
    function html(query, context) {
        return new selector(query, context)
    }
    function selector(query, context) {
        var t = this;
        var elements = [];
        if (!context) {
            context = document
        }
        else if (typeof context === 'string') {
            context = selector(context).elements[0]
        }
        else if (!context.nodeType && isFinite(context.length)) {
            context = context[0]
        }
        if (query) {
            if (typeof query === "string") {
                if (query === "body" && !context && document.body) {
                    elements = [document.body]
                }
                else if (is_html(query)) {
                    elements = to_array(create_document_fragment(query).childNodes)
                }
                else {
                    elements = query_selector(query, context)
                }
            }
            if (query instanceof selector) {
                return query
            }
            var node_type = query.nodeType;
            if (node_type) {
                if (node_type === 11) {
                    var child_nodes = query.cloneNode(true).childNodes;
                    elements = to_array(child_nodes);
                    context = to_array(child_nodes)
                }
                else {
                    elements = [query];
                    context = [query]
                }
            }
        }
        t.query = query;
        t.context = context;
        t.elements = elements;
        t.length = elements.length
    }
    function parse_elements(element, index, list) {
        if (element == null) {
            return
        }
        if (typeof element === "string") {
            if (is_html(element)) {
                list[index] = create("fragment", element)
            }
            else {
                list[index] = create("textnode", element)
            }
        }
        else if (element instanceof selector) {
            list[index] = element.elements
        }
        else if (element.nodeName) {
            list[index] = element
        }
    }
    function compare_document_position(container, element) {
        return (container.compareDocumentPosition(element) & 16) === 16
    }
    function container_contains(container, element) {
        container = container === document || container === window ? document_element : container;
        return container !== element && container.contains(element)
    }
    function is_node(object) {
        var node_type;
        return object && typeof object === 'object' && (node_type = object.nodeType) && (node_type === 1 || node_type === 9)
    }
    function get_uid(element) {
        var node_type = (element || {}).nodeType;
        if (node_type === 1 || node_type === 9) {
            return get_epic_uid(element)
        }
        return null
    }
    function query_selector(query, context) {
        var context_node_type = context.nodeType;
        var match = match_id_tag_class.exec(query) || {};
        var element;
        var id = match[1];
        var tag = match[2];
        var class_name = match[3];
        var result = [];
        if (id) {
            if (context_node_type === 9) {
                result = context.getElementById(id)
            }
            else if (context.ownerDocument && (element = context.ownerDocument.getElementById(id)) && contains(context, element) && element.id === id) {
                result = element
            }
        }
        else if (tag) {
            result = context.getElementsByTagName(tag)
        }
        else if (class_name) {
            result = context.getElementsByClassName(class_name)
        }
        else if (context.querySelectorAll) {
            result = context.querySelectorAll(query)
        }
        return to_array(result)
    }
    function create(tag) {
        tag = trim_spaces(tag);
        var parameters = arguments;
        var param_1 = parameters[1];
        var param_2 = parameters[2];
        var node;
        if (tag === "fragment") {
            node = create_document_fragment(param_1)
        }
        else if (tag === 'option') {
            node = create_option(parameters[0], param_1, param_2)
        }
        else if (tag === "textnode") {
            node = document.createTextNode(param_1)
        }
        else {
            node = document.createElement(trim_spaces(tag))
        }
        return node
    }
    function create_document_fragment(content, callback) {
        var fragment = document.createDocumentFragment();
        var content_holder;
        var index;
        var nodes;
        if (content) {
            content_holder = document.createElement('div');
            content_holder.innerHTML = content;
            if (callback) {
                (function() {
                    if (content_holder.firstChild) {
                        fragment.appendChild(content_holder.firstChild);
                        setTimeout(arguments.callee, 0)
                    }
                    else {
                        callback(fragment)
                    }
                })()
            }
            else {
                nodes = content_holder.childNodes;
                index = nodes.length;
                while (index--) {
                    fragment.insertBefore(nodes[index], fragment.firstChild)
                }
            }
        }
        return fragment
    }
    function create_option(caption, value, selected) {
        var node = document.createElement("option");
        if (selected === undefined && value === true) {
            selected = true;
            value = undefined
        }
        value = typeof value === "undefined" ? caption : value;
        node.insertBefore(document.createTextNode(caption), null);
        node.setAttribute('value', value);
        if (selected) {
            node.setAttribute('selected', 'selected')
        }
        return new epic.html.selector(node)
    }
    function create_script(code) {
        var node = document.createElement("script");
        var property = ('innerText' in node) ? 'innerText' : 'textContent';
        node.setAttribute("type", "text/javascript");
        setTimeout(function() {
            document.getElementsByTagName('head')[0].insertBefore(node, null);
            node[property] = code
        }, 10);
        return new epic.html.selector(node)
    }
    function create_style(css) {
        var node = document.createElement("style");
        node.setAttribute("type", "text/css");
        if (node.styleSheet) {
            node.styleSheet.cssText = css
        }
        else {
            node.insertBefore(document.createTextNode(css), null)
        }
        document.getElementsByTagName('head')[0].insertBefore(node, null);
        return new epic.html.selector(node)
    }
    function unique(elements, target, control) {
        var list = target || [];
        var collection = control || {};
        var length = elements.length;
        var i = 0;
        var uid;
        var element;
        for (; i < length; i++) {
            element = elements[i];
            uid = get_uid(element);
            if (collection[uid]) {
                continue
            }
            collection[uid] = true;
            list[list.length] = element
        }
        return list
    }
    function add_class(element, class_names) {
        var trim = trim_spaces;
        var class_list = trim(element.className, true).split(' ');
        var class_count;
        var i = 0;
        var name;
        class_names = trim(class_names, true).split(' ');
        for (class_count = class_names.length; i < class_count; i++) {
            name = class_names[i];
            if (class_list.indexOf(name) === -1) {
                class_list[class_list.length] = name
            }
        }
        element.className = trim(class_list.join(' '));
        return element
    }
    function toggle_class(element, class_names) {
        var trim = trim_spaces;
        var class_list = trim(element.className, true).split(' ');
        var class_count;
        var i = 0;
        var name;
        var index;
        class_names = trim(class_names, true).split(' ');
        for (class_count = class_names.length; i < class_count; i++) {
            name = class_names[i];
            index = class_list.indexOf(name);
            if (index === -1) {
                class_list[class_list.length] = name
            }
            else {
                class_list.splice(index)
            }
        }
        element.className = trim(class_list.join(' '));
        return element
    }
    function get_set_value(val) {
        var t = this;
        var elements = t.elements;
        var length = elements.length;
        var element;
        var getter;
        var result;
        var i = 0;
        if (arguments.length === 0) {
            if ((element = elements[0])) {
                getter = get_set_value[element.nodeName.toLowerCase()];
                if (getter && ("get" in getter) && (result = getter.get(element)) !== undefined) {
                    return result
                }
                result = element.value;
                return typeof result === "string" ? result.replace(match_line_return, "") : result === null ? "" : result
            }
            return undefined
        }
        for (; i < length; i++) {
            element = elements[i];
            if (element.nodeType !== 1) {
                continue
            }
            if (val === null) {
                val = ""
            }
            else if (typeof val === "number") {
                val += ""
            }
            getter = get_set_value[element.nodeName.toLowerCase()];
            if (!getter || !("set" in getter) && getter.set(element) === undefined) {
                element.value = val
            }
        }
        return t
    }
    function set_css(element, css, merge) {
        merge = typeof merge === "undefined" ? true : false;
        css = css.replace(match_spaces_between_css_rules, '$2$3$4');
        var element_style = element.style;
        var clean_style = element_style.cssText.replace(match_spaces_between_css_rules, '$2$3$4');
        if (clean_style && !/;$/.test(clean_style)) {
            clean_style += ';'
        }
        if (merge) {
            var replacer = function(a, property) {
                    var value = a;
                    var p = RegExp("(^|;)+(" + property + "): *([-()\\w, .#%=]*)", "ig");
                    css = css.replace(p, function(t, x, y, z) {
                        if (z === '-') {
                            value = ''
                        }
                        else {
                            value = y + ':' + z
                        }
                        return ''
                    });
                    return value
                };
            css = clean_style.replace(match_css_rules, replacer) + css
        }
        element_style.cssText = css;
        return element
    }
    function get_dimension(element, property) {
        var offset_name = "offset" + capitalize(property);
        if (element) {
            element = element === element.window ? element.document : element;
            if (element.nodeType === 9) {
                element = element.document.documentElement;
                return Math.max(element.body[offset_name], element[offset_name])
            }
            var value = get_computed_style(element, property);
            if (value !== null && value !== "") {
                value = value.replace(match_pixel_value, '$1');
                return isNaN(value) ? value : parseFloat(value)
            }
        }
        return null
    }
    function set_css_display(context, value) {
        var elements = context.elements;
        var i = elements.length;
        while (i--) {
            elements[i].style.display = value
        }
        return context
    }
    selector.prototype = {
        empty: function() {
            var t = this;
            var elements = t.elements;
            var index = elements.length;
            var element;
            while (index--) {
                element = elements[index];
                while (element.firstChild) {
                    element.removeChild(element.firstChild)
                }
            }
            return t
        }, insert: function(elements, position) {
                elements = flatten(for_each(to_array(elements), parse_elements));
                var t = this;
                var elements_count = elements.length;
                var target = t.elements[0];
                var reference = null;
                var element;
                var valid_nodes = [];
                if (t.elements.length === 0) {
                    return t
                }
                if (position !== undefined) {
                    var child_nodes = target.childNodes;
                    var j = child_nodes.length;
                    var trim = epic.string.trim;
                    var index = 0;
                    var node;
                    while (j--) {
                        node = child_nodes[index++];
                        if (node.nodeType === 1 || (node.nodeType === 3 && trim(node.textContent) !== '')) {
                            valid_nodes[valid_nodes.length] = node
                        }
                    }
                    if (position > -1 && position < valid_nodes.length) {
                        reference = valid_nodes[position]
                    }
                }
                index = 0;
                while (elements_count--) {
                    element = elements[index++];
                    if (!element) {
                        continue
                    }
                    if (!element.nodeType) {
                        element = document.createTextNode(element)
                    }
                    target.insertBefore(element, reference)
                }
                return t
            }, append: function() {
                return this.insert(arguments, undefined)
            }, html: function(content) {
                var self = this;
                var element = self.elements[0];
                if (element) {
                    if (typeof content === "undefined") {
                        return element.innerHTML
                    }
                    element.innerHTML = content
                }
                return self
            }, remove: function() {
                var self = this;
                var elements = self.elements;
                var length = elements.length;
                var i = 0;
                var parent;
                var element;
                for (; i < length; i++) {
                    element = elements[i];
                    parent = element.parentNode;
                    parent.removeChild(element)
                }
                return self
            }, value: get_set_value, get: function(index) {
                var elements = this.elements;
                var upper_limit = elements.length - 1;
                if (index < 0) {
                    index = 0
                }
                else if (index > upper_limit) {
                    index = upper_limit
                }
                return elements[index]
            }, first: function() {
                return new selector(this.elements[0])
            }, find: function(query) {
                var context = this.elements;
                var length = context.length;
                var i = 0;
                var new_selector = new selector;
                var elements = new_selector.elements;
                var result;
                var collection = {};
                for (; i < length; i++) {
                    result = query_selector(query, context[i]);
                    unique(result, elements, collection)
                }
                new_selector.length = elements.length;
                return new_selector
            }, parent: function() {
                return (this.elements[0] || {}).parentNode
            }, parents: function(query) {
                var parents = new selector(query);
                var elements = parents.elements;
                var element = this.elements[0] || {};
                var result = [];
                var current = element;
                while ((current = current.parentNode)) {
                    if (array_contains(elements, current)) {
                        result[result.length] = current
                    }
                }
                parents.elements = result;
                return parents
            }, has_class: function(name) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var i = 0;
                for (; i < length; ) {
                    if (elements[i++].className.indexOf(name) > -1) {
                        return true
                    }
                }
                return false
            }, add_class: function(class_names) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var i = 0;
                for (; i < length; i++) {
                    add_class(elements[i], class_names)
                }
                return t
            }, toggle_class: function(class_names) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var i = 0;
                for (; i < length; i++) {
                    toggle_class(elements[i], class_names)
                }
                return t
            }, remove_class: function(class_name) {
                var t = this;
                var pattern = new RegExp(class_name.replace(match_trailing_spaces, '').replace(match_multiple_spaces, '|'), 'g');
                var elements = t.elements;
                var j = elements.length;
                var element;
                while (j--) {
                    element = elements[j];
                    element.className = element.className.replace(pattern, '').replace(match_multiple_spaces, ' ').replace(match_trailing_spaces, ' ')
                }
                return t
            }, replace_class: function(class_name, new_class_name) {
                var t = this;
                var elements = t.elements;
                var j = elements.length;
                var element;
                while (j--) {
                    element = elements[j];
                    element.className = element.className.replace(class_name, new_class_name).replace(match_multiple_spaces, ' ').replace(match_trailing_spaces, ' ')
                }
                return t
            }, width: function() {
                return get_dimension(this.elements[0], "width")
            }, height: function() {
                return get_dimension(this.elements[0], "height")
            }, css: function(property) {
                var element = this.elements[0];
                if (!property) {
                    return element.style.cssText
                }
                if (match_css_property_name.test(property)) {
                    return get_computed_style(element, property)
                }
                return set_css(element, property)
            }, show: function() {
                return set_css_display(this, '')
            }, hide: function() {
                return set_css_display(this, 'none')
            }, contains: function(element) {
                return contains(this.elements[0], element)
            }, prop: function(name, value) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var element;
                var i = 0;
                if (value === undefined) {
                    element = elements[0];
                    return element ? element[name] : undefined
                }
                for (; i < length; i++) {
                    element = elements[i];
                    if (element) {
                        element[name] = value
                    }
                }
                return t
            }, attr: function(name, value) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var element;
                var i = 0;
                if (value === undefined) {
                    element = elements[0];
                    return element ? element.getAttribute(name) : undefined
                }
                for (; i < length; i++) {
                    element = elements[i];
                    if (element) {
                        element.setAttribute(name, value)
                    }
                }
                return t
            }, remove_attr: function(name) {
                var t = this;
                var elements = t.elements;
                var length = elements.length;
                var element;
                var i = 0;
                for (; i < length; i++) {
                    element = elements[i];
                    if (element) {
                        element.removeAttribute(name)
                    }
                }
                return t
            }, serialize: function() {
                var empty = '';
                var concat = empty;
                var query = empty;
                var amp = '&';
                var t = this;
                var encrypt_method;
                var type;
                var elements = t.find('select').elements;
                var element;
                var element_id;
                var i = elements.length;
                while (i--) {
                    element = array[i];
                    if ((element_id = element.id || element.name || empty) == empty)
                        continue;
                    query += (query != empty ? amp : empty) + element_id + '=' + encode_url(element.value)
                }
                elements = t.find('input').elements;
                i = elements.length;
                while (i--) {
                    element = elements[i];
                    if ((element_id = element.id || element.name || empty) == empty)
                        continue;
                    concat = query != empty ? amp : empty;
                    type = element.type.toLowerCase();
                    value = encode_url(element.value);
                    if ('checkbox,radio'.indexOf(type) > -1) {
                        query += concat + element_id + '=' + (element.checked ? value : empty)
                    }
                    else {
                        encrypt_method = window[element.getAttribute('encrypt-method')];
                        if (encrypt_method) {
                            try {
                                value = encrypt_method(value)
                            }
                            catch(er) {}
                        }
                        query += concat + element_id + '=' + value
                    }
                }
                elements = t.find('textarea').elements;
                i = elements.length;
                while (i--) {
                    element = array[i];
                    if ((element_id = element.id || element.name || empty) == empty)
                        continue;
                    query += (query != empty ? amp : empty) + element_id + '=' + encode_url(element.value)
                }
                return query
            }
    };
    create.document_fragment = create_document_fragment;
    create.option = create_option;
    create.script = create_script;
    create.style = create_style;
    html.contains = contains;
    html.selector = selector;
    html.create = create;
    html.add_class = add_class;
    html.toggle_class = toggle_class;
    html.is_node = is_node;
    html.get_uid = get_uid;
    epic.html = html
})(epic, window, document);
(function(epic, window, document) {
    var REGISTRY = {};
    var REGISTRY_POLICE = {};
    var HANDLERS = {};
    var get_uid = epic.uid.get;
    var contains = epic.html.contains;
    var set_event_handler = document.addEventListener ? add_event_listener : attach_event;
    var trigger = document.createEvent ? dispatch_event : fire_event;
    var get_element_uid = epic.html.get_uid;
    var event_name_map = {
            mouseenter: "mouseover", mouseleave: "mouseout", DOMMouseScroll: "mousewheel"
        };
    var keycode_map = {
            8: 'BACKSPACE', 9: 'TAB', 10: 'ENTER', 13: 'ENTER', 20: 'CAPSLOCK', 27: 'ESC', 33: 'PAGEUP', 34: 'PAGEDOWN', 35: 'END', 36: 'HOME', 37: 'LEFT', 38: 'UP', 39: 'RIGHT', 40: 'DOWN', 45: 'INSERT', 46: 'DELETE'
        };
    function event(){}
    function add(element, event_name, method, event_data) {
        if (typeof event_name !== "string") {
            return epic.fail("[event_name] must be a valid event name.")
        }
        var element_uid = get_element_uid(element);
        var element_events = REGISTRY[element_uid] || (REGISTRY[element_uid] = {});
        var method_uid = get_uid(method);
        var police_key = element_uid + "_" + event_name + "_" + method_uid;
        if (REGISTRY_POLICE[police_key]) {
            return false
        }
        var handler = {
                context: element, method: method, event_data: event_data || {}
            };
        if (event_name === "mouseover" || event_name === "mouseout") {
            handler.context = {
                element: element, method: method
            };
            handler.method = function(e, data) {
                var t = this;
                var elem = t.element;
                if (!contains(elem, e.related_target)) {
                    t.method.call(elem, e, data)
                }
            }
        }
        (element_events[event_name] || (element_events[event_name] = [])).push(handler);
        set_event_handler(element, event_name, element_uid);
        REGISTRY_POLICE[police_key] = true;
        return true
    }
    function remove(element, event_name, handler){}
    function dispatch_event(element, event_name) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(event_name, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        element.dispatchEvent(evt);
        return element
    }
    function fire_event(element, event_name) {
        var evt = document.createEventObject();
        element.fireEvent('on' + event_name, evt);
        return element
    }
    function add_event_listener(element, event_name, element_uid) {
        var element_event = element_uid + "_" + event_name;
        if (!HANDLERS[element_event]) {
            HANDLERS[element_event] = true;
            element.addEventListener(event_name, epic_event_handler, false)
        }
    }
    function attach_event(element, event_name, element_uid) {
        var element_event = element_uid + "_" + event_name;
        if (!HANDLERS[element_event]) {
            HANDLERS[element_event] = true;
            element.attachEvent('on' + event_name, epic_event_handler)
        }
    }
    function epic_event_handler(e) {
        var evt = e instanceof epic_event ? e : new epic_event(e);
        var target = evt.target;
        var execution_path = [target];
        while ((target = target.parentNode)) {
            execution_path[execution_path.length] = target
        }
        process_execution_path(evt, execution_path);
        if (evt.propagation_stopped === false) {
            e.cancelBubble = true;
            e.stopPropagation()
        }
        return this
    }
    function process_execution_path(evt, elements) {
        var elements_count = elements.length;
        var handlers;
        var handler;
        var element;
        var events;
        var i = 0;
        var j;
        var handlers_count;
        var type = evt.type;
        for (; i < elements_count; i++) {
            element = elements[i];
            events = REGISTRY[get_element_uid(element)];
            if (events && (handlers = events[type])) {
                handlers_count = handlers.length;
                for (j = 0; j < handlers_count; j++) {
                    handler = handlers[j];
                    handler.method.call(handler.context, evt, handler.event_data);
                    if (evt.propagation_stopped === true) {
                        return evt
                    }
                }
            }
        }
        return evt
    }
    function epic_event(e) {
        var target = (e.target || e.srcElement) || document;
        var event_name = event_name_map[e.type] || e.type;
        var from_element = e.fromElement;
        var related_target = from_element === target ? e.toElement : e.relatedTarget || from_element;
        var which = e.which;
        var keycode = which ? which : keycode;
        var charcode = e.charCode;
        var keyvalue = '';
        var meta_key;
        var delta = 0;
        var page_x;
        var page_y;
        var capslock = false;
        if (e.altKey) {
            meta_key = 'ALT'
        }
        else if (e.ctrlKey || e.metaKey) {
            meta_key = 'CTRL'
        }
        else if (e.shiftKey || charcode === 16) {
            meta_key = 'SHIFT'
        }
        else if (keycode === 20) {
            meta_key = 'CAPSLOCK'
        }
        if (which === undefined && charcode === undefined) {
            keycode = keycode
        }
        else {
            keycode = which !== 0 && charcode !== 0 ? which : keycode
        }
        keyvalue = keycode > 31 ? String.fromCharCode(keycode) : '';
        if (keycode > 96 && keycode < 123 && meta_key === 'SHIFT' || keycode > 64 && keycode < 91 && meta_key !== 'SHIFT') {
            capslock = true
        }
        if (event_name === 'keydown' || event_name === 'keyup') {
            if (keyvalue === 'CAPSLOCK') {
                capslock = !capslock
            }
            if (keycode > 64 && keycode < 91 && meta_key !== 'SHIFT') {
                keycode = keycode + 32;
                keyvalue = String.fromCharCode(keycode)
            }
        }
        if (keycode_map[keycode]) {
            keyvalue = keycode_map[keycode]
        }
        if (event_name === 'mousewheel') {
            delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;
            delta = delta > 0 ? 1 : -1
        }
        if (typeof e.pageX === "undefined" && e.clientX !== null) {
            var document_element = document.documentElement;
            var body = document.body;
            page_x = e.clientX + (document_element && document_element.scrollLeft || body && body.scrollLeft || 0) - (document_element && document_element.clientLeft || body && body.clientLeft || 0);
            page_y = e.clientY + (document_element && document_element.scrollTop || body && body.scrollTop || 0) - (document_element && document_element.clientTop || body && body.clientTop || 0)
        }
        var self = this;
        self.original = e;
        self.event_phase = e.eventPhase;
        self.target = target.nodeType === 3 ? target.parentNode : target;
        self.type = event_name;
        self.from_element = from_element;
        self.to_element = e.toElement || target;
        self.pagex = page_x;
        self.pagey = page_y;
        self.keycode = keycode;
        self.keyvalue = keyvalue;
        self.metaKey = meta_key;
        self.delta = delta;
        self.capslock = capslock;
        self.button = e.button;
        self.related_target = related_target;
        self.propagation_stopped = false
    }
    epic_event.prototype = {
        prevent_default: function() {
            var foo = this;
            foo.original.preventDefault();
            foo.original.result = false
        }, stop_propagation: function() {
                var self = this;
                var original = self.original;
                original.cancelBubble = true;
                original.stopPropagation();
                self.propagation_stopped = true
            }, stop: function() {
                var self = this;
                self.prevent_default();
                self.stop_propagation()
            }
    };
    event.add = add;
    event.remove = remove;
    event.trigger = trigger;
    event.registry = REGISTRY;
    epic.event = event;
    var plugins = {
            on: function(event_name, event_handler, data) {
                var t = this;
                var elements = t.elements;
                var i = elements.length;
                while (i--) {
                    add(elements[i], event_name, event_handler, data)
                }
                return t
            }, click: function(event_handler, data) {
                    var t = this;
                    if (arguments.length === 0) {
                        t.trigger("click")
                    }
                    else {
                        t.on("click", event_handler, data)
                    }
                    return t
                }, trigger: function(event_name) {
                    var t = this;
                    var elements = t.elements;
                    var i = elements.length;
                    while (i--) {
                        trigger(elements[i], event_name)
                    }
                    return t
                }
        };
    epic.object.copy(plugins, epic.html.selector.prototype)
})(epic, window, document);
(function(epic, undefined) {
    var object_merge = epic.object.merge;
    var object_copy = epic.object.copy;
    var default_settings = {
            on_start: nothing, execute: nothing, on_stop: nothing, interval: 1000
        };
    function nothing(){}
    function task(settings) {
        var self = this;
        object_copy(object_merge(default_settings, settings), self, true)
    }
    task.prototype = {
        construtor: task, start: function() {
                var self = this;
                self.timer = setInterval(function() {
                    self.execute.call(self)
                }, self.interval);
                self.on_start.call(self)
            }, stop: function() {
                var self = this;
                clearInterval(self.timer);
                self.on_stop.call(self)
            }
    };
    epic.task = task
})(epic);
(function(epic, undefined) {
    var object_merge = epic.object.merge;
    var object_copy = epic.object.copy;
    var epic_task = epic.task;
    var default_worker_settings = {tasks: {}};
    function worker(settings) {
        var self = this;
        object_copy(object_merge(default_worker_settings, settings), self, true)
    }
    worker.prototype = {
        construtor: worker, add: function(id, task) {
                var self = this;
                var tasks = self.tasks;
                if (!(task instanceof epic_task)) {
                    throw new Error("Not a valid task");
                }
                if (tasks[id] !== undefined) {
                    throw new Error("Task id [" + id + "] is already taken.");
                }
                tasks[id] = task;
                return self
            }, remove: function(id) {
                var self = this;
                if (typeof id === "string") {
                    delete self.tasks[id]
                }
                return self
            }, start: function(id) {
                if (typeof id !== "string") {
                    throw new Error("The id parameter must be a string.");
                }
                var self = this;
                var task = self.tasks[id];
                if (self.current) {
                    self.current.stop()
                }
                self.current = task;
                task.start();
                return self
            }, stop: function(id) {
                var self = this;
                var task = self.tasks[id];
                if (task instanceof epic_task) {
                    self.current = null;
                    task.stop()
                }
                return self
            }
    };
    epic.worker = worker
})(epic);