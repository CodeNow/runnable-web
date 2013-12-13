var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'a',
  preRender: function () {
    this.attributes = {
      href: this.model.appUrl()
    };
  },
  getTemplateData: function () {
    var opts = this.options;
    var userCount = this.model.get('userImagesCount');
    var totalCount = this.model.get('count');

    opts.meter = Math.round(userCount/totalCount * 10);
    opts.ratio = Math.round(userCount/totalCount * 100);

    return opts;
  },
  postRender: function () {
    var opts = this.options;
    var reputation = opts.reputation;
    var name       = opts.model.get('name');
    var ratio      = opts.ratio;

    if (ratio) {
      this.$('img, .no-img').tooltip({
        placement: 'top',
        title: 'Contributed ' + ratio + '% towards ' + name
      });;
    }
  }
});

module.exports.id = "TagScore";
