let path = require('path');
require('colors');
module.exports = async function channelPostPhoto(ctx){
	LOG_FUNC(arguments, __filename);
	let link = await ctx.telegram.getFileLink(ctx.channelPost.photo.pop());
	ctx.reqInfo += '\nphoto'.cyan + ' ' + link;
	return ctx;
}