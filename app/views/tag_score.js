var BaseView = require('./base_view');
var channelImages = require('../channelImages');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'tooltip',
  getTemplateData: function () {
    var self = this;
    var opts = self.options;
    var model = self.model;

    var userCount = model.get('userImagesCount');
    var totalCount = model.get('count');
    var name = opts.model.get('name');
    opts.meter = Math.round(userCount/totalCount * 10);
    var ratio = opts.ratio = Math.round(userCount/totalCount * 100);

    self.attributes = {
      href: model.appUrl(),
      'data-title': 'Contributed ' + ratio + '% towards ' + name
    };

    return opts;
  }
});

module.exports.id = "TagScore";
