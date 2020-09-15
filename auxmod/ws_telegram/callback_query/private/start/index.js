const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));

module.exports = function updateMessagePrivateTextComand(ctx){
    LOG_FUNC(arguments, __filename);

    let facility = ub_gpio.EQ.facility;

    let keyboard = [];

    // if(Object.keys(M.option.public_pins.out)
    // .filter(pin => M.option.public_pins.out[pin].access).length){
    //     keyboard.push([{
    //         text: `Публично ➡`,
    //         callback_data: `public/`
    //     }])
    // }

    keyboard.push([{
        text: 'Общее ➡',
        callback_data: `general_function/`
    }])

    let message = 'Объекты и оборудование';

    Object.keys(facility).forEach(eq_name => {
        keyboard.push([{
            text: `Объект ${eq_name} ➡`,
            callback_data: `equipment/?${eq_name}`
        }]);
    });

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

    return ctx;
};