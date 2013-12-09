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
    var reputation = options.reputation;
    var name = options.name;
    this.$('.reputation').tooltip({
      title: reputation + ' published in ' + name,
      placement: 'bottom'
    });
  }
});

module.exports.id = "TagScore";
