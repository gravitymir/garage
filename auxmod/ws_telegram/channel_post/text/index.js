let path = require('path');
require('colors');
module.exports = async function channelPostText(ctx){
	LOG_FUNC(arguments, __filename);
	ctx.reqInfo += ' text '.yellow + ctx.channelPost.text;
	return ctx;
}