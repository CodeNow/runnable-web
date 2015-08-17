var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'header',
  id:"primary",
  events: {
    'click #output-reload' : 'refresh',
    'submit form'          : 'enter'
  },
  getTemplateData: function () {
    this.options.currenturl = this.options.currenturl || "http://" + this.model.get("webToken") + "." + this.app.get('userContentDomain');
    return this.options;
  },
  postHydrate: function () {
    this.history = [];
    this.listenTo(this.app.dispatch, 'toggle:buildMessage', this.toggleBuildMessage);
  },
  toggleBuildMessage: function (bool) {
    if (bool) { // show
      this.$el.addClass('hide');
    }
    else { // hide
      this.$el.removeClass('hide');
    }
  },
  backButtonState: function () {
    if (this.history.length === 0) {
      this.$('.back-button').attr('disabled','disabled');
    }
    else {
      this.$('.back-button').removeAttr('disabled');
    }
  },
  setAddress: function (address) {
    if (address[0] == '/') address = address.slice(1);
    this.$address.val(address);
  },
  back: function () {
    var url = this.history.pop();
    if (url) {
      this.setAddress(url);
      this.app.dispatch.trigger('change:url', url);
    }
    this.backButtonState();
  },
  refresh: function (evt) {
    evt.preventDefault();
    this.app.dispatch.trigger('change:url', this.options.currenturl);
  },
  enter: function (evt) {
    evt.preventDefault();
    var opts = this.options;
    var url = $(evt.currentTarget).serializeObject().url;
    this.history.push(opts.currenturl);
    opts.currenturl = url;
    this.app.dispatch.trigger('change:url', url);
  }
});

module.exports.id = "WebNavigation";
