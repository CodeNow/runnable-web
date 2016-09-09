var BaseView = require('../base_view');
var utils = require('../../utils');
var _ = require('underscore');
var SetPassModal = require('../set_pass_modal');
var Super = BaseView.prototype;
var delay = 50;
var cycleTime = 2000;

module.exports = BaseView.extend({
  events: {
    'mouseover #channel-images > li'    : 'channelTextSwap',
    'mouseleave #channel-images'        : 'channelTextRevert',
    'submit form'                       : 'submitSearch',
    'click #home-header .chevron-right' : 'toggleHero'
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
                      'twilio'];
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
      title: 'CodeIgniter',
      name:  'CodeIgniter'
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
    return opts;
  },
  postRender: function () {
    this.imageTile();
    var notifyString = utils.getQueryParam(this.app, 'notify');
    var action = utils.getQueryParam(this.app, 'action');

    switch(action) {    
      case 'setpassword':
        var username = utils.getQueryParam(this.app, 'username');
        var token = utils.getQueryParam(this.app, 'token');
        
        this.app.user.validateToken(username, token, 'setpassword', function (err) {
          if (err) {
            this.showNotification('Sorry! Your password reset link is either used, or expired.');
          }
          else {
            var setPassModal = new SetPassModal({ app:this.app });
            setPassModal.open(); 
          }
        }.bind(this));

        break;
    }

    switch(notifyString) {
      case 'email-changed':
          var notifyMsg = 'Your email has been changed successfully.';
          break;
      case 'email-verified':
          var notifyMsg = 'Your email has been verified successfully.';
          break;
      case 'password-set':
          var notifyMsg = 'The new password has been set successfully.';
          break;
    }
    if (notifyMsg!=undefined) {
      this.showNotification(notifyMsg);
      history.pushState('', 'New Page Title', '/');
    }
  },
  showNotification: function (notifyMsg) {
    setTimeout( function() {
      // create the notification
      var notification = new NotificationFx({
        message : '<span class="glyphicons bullhorn"></span><span><p class="notificationMsg">' + notifyMsg + '</p></span>',
        layout : 'bar',
        effect : 'slidetop',
        ttl : 8000,
        type : 'notice' // notice, warning or error
      });
      // show the notification
      notification.show();
    }, 1000 );
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

    var searchString = this.$el.find('input[type="search"][name="q"]').val();
    if (!this.typed) {
      evt.preventDefault();
      this.app.set('loading', true);
      this.app.router.navigate('/search?q=' + searchString.replace(/ /g, '+'), {trigger:true});
    }
  },
  toggleHero: function () {
    this.$('#home-header').toggleClass('inner');
  }
});

module.exports.id = 'channel/category';
