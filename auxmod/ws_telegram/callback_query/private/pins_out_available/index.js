const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = async function equipment_available(ctx){
    LOG_FUNC(arguments, __filename);
    let M = ub_gpio.gpio_obj();
    let keyboard = [];

    if(M.eq[ctx.data].users){
        Object.keys(M.eq[ctx.data].users).forEach(user => {
            if(user === ctx.from.id){
                
                Object.keys(M.eq[ctx.data].pins)
                .filter(pin => M.eq[ctx.data].pins[pin].in_out == 'out').forEach(pin => {
                    keyboard.push([{
                        text: `out ${pin}:    ${M.eq[ctx.data].pins[pin].value ? 1 : 0}`,
                        callback_data: 'pin_out_enable/?' + ctx.data + '&' + pin
                    }])
                });

            }
        })
    }

    if(keyboard.length){
        keyboard.push([{text: '⬅️', callback_data: `equipment/?${ctx.data}`}])
        
        ctx.send(JSON.stringify({
            telegram: {
                type: 'editMessageText',
                chat_id: ctx.message.chat.id,
                message_id: ctx.message.message_id,
                inline_message_id: null,
                text: `<code>Управляющие\nпины 1 / 0</code>`,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                }
            }
        }))
    }

    return ctx;
};