var BaseView = require('./base_view');
var Super = BaseView.prototype;
var utils = require('../utils');
module.exports = BaseView.extend({
  tagName: 'button',
  className: 'vote btn silver',
  events: {
    'click': 'vote'
  },
  dontTrackEvents: ['click'],
  preRender: function () {
    // preRender is called before .getAttributes so setting attributes here still works
    var user = this.app.user;
    var model = this.model;
    this.attributes = this.attributes || {};
    this.attributes.href = 'javascript:void(0);';

    if (user.isOwnerOf(model) || user.hasVotedOn(model)) {
      // this.attributes = {
      //   disabled: 'disabled'
      // };
      this.className = 'vote voted btn silver';
    }
  },
  getTemplateData: function () {
    return this.model.toJSON();
  },
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
    this.listenTo(this.model, 'change:votes', this.render.bind(this));
  },
  vote: function (evt) {
    evt.preventDefault();

    var self = this;
    var user = this.app.user;
    var $el = $(evt.currentTarget);
    var blocked;

    if (user.hasVotedOn(this.model)) {
      blocked = true;
      self.trackError('vote', 'disabled vote clicked');
    }
    else {
      $el.addClass('voted');
      user.vote(this.model, function (errMessage) {
        if (errMessage) {
          blocked = true;
          self.showError(errMessage);
          self.trackError('vote', errMessage);
        }
        else {
          blocked = false;
        }
        self.trackEvent('vote', {blocked:blocked});
      });
    }
  }
});

module.exports.id = 'VoteButton';
