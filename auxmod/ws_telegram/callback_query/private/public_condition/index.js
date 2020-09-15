const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = function public_condition(ctx){
    LOG_FUNC(arguments, __filename);

    let M = ub_gpio.gpio_obj();
    let message = 'Состояние оборудования: ';

    Object.keys(M.option.condition).forEach(key => {
        message += `\n${key}: ${M.option.condition[key]}`
    });

    ctx.send(JSON.stringify({
        telegram: {
            type: 'editMessageText',
            chat_id: ctx.message.chat.id,
            message_id: ctx.message.message_id,
            inline_message_id: null,
            text: `<code>${message}</code>`,
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