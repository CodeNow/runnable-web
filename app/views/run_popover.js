var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom',
  events: {
    'click' : 'stopPropagation',
    'submit form'  : 'submitRunOption',
    'change input' : 'updateRunOption',
    'click .close' : 'hide'
  },
  hidden: function () {
    return !this.$el.hasClass('in');
  },
  show: function () {
    this.$el.addClass('in');
    this.trigger('show');
  },
  hide: function () {
    this.$el.removeClass('in');
    this.trigger('hide');
  },
  updateRunOption: function (evt) {
    var $input = $(evt.currentTarget);
    var data = {};
    data[$input.attr('name')] = $input.val();
    console.log(data);
    var opts = utils.cbOpts(callback, this);
    this.model.save(data, opts);
    function callback (err) {
      if (this.hidden()) return;
      if (err) {
        this.showError(err);
      }
      else {
        this.saveEffect($input);
      }
    }
  },
  submitRunOption: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var $form = $(evt.currentTarget);
    var data = $form.serializeObject();
    console.log(data);
    var opts = utils.cbOpts(callback, this);
    this.model.save(data, opts);
    function callback (err) {
      if (this.hidden()) return;
      if (err) {
        this.showError(err);
      }
      else {
        this.saveEffect($form.find('input'));
      }
    }
  },
  saveEffect: function ($inputs) {
    var self = this;
    $inputs.each(function () {
      var $input = $(this);
      self.showSave($input);
      $input.on('focus', self.focusInput.bind(self));
    });
  },
  focusInput: function (evt) {
    this.hideSave($(evt.currentTarget));
  },
  showSave: function ($input) {
    $input.siblings('.saved').addClass('in');
  },
  hideSave: function ($input) {
    $input.siblings('.saved').removeClass('in');
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "RunPopover";