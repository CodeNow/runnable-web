var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  id: "share-options",
  className: "clearfix",
  events: {
    'click input'    : 'linkShare',
    'click .twitter' : 'twitterShare',
    'click .facebook': 'facebookShare',
    'click .email'   : 'googlePlusShare'
  },
  getTemplateData: function () {
    var opts = this.options;
    // share url
    var split = utils.getCurrentUrl(this.app).split('/')
    split.pop(); // pop off the title part of the url
    opts.shorturl = split.join('/');
    return opts;
  },
  linkShare: function (evt) {
    $(evt.currentTarget).select();
  },
  twitterShare: function () {
    var url = 'https://twitter.com/share?text=:text&url=:url' +
      (this.model.get('name') +' - '+ this.options.shorturl);
    window.open(url, '__blank');
  },
  facebookShare: function () {
    var url = 'https://www.facebook.com/sharer/sharer.php?s=100&p[title]=:title&p[url]=:url'
      .replace(':title', this.model.get('name'))
      .replace(':url', this.options.shorturl);
    window.open(url, '__blank');
  },
  googlePlusShare: function () {
    var url = "https://plus.google.com/share?url="+this.options.shorturl;
    window.open(url, '__blank');
  }
  // emailShare: function () {
  //   var url = 'mailto:?';
  //   var query = {
  //     subject: 'Code Example: '+this.model.get('name'),
  //     body: this.model.get('name') +' - '+ shorturl
  //   };
  // }
});

module.exports.id = "RunnableShare";
