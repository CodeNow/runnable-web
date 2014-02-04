var BaseView = require('./base_view');

module.exports = BaseView.extend({
  id: "project-select-tabs",
  className: "dropdown alt",
  events: {
    'change select':'selectChanged'
  },
  selectChanged: function (evt) {
    // evt.preventDefault();
    var selectedIndex = $(".file_select_menu_class")[0].selectedIndex;
    this.collection.at(selectedIndex).set("selected", true);
    // this.render();
  },
  preRender: function () {
  },
  postHydrate: function () {
    this.listenTo(this.collection, 'change', this.render.bind(this));
  }
});

module.exports.id = "FileSelect";
