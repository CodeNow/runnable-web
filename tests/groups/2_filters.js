module.exports = {
  setUp: function (browser, callback) {
    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  "GET /?orderBy=popular": function (browser) {
    browser
      .url(browser.globals.host + '?orderBy=popular')
      .waitForElementVisible('body', browser.globals.defaultTimeout)
      .assert.elementNotPresent('main.container#error')
      .end();
  },
  "GET /?orderBy=trending": function (browser) {
    browser
      .url(browser.globals.host + '?orderBy=trending')
      .waitForElementVisible('body', browser.globals.defaultTimeout)
      .assert.elementNotPresent('main.container#error')
      .end();
  },
  "GET /?orderBy=trending&filter=jQuery&page=1": function (browser) {
    
  }
};