let path = require('path');
require('colors');
module.exports = async function channelPostSticker(ctx){
    LOG_FUNC(arguments, __filename);
    let link = await ctx.telegram.getFileLink(ctx.channelPost.contact);
	ctx.reqInfo += '\nContact'.cyan + ' ' + link;
    return ctx;
};

