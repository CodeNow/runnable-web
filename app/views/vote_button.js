var BaseView = require('./base_view');
var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-vote',
  events: {
    'click': 'vote'
  },
  postHydrate: function () {
    this.listenTo(this.model, 'change:votes', this.render.bind(this));
  },
  postRender: function () {
    var user = this.app.user;
    if (user.hasVoted(this.model) || user.isOwnerOf(this.model)) {
      this.$el.attr('disabled', 'disabled');
    }
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
