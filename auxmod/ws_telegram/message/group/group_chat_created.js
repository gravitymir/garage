let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));
let inspect = require('util').inspect;
require('colors');

module.exports = async function group_chat_created(ctx){
  LOG_FUNC(arguments, __filename);
    
    if(ctx.from.id === ctx.owner){

      let chat = await ctx.getChat(ctx.chat.id);
      chat.from = ctx.from;
      chat.members_count = await ctx.getChatMembersCount(ctx.chat.id);
      chat.admins = await ctx.getChatAdministrators(ctx.chat.id);
      
      if(chat.photo){
        chat.photo_link = await ctx.telegram.getFileLink(chat.photo[Object.keys(chat.photo).pop()]);
      }

      chat.id = Db.Long.fromNumber(ctx.chat.id)

      let r = await Db.updateOne({
        collection: 'telegram_' + ctx.username + '_subscribers',
        _id: chat.id,
        update: {$set: await chat},
          opt: {upsert: true}
      });

      ctx.reply('Работа начата.');
      return ctx;
    }

    await ctx.leaveChat(ctx.chat.id);

    // {
    //     update_id: 416523660,
    //     message: {
    //       message_id: 6920,
    //       from: {
    //         id: 283404954,
    //         is_bot: false,
    //         first_name: 'Андрей',
    //         username: 'ssplast',
    //         language_code: 'ru'
    //       },
    //       chat: {
    //         id: -261770383,
    //         title: 'test',
    //         type: 'group',
    //         all_members_are_administrators: true
    //       },
    //       date: 1576274966,
    //       group_chat_created: true
    //     }
    //   }

    return ctx;
}