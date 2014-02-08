(function(epic) {
    function ui(){}
    ui.align = {
        none: 'none', left: 'pull-left', right: 'pull-right'
    };
    epic.ui = ui
})(epic);
(function(epic) {
    function alert(settings) {
        settings = this.settings = epic.object.merge(alert.default_settings, settings);
        var element = this.element = document.createElement('div');
        var inner = this.message = document.createElement('span');
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
        show: function() {
            this.element.style.display = 'block';
            return this
        }, hide: function() {
                this.element.style.display = 'none';
                return this
            }, set_message: function(message) {
                this.message.innerHTML = message;
                return this
            }, as_success: function() {
                return this.set_type(alert.type.success)
            }, as_info: function() {
                return this.set_type(alert.type.info)
            }, as_warning: function() {
                return this.set_type(alert.type.warning)
            }, as_danger: function() {
                return this.set_type(alert.type.danger)
            }, set_type: function(type) {
                var t = this;
                t.element.className = "alert alert-" + type;
                return t
            }
    };
    alert.type = {
        'default': 'default', success: 'success', info: 'info', warning: 'warning', danger: 'danger'
    };
    alert.default_settings = {
        type: alert.type.default, message: "", target: null, closable: false
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
        var element = epic.html.create(html_tag).append(icon.element, caption);
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
        t.target.insertBefore(view.container, null);
        views[views.length] = view;
        return view
    };
    function view(viewport) {
        var create = epic.html.create;
        var container = create('<div class="container stretch" style="display: none;"></div>');
        var loader = create('<span class="view-status" style="display: none;">Working...</span>');
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
                var viewport = t.viewport;
                var current_view = viewport.current_view;
                if (current_view) {
                    epic.html(current_view.container).css('display: none')
                }
                t.container.style.display = 'block';
                viewport.current_view = t;
                return t
            }, empty: function() {
                var t = this;
                var container = t.container;
                t.is_busy(false);
                epic.html(container).empty().append(t.loader);
                return t
            }, append: function(html) {
                epic.html(this.container).append(html);
                return this
            }
    };
    epic.viewport = viewport;
    epic.view = view
})(epic);
(function(epic, document) {
    function get_notification_rail() {
        var id = "epic-notification-rail";
        var rail = document.getElementById(id);
        if (rail == null) {
            rail = document.createElement("div");
            rail.id = id
        }
        if (rail.parentNode == null) {
            document.body.insertBefore(rail, null)
        }
        return rail
    }
    function notice(settings) {
        settings = epic.object.merge(notice.default_settings, settings);
        var t = this;
        var container = t.container = document.createElement('div');
        var title_bar = t.title = document.createElement('span');
        var close_button = t.close_button = document.createElement('span');
        var message = t.message = document.createElement('div');
        var notice_type = settings.type;
        var title = settings.title;
        title = title || (notice_type == notice.type.default ? "Information!" : (notice_type.charAt(0).toUpperCase() + notice_type.slice(1)) + "!");
        t.settings = settings;
        t.set_type(notice_type);
        close_button.innerHTML = "";
        close_button.className = "notice-close";
        epic.event.add(close_button, "click", notice.event.close, container);
        title_bar.innerHTML = title;
        title_bar.className = "notice-title";
        message.innerHTML = settings.message;
        message.className = "notice-content";
        container.insertBefore(close_button, null);
        container.insertBefore(title_bar, null);
        container.insertBefore(message, null);
        epic.event.add(container, "mouseover", notice.event.mouseover, close_button);
        epic.event.add(container, "mouseout", notice.event.mouseout, close_button);
        get_notification_rail().insertBefore(container, null)
    }
    function notify(settings) {
        return new notice(settings)
    }
    notice.prototype = {
        set_content: function(content) {
            var t = this;
            t.message.innerHTML = content;
            return t
        }, show: function() {
                var t = this;
                var container = t.container;
                container.style.display = 'block';
                if (t.parentNode == null) {
                    get_notification_rail().insertBefore(container, null)
                }
                return t
            }, hide: function() {
                var t = this;
                t.container.style.display = 'none';
                return t
            }, as_success: function() {
                return this.set_type(alert.type.success)
            }, as_info: function() {
                return this.set_type(alert.type.info)
            }, as_warning: function() {
                return this.set_type(alert.type.warning)
            }, as_danger: function() {
                return this.set_type(alert.type.danger)
            }, set_type: function(type) {
                var t = this;
                t.container.className = "notice notice-" + type;
                return t
            }
    };
    notice.type = {
        'default': 'default', success: 'success', info: 'info', warning: 'warning', danger: 'danger'
    };
    notice.default_settings = {
        type: notice.type.default, message: "", closable: false, timeout: 5
    };
    notice.event = {
        close: function(e, container) {
            var parent = container.parentNode;
            parent.removeChild(container)
        }, mouseover: function(e, close_button) {
                close_button.style.display = "block"
            }, mouseout: function(e, close_button) {
                close_button.style.display = "none"
            }
    };
    notify.success = function(message, closable) {
        return new notice({
                type: notice.type.success, message: message, closable: closable
            })
    };
    notify.danger = function(message, closable) {
        return new notice({
                type: notice.type.danger, message: message, closable: closable
            })
    };
    notify.warning = function(message, closable) {
        return new notice({
                type: notice.type.warning, message: message, closable: closable
            })
    };
    notify.info = function(message, closable) {
        return new notice({
                type: notice.type.info, message: message, closable: closable
            })
    };
    epic.notice = notice;
    epic.notify = notify
})(epic, document);