var BaseView = require('./base_view');
var Image = require('../models/image');
var Container = require('../models/container');

module.exports = BaseView.extend({
  id: 'git-card',
  className: 'col-sm-4',
  events: {
    'input input' : 'enableSelect',
    'change select' : 'changeLanguage'
  },
  enableSelect: function (evt) {
    var select = this.$('select');

    if ($(evt.currentTarget)[0].value) {
      select.prop('disabled',false);
    } else {
      select.prop('disabled',true)
        .siblings().text('Language')
        .end()[0].selectedIndex = 0;
    }
  },
  changeLanguage: function () {
    var langVal = this.$('select')[0].value;
    var self = this;
    this.$('button').text(langVal);
    var image = new Image({}, {app:this.app});
    image.githubImport({
      githubUrl: this.$('input').val(),
      stack: langVal
    }, function (err, image) {
      if (err) {
        self.showError(err);
      } else {
        var container = new Container({}, { app:this.app });
        container.createFrom(image.id, function (err, container) {
          if (err) {
            self.showError(err);
          } else {
            self.app.router.navigate(container.appURL(), true);
          }
        });
      }
    });
  }
});

module.exports.id = "GitCard";