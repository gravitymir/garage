let path = require('path');
module.exports = async function callbackQueryFromInline(ctx){
	LOG_FUNC(arguments, __filename);
	return await require(path.join(__dirname, ctx.callbackQuery.path))(ctx);
}