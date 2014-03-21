var BaseView = require('../base_view');
var utils = require('../../utils');
var _ = require('underscore');
var Super = BaseView.prototype;
var delay = 50;
var cycleTime = 2000;

module.exports = BaseView.extend({
  events: {
    'mouseover #channel-images > li': 'channelTextSwap',
    'mouseleave #channel-images':     'channelTextRevert',
    'submit form':                    'submitSearch',
    'click .chevron-right':           'toggleHero'
  },
  sortChannels: function () {

    var opts = this.options;
    var category = opts.channels.params.category.toLowerCase();
    var sortOrder = ['c++',
                      'cakephp',
                      'codeigniter',
                      'dart',
                      'django',
                      'express',
                      'firebase',
                      'java',
                      'jquery',
                      'mysql',
                      '.net',
                      'nodejs',
                      'php',
                      'python',
                      'ruby-on-rails',
                      'twilio']; //'add your own'
    function getOrder (channel) {
      var sortIndex;
      //if(!channel.get('aliases'))
      //  debugger;
      channel.get('aliases').some(function (alias) {
        sortIndex = sortOrder.indexOf(alias);
        return ~sortIndex;
      });
      return (sortIndex !== -1) ? sortIndex : 1000; //1000 = last
    }

    if (category == 'featured') {
      opts.channels.models = opts.channels.models.sort(function (a, b) {
        return getOrder(a) < getOrder(b) ? -1 : 1;
      });
    }

  },
  getTemplateData: function () {
    var opts = this.options;
    //this.sortChannels();
    opts.categories.models.forEach(function (category) {
      attribs = category.attributes;
      attribs.link = utils.exists(attribs.url) ? attribs.url : '/c/'+attribs.name;
    });
    opts.channel_buttons = [{
      title: 'Dart',
      name:  'Dart'
    },{
      title: 'C++',
      name:  'C++'
    },{
      title: 'Java',
      name:  'Java'
    },{
      title: 'Rails',
      name:  'Ruby-on-Rails'
    },{
      title: 'Node.js',
      name:  'Node.js'
    },{
      title: 'PHP',
      name:  'PHP'
    },{
      title: 'jQuery',
      name:  'jQuery'
    },{
      title: 'Ruby',
      name:  'Ruby'
    },{
      title: 'Django',
      name:  'Django'
    },{
      title: 'express',
      name:  'express'
    },{
      title: 'Python',
      name:  'Python'
    },{
      title: 'Codeigniter',
      name:  'Codeigniter'
    },{
      title: '.NET',
      name:  '.NET'
    },{
      title: 'Flask',
      name:  'Flask'
    },{
      title: 'CakePHP',
      name:  'CakePHP'
    },{
      title: 'Bash',
      name:  'Bash'
    }];
    //console.log('opts', opts);
    return opts;
  },
  postRender: function () {
    this.imageTile();
    this.$('#home-header').addClass('in');
  },
  imageTile: function () {
    var $bubbles = this.$('.bubbles');
    utils.allImagesLoaded($bubbles.find('img'), function () {
      $bubbles.isotope({
        itemSelector: 'img',
        layoutMode: 'masonry'
      });
    });
  },
  channelTextRevert: function (evt) {
    if (!Modernizr.touch) {
      evt.stopPropagation();
      $channelText = this.$('#channel-text');
      if (!$channelText.hasClass('out')) {
        $channelText.prop('class', '_0');
      }
    }
  },
  channelTextSwap: function (evt) {
    if (!Modernizr.touch) {
      evt.stopPropagation();
      var $currentTarget = this.$(evt.currentTarget);
      var currentPos = $currentTarget.index() + 1; // offset for initial 'your'
      var $channelText = this.$('#channel-text');
      $channelText.prop('class','_' + currentPos);
    }
  },
  submitSearch: function (evt) {
    if (!this.typed) {
      evt.preventDefault();
      this.app.set('loading', true);
      this.app.router.navigate('/'+ids[this.index], {trigger:true});
    }
  },
  toggleHero: function () {
    this.$('#home-header').toggleClass('inner');
  }
});

module.exports.id = 'channel/category';
