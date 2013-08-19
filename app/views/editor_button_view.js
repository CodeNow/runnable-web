var BaseView = require('./base_view');

module.exports = BaseView.extend({
  // preRender: function () {
  //   this.attributes = {
  //     disabled: 'disabled'
  //   };
  // },
  // postHydrate: function () {
  //   var dispatch = this.app.dispatch;
  //   if (dispatch) {
  //     this.listenTo(dispatch, 'ready:box', this.onBoxReady.bind(this));
  //   }
  // },
  // onBoxReady: function () {
  //   this.disable(false);
  // }
});

module.exports.id = "EditorButtonView";
