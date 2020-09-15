let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));
let inspect = require('util').inspect;
require('colors');

module.exports = async function migrate_from_chat_id(ctx){
    LOG_FUNC(arguments, __filename);

    await Db.deleteOne({
        collection: 'telegram_' + ctx.username + '_subscribers',
        _id: Db.Long.fromNumber(ctx.message.migrate_from_chat_id)
    });

    let chat = await ctx.getChat(ctx.chat.id);
      chat.from = ctx.from;
      chat.members_count = await ctx.getChatMembersCount(ctx.chat.id);
      chat.admins = await ctx.getChatAdministrators(ctx.chat.id);
      
    if(chat.photo){
        chat.photo_link = await ctx.telegram.getFileLink(chat.photo[Object.keys(chat.photo).pop()]);
    }

    chat.id = ctx.chat.id = Db.Long.fromNumber(ctx.chat.id);

    let result = await Db.updateOne({
        collection: 'telegram_' + ctx.username + '_subscribers',
        _id: ctx.chat.id,
        update: {$set: await chat},        
        opt: {upsert: true}
    });
    
    console.log(result.result);

    return ctx;
}