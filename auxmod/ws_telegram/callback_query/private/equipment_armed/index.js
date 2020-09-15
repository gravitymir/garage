const path = require('path');
const ub_gpio = require(path.join(global.DIR, 'auxmod', 'ub_gpio'));
let f = require(path.join('..', 'equipment'));
module.exports = function equipment_enable(ctx){
    LOG_FUNC(arguments, __filename);
    let M = ub_gpio.gpio_obj();
    
    let [eq_name, on_off] = ctx.data.split('&');

    let users = M.eq[eq_name].users.filter(arr => arr.id === ctx.from.id)

    if(!users.length){
        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.message.chat.id,
                text: `<code>Доступ ограничен 🔒</code>`,
                show_alert: false,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'
                }
            }
        }))
        return ctx;
    }

    if(!M.eq[eq_name].enable){
        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.message.chat.id,
                text: `<code>Объект ${eq_name} выключен ❗️`+
                `\nСенсоры програмно не учитываются`+
                `\nПостановка не возможна.</code>`,
                show_alert: true,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'
                }
            }
        }))

        M.eq[eq_name].armed = false;
        return ctx;
    }

    if(M.eq[eq_name].armed && on_off === 'off'){
        M.eq[eq_name].armed = false;
    }else if(!M.eq[eq_name].armed && on_off === 'on'){
        M.eq[eq_name].armed = true;
    }else{
        
        ctx.send(JSON.stringify({
            telegram: {
                type: 'answerCbQuery',
                callback_query_id: ctx.message.chat.id,
                text: `<code>⚠️ команда дублирует состояние, отказано.</code>`,
                show_alert: false,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'
                }
            }
        }))
        
    }

    ctx.data = eq_name;

    return f(ctx);
}
// module.exports = async function equipment_armed(ctx){

//     if(M.eq[ctx.callbackQuery.data].enable){
//         M.eq[ctx.callbackQuery.data].armed = !M.eq[ctx.callbackQuery.data].armed;
//     }else{
//         M.eq[ctx.callbackQuery.data].armed = false;
//         ctx.answerCbQuery(`Включите учитывать ${ctx.callbackQuery.data} обьект`, true)
//     }
    
//     return require(path.join('../', 'equipment'))(ctx);
// }