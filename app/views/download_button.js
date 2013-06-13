var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'a',
  className: 'btn-download download-track btn-tertiary',
  postRender: function () {
    //set href tag
  }
});

module.exports.id = 'DownloadButton';
