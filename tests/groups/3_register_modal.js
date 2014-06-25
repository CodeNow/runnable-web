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
      .click('a#header-signup-link').pause(800)
      .assert.elementPresent('#signup.modal.in')
      .click('#signup.modal.in a.login-link').pause(800)
      .assert.elementPresent('#login.modal.in')
      .click('#login.modal.in button.close').pause(800)
      .assert.elementNotPresent('#login.modal.in')
      .end();
  }
};