module.exports = {
  setUp: function (browser, callback) {
    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  "filtering by category works": function (browser) {
    browser
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000);
  }
};