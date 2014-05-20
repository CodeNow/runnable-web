module.exports = {
  setUp: function (browser, callback) {
    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  "filtering by category works": function (browser) {
    browser
      .url(browser.globals.host)
      .waitForElementVisible('body', browser.globals.defaultTimeout)
      .end();
  }
};