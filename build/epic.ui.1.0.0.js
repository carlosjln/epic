epic.alert = (function(epic) {
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
        if (message)
            inner.innerHTML = message;
        if (target)
            target.insertBefore(element, null)
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
        title: null, message: "", type: "", target: null, closable: false
    };
    alert.type = {
        success: 'success', info: 'info', warning: 'warning', danger: 'danger'
    };
    return alert
})(epic);