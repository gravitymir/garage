const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = function equipment_pin_in(ctx){
    LOG_FUNC(arguments, __filename);
    let M = ub_gpio.gpio_obj();
    let [eq_name, pin] = ctx.data.split('&');

    let message = `${eq_name} ${pin} ${M.eq[eq_name].pins.in[pin].description}`+
    `\nпозиция: ${M.eq[eq_name].pins.in[pin].position}`+
    `\nзначение: ${M.eq[eq_name].pins.in[pin].value}`;
    let keyboard = [];

    if(ctx.from.id === ctx.owner){
        keyboard.push([{
            text: `${M.eq[eq_name].pins.in[pin].enable ? 'отключить': 'включить'}`,
            callback_data: `equipment_pin_in_enable_toggle/?${eq_name}&${pin}`
        }],[{
            text: `позиция в: 1`,
            callback_data: `equipment_pin_in_set_position/?${eq_name}&${pin}&1`
        }],[{
            text: `позиция в: 0`,
            callback_data: `equipment_pin_in_set_position/?${eq_name}&${pin}&0`
        }],[{
            text: `значение в: 1`,
            callback_data: `equipment_pin_in_set_value/?${eq_name}&${pin}&1`
        }],[{
            text: `значение в: 0`,
            callback_data: `equipment_pin_in_set_value/?${eq_name}&${pin}&0`
        }],[{
            text: `обнвить 🔄`,
            callback_data: `equipment_pin_in/?${eq_name}&${pin}`
        }],[{
            text: `⬅️ назад`,
            callback_data: `equipment_pins_in_list/?${eq_name}`
        }]);
    }else{
        keyboard.push([{
            text: `${M.eq[eq_name].pins.in[pin].enable ? 'отключить 🔒': 'включить 🔒'}`,
            callback_data: `equipment_pin_in_enable_toggle/?${eq_name}&${pin}`
        }],[{
            text: `позиция в: 1 🔒`,
            callback_data: `equipment_pin_in_set_position/?${eq_name}&${pin}&1`
        }],[{
            text: `позиция в: 0 🔒`,
            callback_data: `equipment_pin_in_set_position/?${eq_name}&${pin}&0`
        }],[{
            text: `значение в: 1 🔒`,
            callback_data: `equipment_pin_in_set_value/?${eq_name}&${pin}&1`
        }],[{
            text: `значение в: 0 🔒`,
            callback_data: `equipment_pin_in_set_value/?${eq_name}&${pin}&0`
        }],[{
            text: `обнвить 🔄`,
            callback_data: `equipment_pin_in/?${eq_name}&${pin}`
        }],[{
            text: `⬅️ назад`,
            callback_data: `equipment_pins_in_list/?${eq_name}`
        }]);
    }

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
                    inline_keyboard: keyboard
                }
            }
        }
    }))
    


    return ctx;
}