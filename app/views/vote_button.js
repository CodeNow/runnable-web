var BaseView = require('./base_view');
var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-vote',
  events: {
    'click': 'vote'
  },
  preRender: function () {
    // preRender is called before .getAttributes so setting attributes here still works
    var user = this.app.user;
    if (user.hasVoted(this.model) || user.isOwnerOf(this.model)) {
      this.attributes = {
        disabled: 'disabled'
      };
    }
  },
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
    this.listenTo(this.model, 'change:votes', this.render.bind(this));
  },
  vote: function (evt) {
    var self = this;
    this.app.user.vote(this.model, function (errMessage) {
      if (errMessage) {
        alert(errMessage);
      }
    });
  }
});

module.exports.id = 'VoteButton';
