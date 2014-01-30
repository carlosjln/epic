(function(epic) {
    function ui(){}
    ui.align = {
        none: 'none', left: 'pull-left', right: 'pull-right'
    };
    epic.ui = ui
})(epic);
(function(epic) {
    function alert(settings) {
        settings = this.settings = epic.tools.merge(alert.default_settings, settings);
        var element = this.element = document.createElement('div');
        var inner = this.inner = document.createElement('span');
        var type = settings.type;
        var message = settings.message;
        var target = settings.target;
        element.insertBefore(inner, null);
        inner.className = 'message';
        element.className = "alert alert-" + (type ? type : "default");
        if (message) {
            inner.innerHTML = message
        }
        if (target) {
            target.insertBefore(element, null)
        }
    }
    alert.prototype = {
        message: function(message) {
            this.inner.innerHTML = message;
            return this
        }, show: function() {
                this.element.style.display = 'block';
                return this
            }, hide: function() {
                this.element.style.display = 'none';
                return this
            }, as_success: function() {
                this.element.className = "alert-success";
                return this
            }, as_info: function() {
                this.element.className = "alert-info";
                return this
            }, as_warning: function() {
                this.element.className = "alert-warning";
                return this
            }, as_danger: function() {
                this.element.className = "alert-danger";
                return this
            }
    };
    alert.default_settings = {
        message: "", type: "", target: null, closable: false
    };
    alert.type = {
        success: 'success', info: 'info', warning: 'warning', danger: 'danger'
    };
    epic.alert = alert
})(epic);
(function(epic) {
    function icon(settings) {
        settings = settings || {};
        var t = this;
        var icon = t.element = document.createElement('i');
        t.name = settings.name || "";
        t.align = settings.align || epic.ui.align.none;
        t.classes = settings.classes || "";
        t.set_caption(settings.caption);
        icon.addClass(t.name).addClass(t.align.toString()).addClass(t.classes)
    }
    function get_class(t) {
        return (t.name = name) + ' ' + t.align + ' ' + t.classes
    }
    icon.prototype = {
        change: function(name) {
            var t = this;
            if (name) {
                t.name = name;
                t.element.className = get_class(t)
            }
            return t
        }, set_align: function(alignment) {
                var t = this;
                t.align = alignment;
                t.element.className = get_class(t);
                return t
            }, set_caption: function(caption) {
                if (caption) {
                    this.element.innerHTML = caption
                }
                return this
            }, hide: function() {
                this.element.style.display = 'none';
                return this
            }, show: function() {
                this.element.style.display = '';
                return this
            }
    };
    epic.icon = icon
})(epic);
(function(epic) {
    function button(settings) {
        var btn = this;
        var id = btn.id = settings.id || epic.tools.uid.next().toString();
        var caption = btn.caption = settings.caption || "";
        var tag = btn.tag = settings.tag || button.tag.button;
        var size = btn.size = settings.size || button.size.normal;
        var role = tag == button.size.button ? 'type="' + (btn.role = settings.role || button.role.button) + '"' : "";
        var style = btn.style = settings.style || button.style.none;
        var classes = btn.classes = 'btn ' + (settings.classes || "");
        var attributes = btn.attributes = settings.attributes || "";
        var icon = btn.icon = settings.icon || new epic.icon;
        var align = epic.ui.align;
        if (icon.align == align.none) {
            icon.set_align(align.left)
        }
        if (caption == "") {
            if (icon.name != "") {
                classes += " btn-icon-only"
            }
            icon.set_align(align.none)
        }
        var html_tag = '<' + tag + ' id="' + id + '"' + role + ' class="' + classes + ' btn-size-' + size + ' btn-' + style + '" ' + attributes + '></' + tag + '>';
        var element = $(html_tag).append(icon.element, caption);
        btn.element = element.get(0)
    }
    button.size = {
        mini: 'mini', small: 'small', normal: 'normal', large: 'large'
    };
    button.size = {
        anchor: 'a', button: 'button'
    };
    button.role = {
        button: 'button', submit: 'submit', reset: 'reset'
    };
    button.style = {
        none: 'none', primary: 'primary', warning: 'warning', danger: 'danger', success: 'success', info: 'info'
    };
    epic.button = button
})(epic);
(function(epic) {
    function viewport(target) {
        this.views = [];
        this.target = target
    }
    viewport.prototype.add_view = function(view) {
        var t = this;
        var views = t.views;
        view = view || new epic.view(t);
        t.target.insertBefore(view.container);
        views[views.length] = view;
        return view
    };
    function view(viewport) {
        var container = $('<div class="container stretch" style="display: none;"></div>');
        var loader = $('<span class="view-status" style="display: none;">Working...</span>');
        this.container = container[0];
        this.loader = loader[0];
        this.viewport = viewport;
        container.append(loader)
    }
    view.prototype = {
        is_busy: function(state) {
            var loader = this.loader;
            loader.style.display = 'none';
            loader.innerHTML = 'Working out...';
            if (state) {
                loader.style.display = 'inline';
                if (typeof state == "string") {
                    loader.innerHTML = state
                }
            }
        }, activate: function() {
                var t = this;
                var container = $(t.container);
                var viewport = t.viewport;
                var current_view = viewport.current_view;
                if (current_view) {
                    $(current_view.container).css('display', 'none')
                }
                container.css('display', 'block');
                viewport.current_view = t;
                return t
            }, empty: function() {
                var t = this;
                var container = t.container;
                t.is_busy(false);
                epic.html(container).empty().append(t.loader);
                return t
            }, append: function(html) {
                $(this.container).append(html);
                return this
            }
    };
    epic.viewport = viewport;
    epic.view = view
})(epic);