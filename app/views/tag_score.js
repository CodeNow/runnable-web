var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    var name = this.options.name;
    var href = '/' + name;
    this.attributes = {
      href: href
    };
  },
  postRender: function () {
    var options = this.options;
    var rating = options.rating;
    var name = options.name;
    this.$('.rating').tooltip({
      title: rating + ' published in ' + name,
      placement: 'bottom'
    });
  }
});

module.exports.id = "TagScore";
