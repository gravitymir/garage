const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = function equipment(ctx){
    LOG_FUNC(arguments, __filename);
    
    let eq_name = ctx.data;
    let facility = ub_gpio.EQ.facility[eq_name];

    let eq_enable = facility.enable;
    let eq_armed = facility.armed;

    let keyboard = [];
    let message = `объект ${ctx.data}`+
    `\nвключён: ${eq_enable ? '✅': '⚠️'}`+
    `\nна охрану: ${eq_armed ? '✅': '⚠️'}`;

    if(ctx.message.chat.id === ctx.owner){
        keyboard.push([{
            text: `${eq_enable ? 'отключить': 'включить'}`,
            callback_data: `equipment_enable_toggle/?${eq_name}&${eq_enable ? 'off': 'on'}`
        }]);
    }else{
        keyboard.push([{
            text: `${eq_enable ? 'отключить 🔒': 'включить 🔒'}`,
            callback_data: `equipment_enable_toggle/?${eq_name}&${eq_enable ? 'off': 'on'}`
        }]);
    }
    
    let users = facility.users.filter(arr => arr.id === ctx.message.chat.id)

    if(users.length){
        keyboard.push([{
            text: `${eq_armed ? 'снять с охраны': eq_enable ? 'под охрану': 'под охрану 🔒'}`,
            callback_data: `equipment_armed/?${eq_name}&${eq_armed ? 'off': 'on'}`
        }]);
    }else{
        keyboard.push([{
            text: `${eq_armed ? 'снять с охраны 🔒': facility.enable ? 'под охрану 🔒': 'под охрану 🔒'}`,
            callback_data: `equipment_armed/?${eq_name}&${eq_armed ? 'off': 'on'}`
        }]);
    }
    
    let in_pins = Object.keys(facility.in_pins);
    let out_pins = Object.keys(facility.out_pins);

    let in_pins_enable_length = Object.keys(facility.in_pins).filter(pin => facility.in_pins[pin].enable).length;

    if(out_pins && out_pins.length){
        keyboard.push([{
            text: `функционал ${out_pins.length} ➡`,
            callback_data: `equipment_pins_out_list/?${eq_name}`
        }]);
    }

    if(in_pins && in_pins.length){
        keyboard.push([{
            text: `сенсоры ${in_pins_enable_length} из ${in_pins.length} ➡`,
            callback_data: `equipment_pins_in_list/?${eq_name}`
        }]);
    }

    keyboard.push([{
        text: `⬅️ назад`,
        callback_data: `start/`
    }]);
    
    ctx.send({
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
    })
    // ctx.editMessageText(message,
    //     {
    //         reply_markup: {
    //             inline_keyboard: keyboard
    //         },
    //         disable_notification: false,
    //         disable_web_page_preview: false,
    //         parse_mode: 'HTML'
    // });

    return ctx;
}