function testLoadOk (browser, path) {
  browser
    .url(browser.globals.host + path)
    .waitForElementVisible('body', browser.globals.defaultTimeout)
    .assert.elementNotPresent('main.container#error')
    .end();
}

module.exports = {
  "GET /": function (browser) {
    testLoadOk(browser, '');
  },
  "GET /new": function (browser) {
    testLoadOk(browser, 'new');
  },
  "GET /new/PHP": function (browser) {
    testLoadOk(browser, 'new/php');
  },
  "GET /publish": function (browser) {
    testLoadOk(browser, 'publish');
  },
  "GET /about": function (browser) {
    testLoadOk(browser, 'about');
  },
  "GET /jobs": function (browser) {
    testLoadOk(browser, 'jobs');
  },
  "GET /privacy": function (browser) {
    testLoadOk(browser, 'privacy');
  },
  "GET /UXczcazDrMMiAAGl/how-to-do-ajax-in-codeigniter": function (browser) {
    testLoadOk(browser, 'UXczcazDrMMiAAGl/how-to-do-ajax-in-codeigniter');
  },
  "GET /A404Route": function (browser) {
    browser
      .url(browser.globals.host + 'A404Route')
      .waitForElementVisible('body', browser.globals.defaultTimeout)
      .assert.elementPresent('main.container#error')
      .end();
  }
};