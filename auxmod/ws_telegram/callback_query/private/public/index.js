const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
let f = require(path.join('..', 'equipment'));
module.exports = function public(ctx){
    LOG_FUNC(arguments, __filename);

    let M = ub_gpio.gpio_obj();
    let keyboard = [];

    Object.keys(M.option.public_pins.out)
    .filter(pin => M.option.public_pins.out[pin].access)
    .forEach(pin => {
        //console.log(pin)
        
        keyboard.push([{
            text: `${M.option.public_pins.out[pin].description}`,
            callback_data: `public_pin_out_toggle/?${pin}`
        }])
    });

    keyboard.push([{
        text: `Кто я ❔ ➡`,
        callback_data: `who_am_i/`
    }],[{
        text: `Состояние ➡`,
        callback_data: `public_condition/`
    }],[{
        text: `⬅️ назад`,
        callback_data: `start/`
    }]);


    ctx.send(JSON.stringify({
        telegram: {
            type: 'editMessageText',
            chat_id: ctx.message.chat.id,
            message_id: ctx.message.message_id,
            inline_message_id: null,
            text: `<code>Публично доступное</code>`,
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

    return ctx;
}