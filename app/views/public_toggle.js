var BaseView = require('./base_view');
var _ = require('underscore');
var utils = require('../utils');

module.exports = BaseView.extend({
  className: 'btn-group toggles',
  events: {
    'click [data-action]': 'toggle'
  },
  toggle: function (evt) {
    var $el = $(evt.currentTarget);
    var value = ($el.attr('data-value') === 'true');
    var cb = function () {
      this.render();
    };
    cb = utils.cbOpts(cb, this);
    this.model.save({
      'private': value
    }, cb);
  },
  getTemplateData: function () {
    var opts = this.options;
    return opts;
  }
});

module.exports.id = "PublicToggle";
