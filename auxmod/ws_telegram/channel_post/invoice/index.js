let path = require('path');
require('colors');
module.exports = async function channelPostSticker(ctx){
    LOG_FUNC(arguments, __filename);
    let link = await ctx.telegram.getFileLink(ctx.channelPost.invoice);
	ctx.reqInfo += '\ninvoice'.cyan + ' ' + link;
    return ctx;
};