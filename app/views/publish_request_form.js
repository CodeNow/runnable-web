var BaseView = require('./base_view');
var utils = require('../utils');
var PublishRequestModel = require('../models/base').extend({
  urlRoot: '/campaigns/publishers'
});

module.exports = BaseView.extend({
  tagName:'form',
  events: {
    'submit': 'submit'
  },
  preRender: function () {
    this.className = this.options.classname;
  },
  submit: function (evt) {
    evt.preventDefault();

    var publishRequest = new PublishRequestModel({}, {
      app: this.app
    });
    var data = $(evt.currentTarget).serializeObject();
    var opts = utils.cbOpts(callback, this);

    publishRequest.save(data, opts);
    function callback (err) {
      if (err && !~err.indexOf('already subscribed')) {
        this.trigger('submitted', err);
        this.showError(err);
      }
      else {
        this.trigger('submitted');
        this.showMessage("Thanks we'll get back to you soon!")
      }
    }
  }
});

module.exports.id = "PublishRequestForm";
