var BaseView = require('./base_view');

// this view is fugly - from expiriment - praful knows about this so maybe he can clean it up.
// or just replace functionality with a real search

module.exports = BaseView.extend({
  events: {
    'submit .search-bar-form'                   : 'submitSearch',
    'click .search-bar-form-dropdown-element a' : 'clickedProject',
    'blur #search-bar-input'                    : 'hideDropdown',
    'keyup #search-bar-input'                   : 'keyupSearch'
  },

  clickedProject: function (evt) {
    // Track.event.call(Track, "SearchBar", "Project Selected", {
    //   term: $("#search-bar-form-input").val(),
    //   link: evt.currentTarget.href
    // });
  },

  postRender: function () {
    // this.$('#search-bar-input').on('blur', this.hideDropdown.bind(this));
  },

  submitSearch: function (evt) {
    evt.preventDefault();
  },

  filterResults: function (string) {
    var results = [];
    var allWords = string.trim().split(/\s+/).map(function (word) {
      return new RegExp(word, 'i');
    });

    /*this.collection.toJSON().forEach(function (project) {
      var matchCount = 0;
      allWords.forEach(function (word) {
        if (word.test(project.name)) {
          matchCount++;
        }
      });
      if (matchCount === allWords.length) {
        results.push(project);
      }
    });*/

    return results;
  },

  hideDropdown: function () {
    this.$("#search-bar-dropdown").hide();
  },

  keyupSearch: function () {
    var self = this;
    this.$("#search-bar-dropdown").slideDown();
    // clear the dropdown first
    this.$("#search-bar-dropdown-suggestions").html("");
    // add mathced results to the dropdown
    this
      .filterResults(this.$("#search-bar-input").val())
      .slice(0,5)
      .forEach(function (project) {
        var answerURL = ['/', project._id, '/', project.urlFriendly].join('');

        var html = [
          '<li class="search-bar-dropdown-element" >',
          '<a data-bypass href="/', answerURL, '">',
          project.name,
          '</a></li>'
        ].join('');

        if (answerURL) {
          self
            .$("#search-bar-dropdown-suggestions")
            .append(html);
        }
      });
  }
});

module.exports.id = 'SearchBarView';
