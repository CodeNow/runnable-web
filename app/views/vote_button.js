var BaseView = require('./base_view');

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
    if (this.model.hasUserVoted() || this.model.isUserOwner()) {
      this.$el.attr('disabled', 'disabled');
    }
  },
  vote: function (evt) {
    var self = this;
    this.model.vote(function (err) {
      if (err) {
        alert(err.message);
      }
    });
  }
});

module.exports.id = 'VoteButton';
