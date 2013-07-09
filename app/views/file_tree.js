var BaseView = require('./base_view');
var _ = require('underscore');
// var FileMenu = require('./file_menu');
// var NewFileModal = require('./new_file_modal');
var utils = require('../utils');

var Super = BaseView.prototype;
module.exports = BaseView.extend({
  tagName: 'li',
  className: 'folder',
  events: {
    'click span.dir:first' : 'toggle'
    // 'contextmenu' : 'contextMenu'
  },
  // contextMenu: function (evt) {
  //   evt.preventDefault(); // prevent browser context menu
  //   if (this.menu) {
  //     this.menu.remove();
  //     this.menu = null;
  //   }
  //   var menu = this.menu = new FileMenu({
  //     createOnly: true,
  //     model: this.model,
  //     top  : evt.pageY,
  //     left : evt.pageX,
  //     app:this.app
  //   });
  //   this.listenToOnce(menu, 'create', this.create.bind(this));
  //   this.listenToOnce(menu, 'remove', this.stopListening.bind(this, menu));
  // },
  // create: function (type) {
  //   var dir = this.parentView.model;
  //   this.newFileModal = new NewFileModal({
  //     collection : collection,
  //     type: type,
  //     app:this.app
  //   });
  // },
  getTemplateData: function () {
    return this.options;
  },
  openClass: function () {
    if (this.model && this.model.get('open')) {
      if (this.$el)
        this.$el.addClass('open');
      else
        this.className = 'folder open';
    }
    else {
      if (this.$el)
        this.$el.removeClass('open');
      else
        this.className = 'folder';
    }
  },
  postInitialize: function () {
    this.openClass();
  },
  postRender: function () {
    this.openClass();
    //todo: remove display-none
    debugger;
    // clientside postHydrate and getTemplateData have occured.
    this.$contentsUL = this.$('ul').first();
    // alert("Get here "+ );
    // droppable
    // this.$el.droppable({
    //   greedy: true,
    //   drop: this.onDrop.bind(this),
    //   hoverClass: 'drop-hover'
    // });
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
  open: function () {
    this.model.set('open', true);
    this.slideDownHeight();
    // fetch the dir contents if not fetched.
    var self = this;
    var fileList = _.findWhere(this.childViews, {name:'fs_list'});
    var collection = fileList.collection;
    if (collection.unFetched()) {
      this.showLoader();
      var options = utils.successErrorToCB(function (err) {
        this.hideLoader();
        if (err) this.showError(err);
      }.bind(this));
      collection.fetch(options);
    }
  },
  close: function () {
    this.model.set('open', false);
    this.slideUpHeight();
  },
  onDrop: function (evt, ui) {
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
