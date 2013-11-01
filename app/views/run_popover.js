var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom',
  events: {
    'click' : 'stopPropagation',
    'submit form'  : 'submitRunOption',
    'change input' : 'updateRunOption',
    'keyup input' : 'updateRunOption',
    'click .close' : 'hide',
    'click .toggle-group label' : 'toggleOutputViews'
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
    this.hideSave($input);
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
    var $inputs = $form.find('input');
    var data = $form.serializeObject();
    console.log(data);
    var opts = utils.cbOpts(callback, this);
    this.hideSave($inputs);
    this.model.save(data, opts);
    function callback (err) {
      if (this.hidden()) return;
      if (err) {
        this.showError(err);
      }
      else {
        this.saveEffect($inputs);
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
  showSave: function ($inputs) {
    $inputs.each(function () {
      var $input = $(this);
      $input.siblings('.saved').addClass('in');
    });
  },
  hideSave: function ($inputs) {
    $inputs.each(function () {
      var $input = $(this);
      $input.siblings('.saved').removeClass('in');
    });
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  },
  toggleOutputViews: function (evt) {
    $(evt.currentTarget)
      .addClass('active')
      .siblings()
      .removeClass('active');
  }
});

module.exports.id = "RunPopover";
