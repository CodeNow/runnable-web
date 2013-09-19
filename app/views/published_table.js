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
    'click .delete-published' : 'deletePublished'
  },
  postHydrate: function () {
    this.collection.models.sort(byCreated);
  },
  postRender: function () {
    this.collection.on('remove', this.render.bind(this));
  },
  deletePublished: function (evt) {
    var id = $(evt.currentTarget).data('id');
    var published = this.options.collection.get(id);
    var opts = utils.cbOpts(this.showIfError, this);
    published.destroy(opts);
  }
});

module.exports.id = "PublishedTable";
