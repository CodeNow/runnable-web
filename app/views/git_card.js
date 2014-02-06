var BaseView = require('./base_view');

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

    this.$('.dropdown').text(langVal);
  }
});

module.exports.id = "GitCard";
