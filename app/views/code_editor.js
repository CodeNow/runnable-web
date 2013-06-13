var BaseView = require('./base_view');

module.exports = BaseView.extend({
  className: 'code-editor',
  minHeight: 300,
  maxHeight: 550,
  postRender: function () {
    // render should only occur once!
    this.setHeight(this.minHeight);
    this.editor = ace.edit(this.el);
    console.log(this.el);
    var session = this.editor.getSession();
    this.listenTo(session, 'change', this.onChange.bind(this));
  },
  onChange: function () {
    this.adjustHeightToContents();
  },
  adjustHeightToContents: function () {
    var editor = this.editor;
    var min = this.minHeight;
    var max = this.maxHeight;
    var newHeight = editor.getSession().getScreenLength()
      * editor.renderer.lineHeight
      + editor.renderer.scrollBar.getWidth();
    if (newHeight < min) newHeight = min;
    if (newHeight > max) newHeight = max;
    this.setHeight(newHeight+"px");
    this.editor.resize();
  },
  setHeight: function (height) {
    if (typeof height == 'number') {
      height = height + 'px'; // assume px
    }
    this.el.style.height = height;
    // this.$('#editor-section').height(height.toString() + "px");
  }
});

module.exports.id = "CodeEditor";
