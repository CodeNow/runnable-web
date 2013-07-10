var Base = require('./fs'); //!FS
var Super = Base.prototype;
var utils = require('../utils');
var _ = require('underscore');

var obj = {
  defaults: {
    type: 'file'
  },
  _unsaved: false,
  unFetched: function () {
    return !utils.exists(this.get('content'));
  },
  initialize: function (attrs, options) {
    Super.initialize.apply(this, arguments);
    this.listenTo(this, 'change:content', this.onChangeContent.bind(this));
    this.listenTo(this, 'sync', this.updateSaved.bind(this)); // on sync set unsaved to false
    this.updateSaved();
  },
  loseUnsavedChanges: function () {
    debugger;
    if (this.unsaved()) {
      this.set('content', this.savedContent);
      this.editorSession = null; //clear out editor session
    }
    return this;
  },
  _checkUnsaved: function () {
    return this.savedContent != this.get('content');
  },
  updateSaved: function () {
    this.savedContent = this.get('content');
    this.unsaved(false);
  },
  unsaved: function (bool) {
    if (utils.exists(bool)) {
      var prevUnsaved = this._unsaved;
      if (prevUnsaved != bool) {
        this._unsaved = bool; //set
        this.trigger('unsaved:content', bool);
      }
    }
    else {
      return this._unsaved; //get
    }
  },
  onChangeContent: function () {
    this.unsaved(this._checkUnsaved());
  }
};

module.exports = Base.extend(obj);

// module.exports = Fs.extend({
//   initialize: function (attrs, options) {
//     if (attrs && App.utils.exists(attrs.content)) {
//       this.hasUnsavedChanges(false);
//     }
//     this.on('change:content', this.onChangeContent, this);
//     return Super.initialize.apply(this, arguments);
//   },
//   dispose: function () {
//     this.off('change:contents');
//   },
//   // // Will be of use later when the save button is for a single file
//   // onChangeContent: function () {
//   //   var unsavedChanges = this.hasUnsavedChanges();
//   //   if (this.previouslyHadUnsavedChanges) {
//   //     if (!unsavedChanges) {
//   //       this.trigger('noUnsavedChanges');
//   //     }
//   //   }
//   //   else { // did not previously have unsaved changes
//   //     if (unsavedChanges) {
//   //       this.trigger('hasUnsavedChanges');
//   //     }
//   //   }
//   //   this.previouslyHadUnsavedChanges = unsavedChanges;
//   // },
//   defaults: function () {
//     return {
//       type: 'file'
//     };
//   },
//   loseUnsavedChanges: function () {
//     if (this.hasUnsavedChanges()) {
//       this.set('content', this.get('savedContent'));
//       this.editorSession = null; //clear out editor session
//     }
//     return this;
//   },
//   hasUnsavedChanges: function (val) {
//     if (val === false) {
//       this.set('savedContent', this.get('content'));
//     }
//     else {
//       return this.get('savedContent') != this.get('content');
//     }
//   },
//   parse: function (attrs, opts) {
//     if (attrs && App.utils.exists(attrs.content)) {
//       attrs.savedContent = attrs.content;
//     }
//     return Super.parse.apply(this, arguments);
//   },
//   isClientSide: function () {
//       if (this.get('name').slice(-4) == ".css"){
//         return true;
//       } else {
//         return false;
//       }
//   },
//   isNew: function () {
//     return !App.utils.exists(this.get('content'));
//   }
//   // saveFile: function (projectId, options, cb) {
//   //   var self = this, data;
//   //   if (typeof options == 'function') {
//   //     cb = options;
//   //     options = undefined;
//   //   }
//   //   options = options || {};
//   //   if (!this.hasUnsavedChanges()) { cb(); } else {

//   //     $.post('/api/users/me/runnables/' +projectId + '/changeFile', self.toJSON());

//   //     // has unsaved changes
//   //     // App.socket.emit('writeProject', projectId, self.toJSON(), function(err) {
//   //     //   if (err) {
//   //     //     cb(err);
//   //     //   }
//   //     //   else {
//   //     //     self.hasUnsavedChanges(false);
//   //     //     cb();
//   //     //   }
//   //     // });

//   //   }
//   // }
// });

module.exports.id = "File";