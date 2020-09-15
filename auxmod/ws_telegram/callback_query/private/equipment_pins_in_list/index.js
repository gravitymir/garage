const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = function equipment_pins_in_list(ctx){
    LOG_FUNC(arguments, __filename);

    let M = ub_gpio.gpio_obj();
    let eq_name = ctx.data;
    let keyboard = [];

    Object.keys(M.eq[eq_name].pins.in).forEach(pin => {
        keyboard.push([{
            text: `${pin}: ${M.eq[eq_name].pins.in[pin].description} ➡`,
            callback_data: `equipment_pin_in/?${eq_name}&${pin}`
        }]);
    });

    keyboard.push([{
        text: `⬅️ назад`,
        callback_data: `equipment/?${eq_name}`
    }]);

    ctx.send(JSON.stringify({
        telegram: {
            type: 'editMessageText',
            chat_id: ctx.message.chat.id,
            message_id: ctx.message.message_id,
            inline_message_id: null,
            text: `<code>Сенсоры объекта ${eq_name}</code>`,
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
};