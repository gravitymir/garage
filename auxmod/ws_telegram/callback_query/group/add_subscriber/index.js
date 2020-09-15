let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));


module.exports = async ctx => {
    let [chat_id, add] = ctx.callbackQuery.data.split('&');

    if(add === 'add'){
        ctx.telegram.sendMessage(chat_id,
            'Заявка одобрена.\nРабота начата.'
        );
        let chat = await ctx.getChat(chat_id);
        chat.from = ctx.from;
        chat.members_count = await ctx.getChatMembersCount(chat_id);
        chat.admins = await ctx.getChatAdministrators(chat_id);
        
        if(chat.photo){
            chat.photo_link = await ctx.telegram.getFileLink(chat.photo[Object.keys(chat.photo).pop()]);
        }

        chat.id = chat_id = Db.Long.fromNumber(chat_id);

        let r = await Db.updateOne({
            collection: 'telegram_' + ctx.username + '_subscribers',
            _id: chat_id,
            update: {$set: chat},
              opt: {upsert: true}
          });

          console.log(r);

        return ctx;
    }

    ctx.telegram.sendMessage(chat_id,
        'В заявке отказано.\nК сожалению моя работа в даном чате не разрешена.'
    );
    ctx.telegram.leaveChat(chat_id);
	return ctx;
}