var BaseView = require('./base_view');
var Channel = require('../models/channel');

module.exports = BaseView.extend({
  tagName: 'section',
  id: 'cards',
  className: 'container',
  events: {
    'input input' : 'enableSelect',
    'change select' : 'changeLanguage'
  },
  getTemplateData: function () {
    if (this.options.basehref == '/new') {
      this.collection.insert(0, new Channel({ name:'runnableid' }));
    }
    return this.options;
  },
  enableSelect: function (evt) {
    var select = this.$('select');

    if ($(evt.currentTarget)[0].value) {
      select.prop('disabled',false);
    } else {
      select.prop('disabled',true);
    }
  },
  changeLanguage: function () {
    var langVal = this.$('select')[0].value;

    this.$('.dropdown').text(langVal);
  }
});

module.exports.id = "ChannelCards";
