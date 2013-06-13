var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-vote',
  events: {
    'click': 'vote'
  },
  postRender: function () {
    if (this.model.get('voted')) {
      this.$el.attr('disabled', 'disabled');
    }
  },
  vote: function (evt) {
    var self = this;
    this.model.vote(function (err) {
      if (err) {
        alert(err);
      } else {
        self.render();
      }
    });
  }
});

module.exports.id = 'VoteButton';
