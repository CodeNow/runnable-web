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
    var meter = options.meter;

    this.$('.reputation').tooltip({
      placement: 'bottom',
      title: reputation + ' published in ' + name
    });

    if (meter) {
      this.$('img').tooltip({
        placement: 'top',
        title: 'Contributed ' + meter + '% towards ' + name
      });;
    }
  }
});

module.exports.id = "TagScore";
