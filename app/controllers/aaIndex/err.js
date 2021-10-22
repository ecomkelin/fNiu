exports.usError = function(req, res, info) {
	res.render('./wrongPage', {
		title: '500-15 Page',
		info: info
	});
}