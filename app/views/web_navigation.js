var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className:"navigation toolbar",
  events: {
    'click .back-button'    : 'back',
    'click .refresh-button' : 'refresh',
    'submit form'          : 'enter'
  },
  postHydrate: function () {
    this.history = [];
    this.prevAddress = '';
  },
  postRender: function () {

  },
  backButtonState: function () {
    if (this.history.length === 0) {
      this.$('.back-button').attr('disabled','disabled');
    }
    else {
      this.$('.back-button').removeAttr('disabled');
    }
  },
  postRender: function () {
    // cache jq elements
    this.$back = this.$('.back-button');
    this.$refresh = this.$('.refresh-button');
    this.$address = this.$('.address-bar');
  },
  setAddress: function (address) {
    if (address[0] == '/') address = address.slice(1);
    this.$address.val(address);
  },
  back: function () {
    var url = this.history.pop();
    if (url) {
      setAddress(url);
      this.trigger('change:url', url);
    }
    this.backButtonState();
  },
  refresh: function () {
    this.trigger('change:url', this.prevAddress);
  },
  enter: function (evt) {
    evt.preventDefault();
    var url = this.$address.val();
    this.history.push(this.prevAddress);
    this.prevAddress = url;
    this.trigger('change:url', url);
  }
});

module.exports.id = "WebNavigation";
