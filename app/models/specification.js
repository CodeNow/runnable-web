var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/specifications',
  defaults: {
    count: 0
  },
  allowEdit: function () {
    var user = this.app.user;
    return this.isNew() ||
      (!this.get('inUseByNonOwner') && user.canEdit(this));
  },
  renderedInstructions: function () {
    var marked = require('marked');
    return marked(this.get('instructions') || '');
  }
});
module.exports.id = 'Specification';