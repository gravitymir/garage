let path = require('path');
let ru_sentry = require(path.join(process.env.DIR, 'auxmod', 'ru_sentry'));

module.exports = async ctx => {
    
    let {str, keyboard} = ru_sentry(ctx.callbackQuery.data);
    
    await ctx.editMessageText(
        `<code>${str}</code>`,
		{
            disable_notification: true,
            disable_web_page_preview: true,
            parse_mode: 'HTML',
			reply_markup: {
					inline_keyboard: keyboard
				}
		}
    );
	return ctx;
}