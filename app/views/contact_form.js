var BaseView = require('./base_view');
var utils = require('../utils');
var ContactRequestModel = require('../models/base').extend({
  urlRoot: '/campaigns/contact'
});

module.exports = BaseView.extend({
  tagName:'form',
  events: {
    'submit' : 'submit'
  },
  submit: function (evt) {
    evt.preventDefault();

    var contactRequest = new ContactRequestModel({}, {
      app: this.app
    });
    var data = $(evt.currentTarget).serializeObject();
    var opts = utils.cbOpts(callback, this);

    contactRequest.save(data, opts);
    function callback (err) {
      if (err && !~err.indexOf('already subscribed')) {
        this.trigger('submitted', err);
        this.showError(err);
      }
      else {
        this.trigger('submitted');
        this.$('input, textarea').val('');
        this.showMessage("Thanks we'll get back to you soon!")
      }
    }
  }
});

module.exports.id = "ContactForm";
