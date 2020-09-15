const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
module.exports = function public_pin_out_toggle(ctx){
    let pin = ctx.data;

    if(ub_gpio.get_option_public_pins_out_pin_value){
        ub_gpio.set_option_public_pins_out_pin_value(pin, 0);

        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.id,
                text: `Отключено  🌙`,
                show_alert: false
            }
        }))
    }else{
        ub_gpio.set_option_public_pins_out_pin_value(pin, 1);

        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.id,
                text: `💡🔆🌟⭐️🌼⚡️`,
                show_alert: false
            }
        }))
    }
    return ctx;
}