var BaseView = require('../base_view');
var utils = require('../../utils');
var _ = require('underscore');
var Super = BaseView.prototype;
var delay = 50;
var cycleTime = 2000;

var keywordsAndExamples = {
  'Libraries' : {
    name: 'How to upload a file using jQuery (PHP)?',
    id: 'UZKDAYo3XEw2AACX'
  },
  'APIs'      : {
    name: 'Get latest Ted Talks videos from YouTube (PHP)',
    id: 'Uj4SkdqCFq4tAACR',
  },
  'Services'  : {
    name: 'Make a Payment with Paypal API (Node.js)',
    id: 'UXgzNO_v2oZyAADG'
  },
  'Frameworks': {
    name: 'How to implement captcha with CakePHP (PHP)?', //How to perform authentication with Django (Python)
    id: 'Uhe0zoDwlW4tAAIC'
  },
  'Modules'   : {
    name: 'Sending and receiving events with socket.io (Node.js)',
    id: 'UTlPMV-f2W1TAAAu'
  }
};

var keywords = _.keys(keywordsAndExamples);
var examples = _(keywordsAndExamples).values().map(utils.pluck('name'));
var ids      = _(keywordsAndExamples).values().map(utils.pluck('id'));

module.exports = BaseView.extend({
  events: {
    'focus input'         : 'selectInput',
    'submit form'         : 'submitSearch'
  },
  sortChannels: function () {
    var opts = this.options;
    var category = opts.channels.params.category.toLowerCase();
    var sortOrder = [ "nodejs","python","ruby-on-rails","php",".net","jquery",
      "codeigniter","django","cakephp","paypal","mysql","node-mongodb-native"];
    function getOrder (channel) {
      var sortIndex;
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
    this.sortChannels();
    opts.categories.models.forEach(function (category) {
      attribs = category.attributes;
      attribs.link = '/c/'+attribs.name;
    });
    opts.keywords = keywords;
    return opts;
  },
  postRender: function () {
    if (typeof window !== 'undefined') window.tj = this;
    this.textEffect();
    this.searchSuggestions();
    this.imageTile();
  },
  textEffect: function () {
    this.$('#home-header h1 div').textillate({
      // the default selector to use when detecting multiple texts to animate
      selector: '.texts',

      // enable looping
      loop: true,

      // sets the minimum display time for each text before it is replaced
      minDisplayTime: cycleTime,

      // sets the initial delay before starting the animation
      // (note that depending on the in effect you may need to manually apply
      // visibility: hidden to the element before running this plugin)
      initialDelay: 0,

      // set whether or not to automatically start animating
      autoStart: true,

      // custom set of 'in' effects. This effects whether or not the
      // character is shown/hidden before or after an animation
      inEffects: [],

      // custom set of 'out' effects
      outEffects: [],

      // in animation settings
      in: {
        // set the effect name
        effect: 'fadeInDown',
        // set the delay factor applied to each consecutive character
        delayScale: 0,
        // set the delay between each character
        delay: delay,
        // set to true to animate all the characters at the same time
        sync: false,
        // randomize the character sequence
        // (note that shuffle doesn't make sense with sync = true)
        shuffle: false
      },

      // out animation settings.
      out: {
        effect: 'fadeOutDown',
        delayScale: 0,
        delay: delay,
        sync: false,
        shuffle: false,
      }
    });
  },
  searchSuggestions: function () {
    var queries = examples;
    var index = 0;
    var self = this;
    var $button = this.$('.hero button');
    var $search = this.$('.hero input.tt-query');
    self.typeIntervals = [];
    var int1, int2, int3;

    function nextQuery () {

      int1 = setTimeout(function () {
        console.log('outer')
        var str = queries[index];

        for (var i =0; i<str.length+1; i++) {
          (function (i) {
            int2 = setTimeout(function () {
              $search.val(str.slice(0, i));
              if (i==str.length) {
                $button.addClass('shine');
                int3 = setTimeout(function () {
                  $button.removeClass('shine');
                }, 3000);
                self.typeIntervals.push(int3);
              }
            }, 35*i);
            self.typeIntervals.push(int2);
          })(i);
        }

        index++;
        if (index === queries.length) index = 0;
      }, 1000+delay);
      self.typeIntervals.push(int1);
    }
    nextQuery();
    this.suggestionInterval = setInterval(nextQuery, cycleTime*2);
  },
  imageTile: function () {
    var $bubbles = this.$('.bubbles');
    utils.allImagesLoaded($bubbles.find('img'), function () {
      $bubbles.isotope({
        itemSelector : 'img',
        layoutMode   : 'masonry',
        itemPositionDataEnabled : true,
        transformsEnabled       : false,
        onLayout : function(){
          // $bubbles.find('.bubble').addClass('hero-animate');
        }
      });
    });
  },
  stopSlides: function () {
    this.stopped = true;
    clearInterval(this.suggestionInterval);
    this.typeIntervals.forEach(clearInterval);
  },
  selectInput: function (evt) {
    if (this.stopped) return;
    this.stopSlides();
    var self = this;
    setTimeout(function () {
      self.$('input.tt-query').select();
    }, 10); //settimeout bc typeahead js is interfering
  },
  submitSearch: function (evt) {
    var query = this.$('input.tt-query').val().trim();
    var index = examples.map(utils.lowercase).indexOf(query.toLowerCase());
    if ( ~index ) {
      evt.preventDefault();
      this.app.set('loading', true);
      window.location.href = '/'+ids[index];
    }
  },
  remove: function () {
    clearInterval(this.suggestionInterval);
    Super.remove.apply(this, arguments);
  }
});

module.exports.id = "channel/category";
