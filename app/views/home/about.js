var BaseView = require('../base_view');

module.exports = BaseView.extend({
  id:'about',
  postRender: function () {
    setTimeout(function () {
      $.stellar();
    }, 100); // timeout for clientside hit, else doesnt work..
  }
});

module.exports.id = "home/about";
