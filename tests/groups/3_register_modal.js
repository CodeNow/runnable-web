var globals;

module.exports = {
  setUp: function (browser, callback) {
    globals = browser.globals;
    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  "register modal opens": function (browser) {
    browser
      .url(globals.host)
      .waitForElementVisible('body', globals.defaultTimeout)
      .assert.elementNotPresent('#register-modal.in')
      .click('a#header-signup-link').pause(300)
      .assert.elementPresent('#register-modal.in')
      .click('#register-modal a.flip-link').pause(300)
      .assert.elementPresent('#register-modal.in.flip')
      .end();
  }
};