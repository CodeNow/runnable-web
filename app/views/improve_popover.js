var BaseView = require('./base_view');

module.exports = BaseView.extend({
  tagName: 'div',
  className: 'popover fade bottom',
  events: {
    'click' : 'stopPropagation',
    'click .close' : 'hide',
    'change select' : 'changeSelect',
    'submit form'  : 'submitFeedback'
  },
  postHydrate: function () {
    this.boundHide = this.hide.bind(this);
  },
  stopPropagation: function (evt) {
    evt.stopPropagation();
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
  changeSelect: function (evt) {
    var evtCurrentTarget = $(evt.currentTarget)[0];

    this.$('.dropdown')
      .addClass('in')
      .find('.selected')[0]
      .innerHTML = evtCurrentTarget.value;

    if (evtCurrentTarget.selectedIndex == 5) {
      this.$('textarea').prop('required',true);
    } else {
      this.$('textarea').prop('required',false);
    }
  },
  submitFeedback: function (evt) {
    evt.preventDefault();
    this.hide();

    var $improveBtn = this.$el.siblings('.silver');

    $improveBtn
      .addClass('thanks')
      .prop('disabled',true)
      .children('.btn-text')[0]
      .innerHTML = 'Feedback Received';

    // $.post("/campaigns/",)
  }
});

module.exports.id = "ImprovePopover";
