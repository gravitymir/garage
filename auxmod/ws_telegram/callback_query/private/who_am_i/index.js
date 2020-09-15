module.exports = function who_am_i(ctx){
    LOG_FUNC(arguments, __filename);

    let message = 
    `Идн: ${ctx.from.id}`+
    `\nБот: ${ctx.from.is_bot ? 'да': 'нет'}`+
    `\nИмя: ${ctx.from.first_name ? ctx.from.first_name: '-'}`+
    `\nФам: ${ctx.from.last_name ? ctx.from.first_name: '-'}`+
    `\nНик: ${ctx.from.username ? '@' + ctx.from.username: '- ❗️❕❗️'}`+
    `\nЯзык: ${ctx.from.language_code}`;



    ctx.send(JSON.stringify({
        telegram: {
            type: 'editMessageText',
            chat_id: ctx.message.chat.id,
            message_id: ctx.message.message_id,
            inline_message_id: null,
            text: `<code>Аккаунт в Telegram\n${message}</code>`,
            opt: {
                disable_notification: false,
                disable_web_page_preview: true,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[{
                        text: `⬅️ назад`,
                        callback_data: `public/`
                    }]]
                }
            }
        }
    }))

    return ctx;
};