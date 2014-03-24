var BaseView = require('./base_view');
var Image = require('../models/image');
var Container = require('../models/container');

module.exports = BaseView.extend({
  id: 'git-card',
  className: 'col-sm-4',
  events: {
    'input input'    : 'enableSelect',
    'keydown select' : 'preventTyping',
    'change select'  : 'changeLanguage'
  },
  preventTyping: function (evt) {
    if (code !== 40 || code !== 38) {
      evt.preventDefault();
    }
  },
  enableSelect: function (evt) {
    var select = this.$('select');

    if ($(evt.currentTarget)[0].value) {
      select.prop('disabled',false);
    } else {
      select.prop('disabled',true);
      resetSelect();
    }
  },
  changeLanguage: function () {
    var langVal = this.$('select')[0].value;
    var self = this;
    self.gitLoader(true);
    this.$('button').text(langVal);
    var image = new Image({}, {app:this.app});
    image.githubImport({
      githubUrl: this.$('input').val(),
      stack: langVal
    }, function (err, image) {
      if (err) {
        self.showError(err);
        self.gitLoader(false);
        self.resetSelect();
      } else {
        var container = new Container({}, { app:this.app });
        container.createFrom(image.id, function (err, container) {
          self.gitLoader(false);
          if (err) {
            self.showError(err);
            self.resetSelect();
          } else {
            self.app.router.navigate(container.appURL(), true);
          }
        });
      }
    });
  },
  gitLoader: function (bool) {
    var $body = $('body');
    var $gitLoader = this.$('.overlay-loader')

    if (bool) {
      $body.addClass('modal-open');
      $gitLoader.addClass('loading');
    }
    else {
      $body.removeClass('modal-open');
      $gitLoader.removeClass('loading');
    }
  },
  resetSelect: function () {
    var select = this.$('select');

    select
      .siblings()
      .text('Language')
      .end()[0]
      .selectedIndex = 0;
  }
});

module.exports.id = "GitCard";