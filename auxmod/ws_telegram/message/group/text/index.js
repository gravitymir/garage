let path = require('path');
let fs = require('fs');
let allTelegramCommand = fs.readdirSync(path.join(__dirname, 'commands'), 'utf8');

module.exports = async function updateMessageText(ctx){
    LOG_FUNC(arguments, __filename);
    // let f = await ctx.getChatMembersCount(ctx.chat.id);
    // console.log(f);
    // f = await ctx.getChatAdministrators(ctx.chat.id);
    // console.log(f);
    // f = await ctx.getChat(ctx.chat.id, ctx.from.id);
    // console.log(f);
    // f = await ctx.getChatMember(ctx.chat.id, ctx.from.id);
    // console.log(f);
    // ctx.reqInfo += ' ' + String(ctx.message.text);

    if (
        /^\/[a-zA-Z0-9_]+/.test(ctx.message.text) && 
        allTelegramCommand.indexOf(ctx.message.text.match(/[a-zA-Z0-9_]+/g)[0]) != -1
        ){
            return require(path.join(__dirname, 'commands', ctx.message.text.match(/[a-zA-Z0-9_]+/g)[0]))(ctx);
        }
    return ctx;
};
