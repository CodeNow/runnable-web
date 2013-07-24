;(function (global) {
  var Track = function(){
    this.userTracked = false;
    this.trackQualarooEvents();
  };

  Track.prototype.trackQualarooEvents = function () {
    if (this.trackingOff()) return;
    var self = this;
    _kiq.push(['eventHandler', 'submit', function(data){
      if (data && data.current_fields) {
        data.current_fields.forEach(function (survey) {
          var surveyOptions = { question:survey.question };
          for (var key in survey.answer) {
            surveyOptions['answer_'+key] = survey.answer[key];
          }
          self.event('Qualaroo', 'Survey Answered', surveyOptions);
        });
      }
    }]);
  };

  Track.prototype.trackingOff = function() {
    return ($.getQuery && $.getQuery('track') == 'off');
  },

  Track.prototype.user = function(userId) {
    if (this.trackingOff()) {
      return;
    }
    if (!this.userTracked) { // dont push identification to services multiple times..
      this.userTracked = true;
      //google analytics
      ////na
      //mixpanel
      mixpanel.identify(userId);
      //qualaroo
      if (_kiq)
        _kiq.push(['identify', userId]);
    }
  };

  Track.prototype.userInfo = function (obj) {
    mixpanel.people.set(obj);
    if (obj.$email != null) { // not null or undefined
      mixpanel.name_tag(obj.$email);
      this.user(obj.$email);
    }
  };

  Track.prototype.pageView = function() {
    if (this.trackingOff()) {
      return;
    }
    var page = window.location.pathname + window.location.hash;
    console.log('<PAGE>', page);
    var referrer = document.referrer;
    // google analytics page tracking
    _gaq.push(['_trackPageview', page]);
    // mixpanel
    mixpanel.track_pageview(page);
    mixpanel.track('Page Visit', {'Viewed URL':page});
  };

  Track.prototype.event = function(eventCategory, eventName, properties) {
    if (this.trackingOff()) {
      return;
    }
    var page = window.location.pathname + window.location.hash;
    properties = properties || {};
    properties['Viewed URL'] = page;
    //console
    console.log('<EVENT>', eventCategory, '-', eventName, properties);
    //google analytics
    _gaq.push(['_trackEvent', eventCategory, eventName, page]);
    //mixpanel
    mixpanel.track(eventCategory+' - '+eventName, properties);
  };

  Track.prototype.hideSurvey = function() {
    var hideSurvey = function() {
      if (window.KI) {
         window.KI.hide_survey();
         window.KI.show_survey = function(){};
         console.log('hide_survey');
      }
      else {
         console.log('hide_survey - timeout');
         setTimeout(function(){hideSurvey();}, 20);
       }
    };

    hideSurvey();
  };

  Track.prototype.increment = function () {
    mixpanel.people.increment.apply(mixpanel.people, arguments);
  };


  if (global.define) {
    define([], function() {
      return new Track();
    });
  }
  else if (global.module) {
    module.exports = new Track();
  }
  else if (global.exports) {
    exports = new Track();
  }
  else {
    global.Track = new Track();
  }
})(window);