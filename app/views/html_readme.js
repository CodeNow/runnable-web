var BaseView = require('./base_view');
var marked   = require('marked');
var File     = require('../models/file');
var utils    = require('../utils');
var _        = require('underscore');

var busy = false;

module.exports = BaseView.extend({
  id: 'html-readme',
  events: {
    'click a#create-readme': 'createReadme'
  },
  createReadme: function (evt) {
    evt.preventDefault();

    //Don't allow repeat clicks
    if(busy)
      return;
    busy = true;

    var containerName = this.options.containername + "\n";
    for(var i = 0, len=containerName.length-1; i < len; i++){
      containerName += '='
    }
    containerName += "\n";

    var m = new File({
      dir:     false,
      name:    'README.md',
      path:    '/',
      content: containerName
    }, {
      app: this.app
    });

    var callback = function (err, model) {
      busy = false;
      if (err) {
        alert(err);
      }
      else {
        // ASK TJ ABOUT STORE
        model.store(); // since this model created after page load.. and is used bind to a view in a (re)render..
        
        this.model.contents.add(model);
        //Auto open after creating
        this.collection.add(model);

        this.app.dispatch.trigger('open:file', model);
      }
    };

    var options = utils.successErrorToCB(callback.bind(this));
    options.url = _.result(this.collection, 'url');
    m.save({}, options);

  },
  postHydrate: function () {

    // this.app.dispatch.off('toggle:readme', this.toggle);
    this.app.dispatch.on('toggle:readme', this.toggle, this);

    // this.model.contents.off('remove', this.onDeleteFile);
    this.model.contents.on('remove', this.onDeleteFile, this);

  },
  onDeleteFile: function(model, collection, options) {
    if(model.get('name').toLowerCase() == 'readme.md')
      this.render();
  },
  toggle: function (open) {
    if(this.options.open === open)
      return;
    this.options.open = open;
    if(open)
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
                    + '<h3>You should <a id="create-readme">create a README.md</a>.</h3>'
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
