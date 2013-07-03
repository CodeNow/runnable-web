var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'nav',
  className: 'tags-nav',
  postHydrate: function () {
    this.listenTo(this.model, 'change:tags', this.render.bind(this));
  },
  postRender: function () {
    this.$('img').on('error', function (evt) {
      $(evt.currentTarget).hide();
    });
  },
  getTemplateData: function () {
    return {
      tags    : this.model.get('tags'),
      editMode: this.options.editMode
    };
  }
});

module.exports.id = "RunnableTags";
