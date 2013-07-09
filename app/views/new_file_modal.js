var _ = require('underscore');
var ModalView = require('./modal_view');
var File = require('../models/file');
var Dir = require('../models/dir');
var utils = require('../utils');
var Super = ModalView.prototype;

module.exports = ModalView.extend({
  className: 'lightbox',
  events: _.extend(Super.events, {
    'click .btn-cancel' : 'remove',
    'submit form'       : 'submit'
  }),
  postInitialize: function () {
    $('body').append(this.$el);
    this.render();
  },
  getTemplateData: function () {
    return this.options;
  },
  submit: function (evt) {
    evt.preventDefault();
    // TODO: break out fs back into file and dir, when fs colleciton is changed back too - // if (this.options.type == 'dir' || this.options.type == 'folder')
    var data = $(evt.currentTarget).serializeObject();
    var type = this.options.type;
    var dir  = (type == 'folder' || type == 'dir');
    var model = (dir)
      ? new Dir({}, {app:this.app})
      : new File({}, {app:this.app});
    debugger;
    data = _.extend(data, {
      dir     : dir,
      path    : this.collection.params.path,
      content : " " // init file content to blank..
    });
    var options = utils.successErrorToCB(this.saveCallback.bind(this));
    options.url = _.result(this.collection, 'url');
    model.save(data, options);
  },
  saveCallback: function (err, model) {
    if (err) {
      alert(err);
    }
    else {
      this.collection.add(model);
      if (model.isFile()) {
        this.app.dispatch.trigger('open:file', model);
      }
      this.remove();
    }
  }
});

module.exports.id = "NewFileModal";
