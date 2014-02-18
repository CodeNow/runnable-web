var BaseView = require('./base_view'),
    marked   = require('marked');

module.exports = BaseView.extend({
  id: 'html-readme',
  postHydrate: function () {
    this.app.dispatch.on('toggle:readme', this.update, this);
  },
  update: function (open) {
    if(!open)
      return;
    var el = this.el;
    var model = this.model.contents.find(function(data){
      return data.get('name') && data.get('name').toLowerCase() === 'readme.md';
    });
    if(!model){
      el.innerHTML = '<h1>Add a README.md</h1>';
      return;
    }
    marked(model.get('content'), function (err, html) {
      if(err)
        return;
      el.innerHTML = html;
    });
  },
  postRender: function () {
    if(this.collection.length === 0){
      this.app.dispatch.trigger('toggle:readme', true);
    }
  }
});

module.exports.id = "HtmlReadme";
