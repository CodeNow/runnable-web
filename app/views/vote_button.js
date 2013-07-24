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
  getTemplateData: function () {
    return this.model.toJSON();
  },
  postHydrate: function () {
    this.listenTo(this.app.user, 'change:_id', this.render.bind(this));
    this.listenTo(this.model, 'change:votes', this.render.bind(this));
    console.log(this.model.toJSON());
    console.log(this.model.toJSON());
    console.log(this.model.toJSON());
  },
  vote: function (evt) {
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
