var BaseView = require('./base_view');
var _ = require('underscore');
var FileMenu = require('./file_menu');
var NewFileModal = require('./new_file_modal');
var utils = require('../utils');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  events: {
    'click span.dir:first' : 'toggle',
    'contextmenu' : 'contextMenu'
  },
  contextMenu: function (evt) {
    if (this.options.editmode) {
      evt.preventDefault(); // prevent browser context menu
      evt.stopPropagation();
      if (this.menu) {
        this.menu.remove();
        this.menu = null;
      }
      var collection = _.findWhere(this.childViews, {name:'fs_list'}).collection;
      var modelId = $(evt.target).data('id');
      var model = collection.get(modelId);
      var createOnly = !Boolean(modelId); // if grey area clicked don't show rename or delete..could be confusing to user
      model = model || this.model;
      var menu = this.menu = new FileMenu({
        createOnly: createOnly,
        model: model,
        top  : evt.pageY,
        left : evt.pageX,
        app  : this.app
      });
      this.listenToOnce(menu, 'rename', model.trigger.bind(model, 'rename'));
      this.listenToOnce(menu, 'delete', this.del.bind(this, model));
      this.listenToOnce(menu, 'default', this.def.bind(this, model));
      this.listenToOnce(menu, 'undefault', this.undefault.bind(this, model));
      this.listenToOnce(menu, 'delete', this.del.bind(this, model));
      this.listenToOnce(menu, 'create', this.create.bind(this));
      this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
    }
  },
  del: function (model) {
    var options = utils.cbOpts(function (err) {
      if (err) this.showError(err);
    }.bind(this));
    model.destroy(options);
  },
  def: function (model) {
    var options = utils.cbOpts(function (err) {
      if (err) this.showError(err);
    }.bind(this));
    options.patch = true;
    model.save({'default':true}, options);
  },
  undefault: function (model) {
    var options = utils.cbOpts(function (err) {
      if (err) this.showError(err);
    }.bind(this));
    options.patch = true;
    model.save({'default':false}, options);
  },
  create: function (type) {
    var collection = _.findWhere(this.childViews, {name:'fs_list'}).collection;
    this.newFileModal = new NewFileModal({
      collection : collection,
      type: type,
      app:this.app
    });
  },
  postHydrate: function () {
    this.listenTo(this.app.dispatch, 'sync:files', this.sync.bind(this));
  },
  getTemplateData: function () {
    return this.options;
  },
  preRender: function () {
    if (this.model && this.model.get('open')) {
      this.className = 'folder open';
    }
  },
  postRender: function () {
    this.$contentsUL = this.$('ul').first();
    // droppable
    this.$el.droppable({
      greedy: true,
      drop: this.onDrop.bind(this),
      hoverClass: 'drop-hover'
    });
  },
  slideUpHeight: function () {
    this.$el.removeClass('open');
    this.$contentsUL.slideUp(200, function () {
      this.animating = false;
    }.bind(this));
  },
  slideDownHeight: function () {
    this.$el.addClass('open');
    this.$contentsUL.slideDown(200, function () {
      this.animating = false;
    }.bind(this));
  },
  toggle: function (evt) {
    this.animating = true;
    if (this.model.get('open')) {
      this.close();
    }
    else {
      this.open();
    }
  },
  sync: function () {
    if (this.model.get('open')) {
      var contents = _.findWhere(this.childViews, {name:'fs_list'}).collection;
      var options = utils.cbOpts(cb, this);
      this.showLoader();
      contents.fetch(options);
      function cb () {
        this.hideLoader();
        if (err) {
          this.showError();
        }
      }
    }
  },
  open: function () {
    this.model.set('open', true);
    this.slideDownHeight();
    // fetch the dir contents if not fetched.
    var self = this;
    var fileList = _.findWhere(this.childViews, {name:'fs_list'});
    var collection = fileList.collection;
    if (!collection.fetched) {
      this.showLoader();
      var options = _.extend(utils.cbOpts(cb, this), {
        data: collection.params, // VERY IMPORTANT! - ask TJ.
        silent: true             // silent until all the models are for sure in store..
      });
      collection.fetch(options);
      function cb (err, collection) {
        this.hideLoader();
        if (err) {
          this.showError(err);
        }
        else {
          collection.forEach(function (model) {
            model.store(); // VERY IMPORTANT! - ask TJ.
            if (model.isDir()) model.contents.store();
          });
          collection.trigger('sync');
        }
      }
    }
  },
  close: function () {
    this.model.set('open', false);
    this.slideUpHeight();
  },
  onDrop: function (evt, ui) {
    debugger;
    debugger;
    evt.preventDefault();
    evt.stopPropagation();
    this.$el.removeClass('drop-hover');
    var self = this;
    var $itemDropped = $(ui.draggable).find('[data-id]');
    var fsPath = $itemDropped.data('id');
    if (fsPath) {
      // this._forkIfUserIsNotProjectOwner(function (err, data) {
      // TODO!
        // if (err) {
        //   self.showError('Error moving.');
        // }
        // else{
          console.log(fsPath);
          self.dir.moveIn(fsPath, function (err) {
            if (err) self.showError(err);
          });
        // }
      // });
    }
  },
  showLoader: function () {
    //TODO
  },
  hideLoader: function () {
    //TODO
  }
});

module.exports.id = "FileTree";
