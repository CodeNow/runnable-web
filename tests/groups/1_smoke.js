module.exports = {
  "GET /": function (browser) {
    browser
      .url(browser.globals.host)
      .waitForElementVisible('body', browser.globals.defaultTimeout)
      .assert.elementNotPresent('main.container#error')
      .end();
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
  }
};