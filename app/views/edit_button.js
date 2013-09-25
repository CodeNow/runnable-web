var EditorButtonView = require('./editor_button_view');
var Super = EditorButtonView.prototype;

module.exports = EditorButtonView.extend({
  tagName: 'button',
  className: 'purple',
  events: {
    'click': 'openContainerPage'
  },
  preRender: function () {
    Super.preRender.call(this);
  },
  postHydrate: function () {
    Super.postHydrate.call(this);
  },
  openContainerPage: function () {
    // in the future we may want to open a new container and not this one
    window.location.href = '/me/'+this.options.containerid;
  }
});

module.exports.id = 'EditButton';
