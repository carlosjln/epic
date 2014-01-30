var epic = (function() {
        if (window['console'] === undefined) {
            window['console'] = {log: function(){}}
        }
        function epic(){}
        epic.type = (function() {
            var core_types = {
                    '[object Boolean]': 'boolean', '[object Number]': 'number', '[object String]': 'string', '[object Function]': 'function', '[object Array]': 'array', '[object Date]': 'date', '[object RegExp]': 'regexp', '[object Object]': 'object', '[object Error]': 'error'
                };
            var to_string = core_types.toString;
            function type(object) {
                var typeof_object = typeof(object);
                if (object == null) {
                    return 'null'
                }
                if (typeof_object === 'object' || typeof_object === 'function') {
                    return core_types[to_string.call(object)] || 'object'
                }
                return typeof_object
            }
            type.is_window = function(object) {
                return object != null && object == object.window
            };
            type.is_numeric = function(object) {
                return !isNaN(parseFloat(object)) && isFinite(object)
            };
            type.is_undefined = function(object) {
                return typeof(object) == 'undefined'
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
                return type(object) == 'boolean'
            };
            type.is_regexp = function(object) {
                return type(object) == 'regexp'
            };
            type.is_element = function(object) {
                return object && object.nodeName != null
            };
            return type
        })();
        epic.parse = {
            currency: function(expression, symbol) {
                var numbers = expression + '';
                var array = numbers.split('.');
                var digits = array[0];
                var decimals = array.length ? '.' + array[1] : '';
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
        epic.log = epic.fail = function(message) {
            console.log(message)
        };
        epic.start = function(callback) {
            callback()
        };
        return epic
    })();
(function(tools) {
    tools.uid = (function() {
        function uid(){}
        uid.seed = (new Date).getTime();
        uid.next = function() {
            return ++uid.seed
        };
        return uid
    })()
})(epic.tools || (epic.tools = {}));
(function(epic) {
    function object(){}
    function copy(object, target) {
        var object_type = epic.type(object);
        var clone;
        switch (object_type) {
            case"object":
                clone = target || {};
                for (var attribute in object) {
                    if (object.hasOwnProperty(attribute)) {
                        clone[attribute] = copy(object[attribute])
                    }
                }
                break;
            case"array":
                clone = target || [];
                for (var i = 0, len = object.length; i < len; i++) {
                    clone[i] = copy(object[i])
                }
                break;
            case"date":
                clone = new Date;
                clone.setTime(object.getTime());
                break;
            default:
                clone = object
        }
        return clone
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
    object.merge = merge;
    object.clone = copy;
    object.to_array = function(object) {
        if (object == null) {
            return null
        }
        var array = Array.prototype.slice.call(object);
        return array.length > 0 ? array : [object]
    };
    epic.object = object
})(epic);
(function(epic) {
    function string(input) {
        return new dsl(input)
    }
    function dsl(input) {
        this.input = input
    }
    dsl.prototype = {
        encode_base64: encode_base64, decode_base64: decode_base64, encode_utf8: encode_utf8, decode_utf8: decode_utf8, encode_url: encode_url, decode_url: decode_url, encode_html_entities: encode_html_entities, decode_html_entities: decode_html_entities, ucase: ucase, lcase: lcase
    };
    epic.string = string;
    var B64KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function encode_base64() {
        var t = this;
        var key = B64KEY;
        var str = t.encode_utf8(t.input);
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
    function decode_base64() {
        var t = this;
        var key = B64KEY;
        var str = t.input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
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
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2)
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3)
            }
        }
        output = t.decode_utf8(output);
        return output
    }
    function encode_utf8() {
        var str = this.input.replace(/\r\n/g, "\n");
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
    function decode_utf8() {
        var str = this.input;
        var length = str.length;
        var index = 0;
        var output = "";
        var charcode;
        var c2;
        var c3;
        while (index < length) {
            charcode = str.charCodeAt(index);
            if (charcode < 128) {
                output += String.fromCharCode(charcode);
                index++
            }
            else if ((charcode > 191) && (charcode < 224)) {
                c2 = str.charCodeAt(index + 1);
                output += String.fromCharCode(((charcode & 31) << 6) | (c2 & 63));
                index += 2
            }
            else {
                c2 = str.charCodeAt(index + 1);
                c3 = str.charCodeAt(index + 2);
                output += String.fromCharCode(((charcode & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                index += 3
            }
        }
        return output
    }
    function encode_url() {
        return encodeURIComponent(this.input)
    }
    function decode_url() {
        return decodeURIComponent(this.input)
    }
    function encode_html_entities(encode_reserved_chars) {
        return this.input.replace(/./g, encode_reserved_chars ? replace_all_html_entities : replace_default_html_entities)
    }
    function decode_html_entities() {
        return this.input.replace(/&#(\d)+;/g, restore_html_entities)
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
        if ((i != 34 && i != 39 && i != 38 && i != 60 && i != 62) && ((i > 31 && i < 96) || (i > 96 && i < 127))) {
            return str
        }
        else {
            return '&#' + i + ';'
        }
    }
    function restore_html_entities(str) {
        return String.fromCharCode(str.replace(/[#&;]/g, ''))
    }
    function ucase() {
        return this.input.toUpperCase()
    }
    function lcase() {
        return this.input.toLowerCase()
    }
})(epic);
epic.collection = (function() {
    function collection() {
        this.collection = {}
    }
    collection.prototype = {
        get: get, set: set, remove: remove, to_string: to_string
    };
    function get(key) {
        var t = this;
        var key_str = t.to_string(key);
        var pair = t.collection[key_str];
        if ((typeof pair) === 'undefined') {
            return undefined
        }
        return pair.value
    }
    function set(key, value) {
        if (key === undefined || value === undefined) {
            return undefined
        }
        var previous_value = this.get(key);
        this.collection[this.to_string(key)] = {
            key: key, value: value
        };
        return previous_value
    }
    function remove(key) {
        var t = this;
        var k = t.to_string(key);
        var previous_element = t.collection[k];
        if (previous_element != undefined) {
            delete this.collection[k];
            return previous_element.value
        }
        return undefined
    }
    function to_string(key) {
        return String(key)
    }
    return collection
})();
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
    browser.ie = (browser.name == 'explorer');
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
                    return [epic.string(identity).lcase(), parseFloat(RegExp.$1)]
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
        port = anchor.port;
        if (relative) {
            pathname = anchor.pathname.replace(/^[/]/, '');
            if (pathname) {
                pathname = pathname.substring(0, pathname.lastIndexOf("/")) + "/"
            }
        }
        return anchor.protocol + '//' + anchor.hostname + (port && port != 0 ? ':' + port : '') + '/' + pathname
    }
    function request(url, type, callback) {
        var tag;
        var src = 'src';
        var rel;
        var typeof_script = typeof(type);
        if (/^http/i.test(url) == false) {
            url = browser.url + url
        }
        if (loaded_documents[url] != null) {
            if (callback) {
                callback.free()
            }
            return loaded_documents[url].element
        }
        if (typeof_script == 'function') {
            callback = type
        }
        if (typeof_script != 'string') {
            type = url.split('?')[0].file_ext()
        }
        if (type == 'js') {
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
                if ((state === 'loaded' || state === 'complete') && data.loaded == false) {
                    this.onreadystatechange = null;
                    data.loaded = true;
                    data.callback()
                }
            };
            element.onload = function() {
                if (data.loaded == false) {
                    data.loaded = true;
                    data.callback()
                }
            };
            if (type == 'css') {
                if (browser.name == "firefox") {
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
epic.html = (function(epic) {
    function selector(elements) {
        var t = this;
        if ((t instanceof selector) == false) {
            return new selector(elements)
        }
        t.elements = epic.type(elements) == 'array' ? elements : [elements]
    }
    function create_document_fragment(content, callback) {
        var document_fragment = document.createDocumentFragment();
        var content_holder;
        var index;
        var nodes;
        if (content) {
            content_holder = document.createElement('div');
            content_holder.innerHTML = content;
            if (callback) {
                (function() {
                    if (content_holder.firstChild) {
                        document_fragment.appendChild(content_holder.firstChild);
                        setTimeout(arguments.callee, 0)
                    }
                    else {
                        callback(document_fragment)
                    }
                })()
            }
            else {
                nodes = content_holder.childNodes;
                index = nodes.length;
                while (index--) {
                    document_fragment.insertBefore(nodes[index], document_fragment.firstChild)
                }
            }
        }
        return document_fragment
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
                elements = (elements instanceof selector ? elements.elements : elements instanceof Array ? elements : [elements]);
                var i = elements.length;
                var t = this;
                var target = t.elements[0];
                var reference = null;
                var element;
                var valid_nodes = [];
                if (position !== undefined) {
                    var child_nodes = target.childNodes;
                    var j = child_nodes.length;
                    var trim = epic.string.trim;
                    var index = 0;
                    var node;
                    while (j--) {
                        node = child_nodes[index++];
                        if (node.nodeType == 1 || (node.nodeType == 3 && trim(node.textContent) != '')) {
                            valid_nodes[valid_nodes.length] = node
                        }
                    }
                    if (position > -1 && position < valid_nodes.length) {
                        reference = valid_nodes[position]
                    }
                }
                while (i--) {
                    element = elements[i];
                    if (!element) {
                        continue
                    }
                    if (!element.nodeType) {
                        element = document.createTextNode(element)
                    }
                    target.insertBefore(element, reference)
                }
            }
    };
    return selector
})(epic);