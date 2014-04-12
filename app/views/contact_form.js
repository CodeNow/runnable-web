var BaseView = require('./base_view');
var utils = require('../utils');
var ContactRequestModel = require('../models/base').extend({
  urlRoot: '/campaigns/contact'
});
var queryString = require('query-string');

module.exports = BaseView.extend({
  tagName:'form',
  events: {
    'submit' : 'submit'
  },
  submit: function (evt) {
    evt.preventDefault();
    var data = $(evt.currentTarget).serialize();
    var self = this;
    $.post(
      '/api/-/emails',
      queryString.parse(data),
      function () {});

    this.$el.addClass('in');
  }
});

module.exports.id = "ContactForm";
