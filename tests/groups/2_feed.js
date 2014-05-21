var queryString = require('query-string');
var _ = require('underscore');
var globals;

function testCanonical (opts) {
  var defaults = _.extend({
    orderBy: 'trending',
    filter: [],
    page: 1
  }, opts);
  if (defaults.filter.length === 0) delete defaults.filter;
  var base = 'http://runnable.com/?';
  base += queryString.stringify(defaults);
  return base;
}

module.exports = {
  setUp: function (browser, callback) {
    globals = browser.globals;
    callback();
  },
  tearDown: function (callback) {
    callback();
  },
  "default sort 'trending'": function (browser) {
    browser
      .url(globals.host)

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: 1,
        orderBy: 'trending'
      }))

      .assert.elementNotPresent('main.container#error')
      .assert.cssClassNotPresent('a#popular', 'active')
      .assert.cssClassPresent('a#trending', 'active')
      .end();
  },
  "popular sorting": function (browser) {
    browser
      .url(globals.host + '?orderBy=popular')

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: 1,
        orderBy: 'popular'
      }))

      .assert.elementNotPresent('main.container#error')
      .assert.cssClassPresent('a#popular', 'active')
      .assert.cssClassNotPresent('a#trending', 'active')
      .end();
  },
  "explicit trending sorting": function (browser) {
    browser
      .url(globals.host + '?orderBy=trending')

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: 1,
        orderBy: 'trending'
      }))

      .assert.elementNotPresent('main.container#error')
      .assert.cssClassNotPresent('a#popular', 'active')
      .assert.cssClassPresent('a#trending', 'active')
      .end();
  },
  "ordering, filtering and pagination": function (browser) {

    var page1 = 1;
    var page2 = 2;

    browser
      .url(globals.host + '?orderBy=trending&filter=jQuery&page=' + page1)

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)
      .waitForElementVisible('section#filters li[data-name="jQuery"]', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: page1,
        orderBy: 'trending',
        filter: [
          'jQuery'
        ]
      }))

      .assert.cssClassNotPresent('a#popular', 'active')
      .assert.cssClassPresent('a#trending', 'active')
      .assert.cssClassPresent('section#filters li[data-name="jQuery"]', 'active')

      // -----------------------------------------

      .url(globals.host + '?orderBy=trending&filter=jQuery&page=' + page2)

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)
      .waitForElementVisible('section#filters li[data-name="jQuery"]', globals.defaultTimeout)
      .waitForElementVisible('ul.pagination li.active', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: page2,
        orderBy: 'trending',
        filter: [
          'jQuery'
        ]
      }))

      .assert.cssClassNotPresent('a#popular', 'active')
      .assert.cssClassPresent('a#trending', 'active')
      .assert.cssClassPresent('section#filters li[data-name="jQuery"]', 'active')
      .assert.containsText('ul.pagination li.active', page2)

      // -----------------------------------------
      /**
       * Below route has 0 matching runnables
       */

      .url(globals.host + '?orderBy=trending&filter=jQuery&filter=PHP&page=' + page2)

      .waitForElementVisible('body', globals.defaultTimeout)
      .waitForElementVisible('a#popular', globals.defaultTimeout)
      .waitForElementVisible('a#trending', globals.defaultTimeout)
      .waitForElementVisible('section#filters li[data-name="jQuery"]', globals.defaultTimeout)

      .assert.attributeEquals('head link[rel="canonical"]', 'href', testCanonical({
        page: page2,
        orderBy: 'trending',
        filter: [
          'jQuery',
          'PHP'
        ]
      }))

      .assert.cssClassNotPresent('a#popular', 'active')
      .assert.cssClassPresent('a#trending', 'active')
      .assert.cssClassPresent('section#filters li[data-name="jQuery"]', 'active')
      .assert.cssClassPresent('section#filters li[data-name="PHP"]', 'active')
      .assert.elementNotPresent('ul.pagination')

      .end();
  }
};