const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
let f = require(path.join('..', 'equipment'));
module.exports = function equipment_enable(ctx){
    LOG_FUNC(arguments, __filename);
    let M = ub_gpio.gpio_obj();
    let [eq_name, on_off] = ctx.data.split('&');

    if(ctx.from.id === ctx.owner){
        if(ub_gpio.get_eq_eq_name_enable(eq_name) && on_off === 'off'){
            ub_gpio.set_eq_eq_name_enable(eq_name, false);
            ub_gpio.set_eq_eq_name_armed(eq_name, false);
        }else if(!ub_gpio.get_eq_eq_name_enable(eq_name) && on_off === 'on'){
            ub_gpio.set_eq_eq_name_enable(eq_name, true);
        }else{
            ctx.send(JSON.stringify({
                telegram: {
                    type: 'answerCbQuery',
                    callback_query_id: ctx.id,
                    text: `команда дублирует состояние, откзано.`,
                    show_alert: false
                }
            }))
        }
    }else{
        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.id,
                text: `Доступ ограничен 🔒`,
                show_alert: false
            }
        }))
    }
    

    ctx.data = eq_name;

    return f(ctx);
}