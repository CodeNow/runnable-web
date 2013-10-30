var BaseView = require('./base_view');
var utils = require('../utils');

module.exports = BaseView.extend({
  tagName: 'button',
  className: 'btn green run-options',
  events: {
    'click' : 'togglePopover',
  },
  postHydrate: function () {
    this.closePopoverBound = this.closePopover.bind(this);
  },
  postRender: function () {
    // the popover makes this view kind of messy..
    this.$el.popover({
      title: '<button type="button" class="close">×</button><h4>Run Options</h4>',
      content: this.$('.content-template').html(),
      html: true,
      placement: 'bottom'
    });
    this.$el.on('show.bs.popover', this.updatePopover.bind(this));
    this.$el.on('shown.bs.popover', this.attachPopoverEvents.bind(this));
    this.$el.on('hide.bs.popover', this.removePopoverEvents.bind(this));
  },
  updatePopover: function () {
    var $popover = this.getPopover();
    if ($popover) {
      $popover['[name="start_cmd"]'].val(this.model.get('start_cmd'));
      $popover['[name="build_cmd"]'].val(this.model.get('build_cmd'));
    }
  },
  attachPopoverEvents: function (evt) {
    var $popover = this.getPopover();
    if ($popover) {
      $popover.find('input').on('change', this.updateRunOption.bind(this));
      $popover.find('form').on('submit', this.submitRunOption.bind(this));
      $popover.find('.close').on('click', this.closePopover.bind(this));
      //click document dismiss
      // $(document).on('click', this.closePopoverBound);
      $popover.on('click', this.stopPropagation);
    }
  },
  removePopoverEvents: function (evt) {
    var $popover = this.getPopover();
    this.$el.off('show.bs.popover');
    this.$el.off('shown.bs.popover');
    this.$el.off('hide.bs.popover');
    if ($popover) {
      $popover.find('input').off('change');
      $popover.find('form').off('submit');
      $popover.find('.close').off('click');
      //click document dismiss
      // $(document).off('click', this.closePopoverBound);
      $popover.off('click', this.stopPropagation);
    }
  },
  remove: function () {
    this.removePopoverEvents();
  },
  getPopover: function () {
    var $popover = this.$el.next();
    return $popover.hasClass('popover') ? $popover : null;
  },
  togglePopover: function (evt) {
    this.$el.toggleClass('active');
  },
  closePopover: function (evt) {
    if (evt && evt.currentTarget === this.el) return;
    this.$el
      .popover('hide')
      .removeClass('active');
  },
  updateRunOption: function (evt) {
    var $input = $(evt.currentTarget);
    var data = {};
    data[$input.attr('name')] = $input.val()
    console.log(data);
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
    console.log(data);
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
      var showTime = 1000;
      $save.fadeIn(function () {
        setTimeout($save.fadeOut.bind($save), showTime);
      });
    });
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
  }
});

module.exports.id = "RunOptions";
