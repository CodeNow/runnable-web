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
    var model = this.model.contents.findWhere({
    	name: 'README.md'
    });
    var el = this.el;
    if(!model){
      el.innerHTML = '<h1>Add a README.md</h1>';
    	return;
    }
    marked(model.get('content'), function (err, html) {
    	if(err)
    		return;
    	el.innerHTML = html;
    });
  }
});

module.exports.id = "HtmlReadme";