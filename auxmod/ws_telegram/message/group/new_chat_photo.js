module.exports = async function groupNewChatPhoto(ctx){
    LOG_FUNC(arguments, __filename);
    ctx.requestInfo.new_chat_photo = String(ctx.message.new_chat_photo).cyan;
  //   String(ctx.message.new_chat_participant.first_name).yellow + ' ' +
  //   String(ctx.message.new_chat_participant.username).yellow;
    
  //   let p = ctx.from.first_name;
  //   p += ctx.from.last_name ? ' ' +ctx.from.last_name: '';
  //   p += ctx.from.username ? ' @' + ctx.from.username + ' ': '';
    
  //   if(ctx.bot.id == ctx.message.new_chat_participant.id){
  //   	await ctx.reply(ctx.skin + 'Благодарю за приглашение 👍🏻\n' + p);
  //   	return ctx;
  //   }
  //   if(ctx.message.new_chat_participant.is_bot){
  //   	await ctx.reply(ctx.skin + 'Что же этот бот умеет, чего не умею Я!'+
  //   		'\nЕще и имя странное кокое-то ' + ctx.message.new_chat_participant.first_name);
  //   	return ctx;
  //   }
    
  //   let personName = ctx.message.new_chat_participant.username ? ' @' + ctx.message.new_chat_participant.username: '';

    await ctx.reply('Новая картинка, это хорошо!');
    return ctx;
};
