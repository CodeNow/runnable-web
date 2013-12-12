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
    var userCount = this.model.get('leaderImagesCount');
    var totalCount = this.model.get('count');

    opts.meter = Math.round(userCount/totalCount * 100);

    return opts;
  },
  postRender: function () {
    var opts = this.options;
    console.log(opts.meter);
    console.log(this.model.get('leaderImagesCount'));
    console.log(this.model.get('count'));
    var reputation = opts.reputation;
    var name       = opts.model.get('name');
    var meter      = opts.meter;

    if (meter) {
      this.$('img, .no-img').tooltip({
        placement: 'top',
        title: 'Contributed ' + meter + '% towards ' + name
      });;
    }
  }
});

module.exports.id = "TagScore";
