var BaseView = require('./base_view');
var Super = BaseView.prototype;
var utils = require('../utils');
module.exports = BaseView.extend({
  tagName: 'a',
  className: 'vote-up',
  events: {
    'click': 'vote'
  },
  preRender: function () {
    // preRender is called before .getAttributes so setting attributes here still works
    var user = this.app.user;
    this.attributes = this.attributes || {};
    this.attributes.href = 'javascript:void(0);';
    // if (user.isOwnerOf(this.model) || !utils.exists(user.get('votes'))) {
    //   this.attributes = {
    //     disabled: 'disabled'
    //   };
    //   delete this.attributes.href;
    // }
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
    this.app.user.vote(this.model, function (errMessage) {
      if (errMessage) {
        self.showError(errMessage);
        self.trackError('vote', errMessage);
      }
    });
  }
});

module.exports.id = 'VoteButton';
