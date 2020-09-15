let path = require('path');
const fs = require('fs');
const callback_data_paths = fs.readdirSync(path.join(__dirname, 'private'), 'utf8').map(el => {
    return el.split('.')[0] + '/';
});
require('colors');

module.exports = function updateMessageCallbackQuery(ctx){
	LOG_FUNC(arguments, __filename);
	
	// if(ctx.message && ctx.message.chat){
	// 	ctx.chat = ctx.message.chat;
	// }

	// if(ctx.chat){
	// 	if(ctx.chat.type === 'supergroup'){
	// 		ctx.chat.type = 'group';
	//   	}
	// }else{
	// 	ctx.chat = {
	// 		type: 'from_inline_message'
	// 	}
	// }
	
	[ctx.path, ctx.data] = ctx.data.split('?');

	ctx.reqInfo += `\n${ctx.message.chat.type.green} `+
	`${String(ctx.message.chat.id).bgWhite.black} `+
	`${String(ctx.message.chat.first_name).bgWhite.black} `+
	`${String(ctx.message.chat.username).bgWhite.black}`+
	`\n ${'path'.green} ${String(ctx.path).cyan}`+
	`${ctx.data ? '\n data '.green + String(ctx.data).cyan: ''}`;

	//console.log(callback_data_paths, ctx.path, callback_data_paths.includes(ctx.path))
	if(callback_data_paths.includes(ctx.path)){
		return require(path.join(__dirname, ctx.message.chat.type, ctx.path))(ctx);
	}

	ctx.reqInfo += ' path отсутствует'.red;
	return ctx;

	
}