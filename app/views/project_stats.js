var BaseView = require('./base_view');

module.exports = BaseView.extend({
	tagName: 'ul',
	className: 'stats nolist'
});

module.exports.id = 'ProjectStats';
