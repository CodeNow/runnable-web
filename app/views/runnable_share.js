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
    var url = 'https://twitter.com/share?text=' +
      (this.model.get('name') +' - '+ this.options.shorturl);
    this.popup(url, 'twitter_share');
  },
  facebookShare: function () {
    var url = 'https://www.facebook.com/sharer/sharer.php?s=100&p[title]=:title&p[url]=:url'
      .replace(':title', this.model.get('name'))
      .replace(':url',   this.options.shorturl);
    this.popup(url, 'facebook_share');
  },
  googlePlusShare: function () {
    var url = "https://plus.google.com/share?url="+this.options.shorturl;
    this.popup(url, 'google+_share');
  },
  popups: {},
  popup: function (url, windowName, height, width) {
    height = height || 500;
    width  = width  || 700;
    var left = (screen.width/2)-(width/2);
    var top  = (screen.height/2)-(height/2);
    var popup = this.popups[windowName];
    if (!popup || popup.closed) {
      this.popups[windowName] = window.open(url, windowName,
        'toolbar=no, location=no, directories=no, status=no, '+
        'menubar=no, scrollbars=no, resizable=no, copyhistory=no, '+
        'width='+width+', height='+height+', top='+top+', left='+left);
    }
    else {
      this.popups[windowName].focus();
    }
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
