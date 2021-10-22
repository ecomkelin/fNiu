module.exports = function(app){
	require('./aderRouter')(app);

	require('./aaRouter')(app);
	require('./userRouter')(app);
	require('./pterRouter')(app);
	require('./cterRouter')(app);
	require('./usAjaxRouter')(app);
};