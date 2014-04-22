var BaseView = require('./base_view');
var Super = BaseView.prototype;
var utils = require('../utils');
var _ = require('underscore');

module.exports = BaseView.extend({
  className: 'popover fade bottom',
  events: {
    'click' : 'stopPropagation',
    'click .close' : 'hide',
    'submit form'  : 'submitRunOption',
    'change input[type=text]' : 'updateRunOption',
    'keyup input'             : 'keyupUpdateRunOption',
    'click .toggle-group label' : 'toggleOutputViews',
    'change input[type=radio]'  : 'updateOutputFormat'
  },
  postInitialize: function () {
    this.keyupUpdateRunOption = _.debounce(this.keyupUpdateRunOption.bind(this), 150);
  },
  postHydrate: function () {
    this.boundHide = this.hide.bind(this);
  },
  keyupUpdateRunOption: function (evt) {
    if (this.valueChanged($(evt.currentTarget))) {
      this.updateRunOption.apply(this, arguments);
    }
  },
  valueChanged: function ($input) {
    var modelValue = this.model.get($input.attr('name'));
    var inputValue = $input.val().trim();
    return modelValue !== inputValue;
  },
  hidden: function () {
    return !this.$el.hasClass('in');
  },
  show: function () {
    this.$el.addClass('in');
    this.trigger('show');
    setTimeout(function () {
      $(document).once('click', this.boundHide);
    }.bind(this), 0);
  },
  hide: function () {
    this.$el.removeClass('in');
    this.trigger('hide');
    $(document).off('click', this.boundHide);
  },
  updateRunOption: function (evt) {
    var $input = $(evt.currentTarget);
    var data = {};
    data[$input.attr('name')] = $input.val().trim();
    console.log(data);
    var opts = utils.cbOpts(callback, this);
    opts.patch = true;
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
    var opts = utils.cbOpts(callback, this);
    opts.patch = true;
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
  },
  updateOutputFormat: function (evt) {
    var $input = $(evt.currentTarget);
    var output_format = $input.val() || null;
    var opts = utils.cbOpts(this.showIfError, this);
    opts.patch = true;
    this.model.save({output_format:output_format}, opts);
  },
  remove: function () {
    $(document).off('click', this.boundHide);
    Super.remove.call(this);
  }
});

module.exports.id = "RunPopover";
