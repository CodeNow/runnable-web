var BaseView = require('./base_view');
var utils = require('../utils');
function byCreated (a, b) {
  return (a.get('created') > b.get('created')) ?
    -1 : 1;
}

module.exports = BaseView.extend({
  tagName:'table',
  className:'table table-striped',
  events: {
    'click .delete-draft' : 'deleteDraft'
  },
  postHydrate: function () {
    this.collection.models.sort(byCreated);
  },
  postRender: function () {
    this.collection.on('remove', this.render.bind(this));
  },
  deleteDraft: function (evt) {
    var id = $(evt.currentTarget).data('id');
    var draft = this.options.collection.get(id);
    var opts = utils.cbOpts(this.showIfError, this);
    draft.destroy(opts);
  }
});

module.exports.id = "DraftsTable";
