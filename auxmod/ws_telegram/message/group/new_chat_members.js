require('colors');
let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));
let inspect = require('util').inspect;

module.exports = async function groupNewChatMember(ctx){
    LOG_FUNC(arguments, __filename);
    ctx.reqInfo += ' ' + String(ctx.message.new_chat_participant.id).cyan + ' ' +
    String(ctx.message.new_chat_participant.first_name).white + '  ' +
    String(ctx.message.new_chat_participant.username).inverse;
    
    if(ctx.id == ctx.message.new_chat_participant.id){//этого бота пригласили
      ctx.reqInfo += ' приглашон'.green;

      let chat = await ctx.getChat(ctx.chat.id);
      chat.from = ctx.from;
      chat.members_count = await ctx.getChatMembersCount(ctx.chat.id);
      chat.admins = await ctx.getChatAdministrators(ctx.chat.id);
      
      if(chat.photo){
        chat.photo_link = await ctx.telegram.getFileLink(chat.photo[Object.keys(chat.photo).pop()]);
      }

      ctx.chat.id = Db.Long.fromNumber(ctx.chat.id)

      if(ctx.from.id === ctx.owner){
        let r = await Db.updateOne({
          collection: 'telegram_' + ctx.username + '_subscribers',
          _id: ctx.chat.id,
          update: {$set: chat},
            opt: {upsert: true}
        });

        ctx.reply('Работа начата.');

        await ctx.telegram.sendMessage(ctx.owner_chat_log,
            inspect(chat, {depth: Infinity })
        );
        
        return ctx;
      }
      //пригласил не владелец

      if(chat.members_count < 5){
          await ctx.reply(`Участников чата < 5.\nУхожу 😔`);
          await ctx.leaveChat(ctx.chat.id);
          return ctx;
      }

      let mess = `Благодарю за приглашение ` +
      `${ctx.from.first_name ? ctx.from.first_name: ''}` +
      `${ctx.from.username ? ' ' + ctx.from.username: ''}\n\n` +
      `Работа начнётся после одоберения заявки.\n\n` +
      `Выша заявка:\n\n` +
      `${chat.title}\n` +
      `👥 ${chat.members_count}\n\n`+
      `Отправлена.`;

      let resp = await ctx.telegram.sendMessage(ctx.owner_chat_log,
          inspect(chat, {depth: Infinity }),{
            reply_markup: {
              inline_keyboard: [
                [{
                  text: '✅',
                  callback_data: `add_subscriber/?${chat.id}&add`
                },{
                  text: '❌',
                  callback_data: `add_subscriber/?${chat.id}&false`
                }]
              ]
            }
          }
      );

      if(chat.photo_link){
          await ctx.telegram.sendPhoto(chat.id,
              {
                  url: chat.photo_link,
                  filename: chat.title},
                  {
                  
                  caption: mess//,
                  //reply_markup: {
                  //  inline_keyboard: keyboard
                  //}
              }
          )
          return ctx;
      }

      ctx.reply(mess);

      return ctx;
    }

    if(ctx.message.new_chat_participant.is_bot){
    	// await ctx.reply('Что же этот бот умеет, чего не умею Я!'+
    	// 	'\nЕще и имя странное кокое-то ' + ctx.message.new_chat_participant.first_name);
    	return ctx;
    }
    
    let personName = ctx.message.new_chat_participant.username ? ' @' + ctx.message.new_chat_participant.username: '';

    // await ctx.reply('Приветствую ' +
    // 	ctx.message.new_chat_participant.first_name +
		// personName + ' 👋🏻\n');
    return ctx;
};

