var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'object',
  className: 'iconnables filetypes',
  attributes: {
    'type' : 'image/svg+xml'
  },
  preRender: function () {
    var self = this;
    var fileType = self.parentView.model.attributes.type;

    switch (fileType) {
      case 'dir':
        self.attributes.data = '/images/icons/filetypes/icons-folder.svg';
        break;
      case 'file':
        self.attributes.data = '/images/icons/filetypes/icons-file.svg';
        break;
    }
  }
});

module.exports.id = "FiletypeIcon";
