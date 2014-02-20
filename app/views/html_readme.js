var BaseView = require('./base_view'),
    marked   = require('marked');

module.exports = BaseView.extend({
  id: 'html-readme',
  postHydrate: function () {
    this.app.dispatch.on('toggle:readme', this.toggle, this);
  },
  toggle: function (open) {
    this.options.open = open;
    this.render();
  },
  getTemplateData: function () {
    var opts = this.options;
    var readmeFile = this.model.contents.find(function(data){
      return data.get('name') && data.get('name').toLowerCase() === 'readme.md';
    });

    if (!readmeFile) {
      if (this.options.editmode) { // container page
        opts.html = '<div class="readme-help">'
                    + '<h3>You should <a>create a README.md</a>.</h3>'
                    + '<a href="http://daringfireball.net/projects/markdown/" target="_blank">Markdown Help</a>'
                    + '</div>';
      }
      else {
        // show blank;
        opts.html = '';
        //TODO: Set first file to display
        //this.collection.at(0).set('selected', true);
      }
    }
    else {
      if (readmeFile.get('content').trim() === '') {
        opts.html = '<h3 class="readme-help">There\'s nothing in your README.md file.</h3>';
      }
      else {
        opts.html = marked(readmeFile.get('content'));
      }
    }
    return opts;
  },
  preRender: function () {
    if(this.collection.length === 0){
      this.app.dispatch.trigger('toggle:readme', true);
    }
  }
});

module.exports.id = "HtmlReadme";
