let path = require('path');
require('colors');
module.exports = async function channelPostSticker(ctx){
    LOG_FUNC(arguments, __filename);
    let link = await ctx.telegram.getFileLink(ctx.channelPost.voice);
	ctx.reqInfo += '\nvoice'.cyan + ' ' + link;
    return ctx;
};
