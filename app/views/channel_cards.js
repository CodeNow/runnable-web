var BaseView = require('./base_view');
var Channel = require('../models/channel');

module.exports = BaseView.extend({
  tagName: 'main',
  id: 'cards',
  className: 'container',
  getTemplateData: function () {
    if (this.options.basehref == '/new') {
      this.collection.insert(0, new Channel({ name:'runnableid' }));
    }
    return this.options;
  }
});

module.exports.id = "ChannelCards";
