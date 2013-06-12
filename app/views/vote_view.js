var _ = require('underscore');
var BaseView = require('./base_view');
var _super = BaseView.prototype;


module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn-vote',
  events: {
    'click': 'vote'
  },
  postRender: function () {
    if (this.model.toJSON().voted) {
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

module.exports.id = 'VoteView';