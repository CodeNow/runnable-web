var BaseView = require('./base_view');
var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-vote',
  events: {
    'click': 'vote'
  },
  // initialize: function () {
  //   Super.initialize.apply(this, arguments);
  //   console.log('WHAT!!123')
  // },
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
