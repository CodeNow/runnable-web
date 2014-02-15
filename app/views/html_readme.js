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
    if(!model)
    	return;
    var el = this.el;
    marked(model.get('content'), function (err, html) {
    	if(err)
    		return;
    	el.innerHTML = html;
    });
  }
});

module.exports.id = "HtmlReadme";