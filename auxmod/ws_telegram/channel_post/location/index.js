let path = require('path');
require('colors');
module.exports = async function channelPostSticker(ctx){
	LOG_FUNC(arguments, __filename);
	ctx.reqInfo += '\nlocation'.cyan + ' ' + 'latitude '.yellow 
	+ String(ctx.channelPost.location.latitude).cyan 
	+ ' longitude '.yellow + String(ctx.channelPost.location.longitude).cyan;

	return ctx;
};
