var BaseView = require('./base_view');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  postHydrate: function () {
    // clientside
    // postHydrate is the place to attach data events
    this.path = this.options.path || '/';
    this.dir = this.model.rootDir.getPath(this.path);
  },
  getTemplateData: function () {
    // be careful postHydrate has only been called before frontend render but not backend!
    // this means, the only data you can rely on is this.model and this.options binded to this view.
    this.path = this.path || this.options.path || '/';
    this.dir  = this.dir  || this.model.rootDir.getPath(this.path);
    return {
      dirJSON  : this.dir.toJSON(),
      contents : this.dir.collection().toArray(),
      project  : this.model
    };
  },
  postRender: function () {
    // clientside postHydrate and getTemplateData have occured.
    if (this.dir.get('open')) this.$el.addClass('open');
  }
});

module.exports.id = "FileTree";
