require('colors');
let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));

module.exports = async function groupLeftChatMember(ctx){
    LOG_FUNC(arguments, __filename);
	  ctx.reqInfo += ' ' + String(ctx.message.left_chat_member.id).cyan + ' ' +
    String(ctx.message.left_chat_member.first_name).white + '  ' +
    String(ctx.message.left_chat_member.username).inverse;

    
    if(ctx.id == ctx.message.left_chat_member.id){

      let result = await Db.deleteOne({
          collection: 'telegram_' + ctx.username + '_subscribers',
          _id: Db.Long.fromNumber(ctx.chat.id)
      });

      ctx.reqInfo += ' удалён из группы'.red;
      console.log(result);
      console.log(Db.Long.fromNumber(ctx.chat.id));
      console.log(ctx.chat.id);
      return ctx;
    }

    return ctx;
    if(ctx.message.left_chat_member.is_bot){
    	await ctx.reply('До свидания ' + ctx.message.left_chat_member.first_name + ' 👋🏻');
    	return ctx;
    }
    let personName = ctx.message.left_chat_member.username ? ' @' + ctx.message.left_chat_member.username: '';
    // await ctx.reply('Надеюсь ещё увидимся ' +
    // 	ctx.message.left_chat_member.first_name +
		// personName + ' 👍🏻\n');
    return ctx;
};