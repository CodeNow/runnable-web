var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn green run-options',
  events: {
    'click'        : 'togglePopover',
  },
  postRender: function () {
    // the popover makes this view kind of message logic wise..
    this.$el.popover({
      title: '<button type="button" class="close">×</button><h4>Run Options</h4>',
      content: this.$('.content-template').html(),
      html: true,
      placement: 'bottom'
    });
    this.$el.on('shown.bs.popover', this.attachPopoverEvents.bind(this));
    this.$el.on('hide.bs.popover', this.removePopoverEvents.bind(this));
  },
  attachPopoverEvents: function (evt) {
    var $popover = this.getPopover();
    if ($popover) {
      $popover.find('input').on('change', this.updateRunOption.bind(this));
      $popover.find('form').on('submit', this.submitRunOption.bind(this));
      $popover.find('.close').on('click', this.closePopover.bind(this));
    }
  },
  removePopoverEvents: function (evt) {
    var $popover = this.getPopover();
    if ($popover) {
      $popover.find('input').off('change');
      $popover.find('form').off('submit');
      $popover.find('.close').off('click');
    }
  },
  getPopover: function () {
    var $popover = this.$el.next();
    return $popover.hasClass('popover') ? $popover : null;
  },
  togglePopover: function () {
    this.$el.toggleClass('active');
  },
  closePopover: function () {
    this.$el
      .popover('hide')
      .removeClass('active');
  },
  updateRunOption: function (evt) {
    var $input = $(evt.currentTarget);
    var data = {};
    data[$input.attr('name')] = $input.val()
    var opts = utils.cbOpts(callback, this);
    this.model.save(data, opts);
    function callback (err) {
      if (!this.getPopover()) return;
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
    var opts = utils.cbOpts(callback, this);
    this.model.save(data, opts);
    function callback (err) {
      if (!this.getPopover()) return; // if popover has been closed
      if (err) {
        this.showError(err);
      }
      else {
        this.saveEffect($form.find('input'));
      }
    }
  },
  saveEffect: function ($inputs) {
    $inputs.each(function () {
      var $save = $(this).next();
      $save.addClass('in');
    }).on('focus',function(){
      var $save = $(this).next();
      $(this).next().removeClass('in');
    });
  }
});

module.exports.id = "RunOptions";
