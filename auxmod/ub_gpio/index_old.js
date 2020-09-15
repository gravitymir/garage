const path = require('path');
const Gpio = require('onoff').Gpio;
const moment = require('moment');
moment.locale('ru');
require('colors');
const send = require(path.join(global.DIR, 'auxmod', 'ws_socket'));
//console.log('--------------------');
//console.log(moment(moment().unix() * 1000).format('YYYY. M.DD HH: M:ss'));
//console.log(moment(1588305325).format('YYYY. M.DD HH: M:ss'));
//console.log('--------------------');

const convert = {
    3: 2, 5: 3, 7: 4, 8: 14, 10: 15, 11: 17, 12: 18, 13: 27,
    15: 22, 16: 23, 18: 24, 19: 10, 21: 9, 22: 25, 23: 11,
    24: 8, 26: 7, 27: 0, 28: 1, 29: 5, 31: 6, 32: 12,
    33: 13, 35: 19, 36: 16, 37: 26, 38: 20, 40: 21
};

const M = {
    option: {
        main_chat_id: -1001452183757,
        condition: '',//
        public_pins: {
            out: {
                14: {
                    access: true,
                    description: 'Фонарь #1',
                    event_on_desc: 'Фонарь светит',
                    event_off_desc: 'Фонарь отключён',
                    delay_time: 60000,
                    value: 0
                }
            }
        }
    },
    eq: {
        '211': {
            enable: true,//флаг включённости обьекта под охрану
            armed: false,//флаг состояния обьекта под охраной или нет
            telegram: {
                alarm_chat_id: -366271163,//-345034533,
                event_chat_id: -366271163,//-345034533,
                stdout_chat_id: -366271163//-345034533
            },
            users: [{
                id: 283404954,
                is_bot: false,
                first_name: 'Андрей',
                username: 'ssplast',
                language_code: 'ru'
            }],
            pins: {
                out: {
                    14: {
                        access: true,
                        description: 'авар. освещ.',
                        event_on_desc: 'on',
                        event_off_desc: 'off'
                    }
                },
                in: {
                    3: {
                        enable: true,
                        description: 'сенс. движ.',
                        event_on_desc: 'движение',
                        event_off_desc: 'движение окончено',
                        delay_time: 60000,
                    },
                    5: {
                        enable: true,
                        description: 'дверь',
                        event_on_desc: 'открытие двери',
                        event_off_desc: 'закрытие двери',
                        delay_time: 5000,
                    },
                    7: {
                        enable: true,
                        description: 'флаг эл. замка',
                        event_on_desc: 'эл. замка открыт',
                        event_off_desc: 'эл. замка закрыт',
                        delay_time: 0,
                    },
                    8: {
                        enable: true,
                        description: 'ворота',
                        event_on_desc: 'ворота открыты',
                        event_off_desc: 'ворота закрыты',
                        delay_time: 3000,
                    }
                }
            }
        },
        '212': {
            enable: true,//флаг включённости обьекта под охрану
            armed: false,//флаг состояния обьекта под охраной или нет
            telegram: {
                alarm_chat_id: -493180402,//-345034533,
                event_chat_id: -493180402,//-345034533,
                stdout_chat_id: -493180402//-345034533
            },
            users: [{
                id: 283404954,
                is_bot: false,
                first_name: 'Андрей',
                username: 'ssplast',
                language_code: 'ru'
            }],
            funcs : {
                electric_lock_switch: {
                    description: 'эл. замок',   
                    callback_data_path: '',
                    position: 1,
                    cycle_position: 1,
                    cycle_position_desc: 'движение',
                    intermediate_cycle_desc: 'движение',
                    intermediate_value_cycle_desc: 'движение',
                    position_off_desc: 'движение окончено',
                    delay_time: 60000,
                }
            },
            pins: {
                out: {
                    18: {
                        access: true,
                        description: 'открыть эл замок',
                        event_on_desc: 'активно',
                        event_off_desc: '0'
                    },
                    19: {
                        access: true,
                        description: 'закрыть эл замок',
                        event_on_desc: 'активно',
                        event_off_desc: '0'
                    }
                },
                in: {
                    12: {
                        enable: true,
                        description: 'сенс. движ.',
                        event_on_desc: 'движение',
                        event_off_desc: 'движение окончено',
                        delay_time: 60000,
                    },
                    13: {
                        enable: true,
                        description: 'дверь',
                        event_on_desc: 'открытие двери',
                        event_off_desc: 'закрытие двери',
                        delay_time: 5000,
                    },
                    15: {
                        enable: true,
                        description: 'флаг эл. замка',
                        event_on_desc: 'эл. замка открыт',
                        event_off_desc: 'эл. замка закрыт',
                        delay_time: 0,
                    },
                    16: {
                        enable: true,
                        description: 'ворота',
                        event_on_desc: 'ворота открыты',
                        event_off_desc: 'ворота закрыты',
                        delay_time: 3000,
                    }
                }
            }
        }
    }
}


//inform, notify
let inform = ({obj_name, pin, event}) => {

    let t = Number(moment().format('HH'));    

    if(M.eq[obj_name].armed || !(t > 8 && t < 21)){
        send(JSON.stringify({
            telegram: {
                type: 'sendMessage',
                chat_id: M.option.main_chat_id,
                text: `<code>${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}</code>`,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'
                }
            }
        }))

        send(JSON.stringify({
            telegram: {
                type: 'sendMessage',
                chat_id: M.eq[obj_name].telegram.event_chat_id,
                text: `<code>${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}</code>`,
                opt: {
                    disable_notification: false,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'//,
                  //   reply_markup: {
                  //       inline_keyboard: [
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }],
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }]
                  //       ]
                  //   }
                }
            }
        }))
    }else{
        send(JSON.stringify({
            telegram: {
                type: 'sendMessage',
                chat_id: M.option.main_chat_id,
                text: `<code>${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}</code>`,
                opt: {
                    disable_notification: true,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'//,
                  //   reply_markup: {
                  //       inline_keyboard: [
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }],
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }]
                  //       ]
                  //   }
                }
            }
        }))

        send(JSON.stringify({
            telegram: {
                type: 'sendMessage',
                chat_id: M.eq[obj_name].telegram.event_chat_id,
                text: `<code>${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}</code>`,
                opt: {
                    disable_notification: true,
                    disable_web_page_preview: true,
                    parse_mode: 'HTML'//,
                  //   reply_markup: {
                  //       inline_keyboard: [
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }],
                  //           [{
                  //               text: '123', callback_data: 'asd'
                  //           }]
                  //       ]
                  //   }
                }
            }
        })
        )
    }
}

let extitation = ({obj_name, pin, val}) => {
    if(M.eq[obj_name].pins[pin].last_extitation_time + M.eq[obj_name].pins[pin].delay_time <= moment().unix() * 1000&&
    M.eq[obj_name].pins[pin].position === 0){
        M.eq[obj_name].pins[pin].count++;
        M.eq[obj_name].pins[pin].last_extitation_time = moment().unix() * 1000;
        M.eq[obj_name].pins[pin].position = val;
        console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'on '.black.bgBrightCyan}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].event_on_desc.red}`);
        inform({obj_name: obj_name, pin: pin, event: 'on'});
    }else{
        console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'on '.black.bgBrightWhite}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].event_on_desc.red}`);
    }
}

let rollback = ({obj_name, pin, val}) => {
    if(M.eq[obj_name].pins[pin].position === 1){
        M.eq[obj_name].pins[pin].count++;
        M.eq[obj_name].pins[pin].last_rollback_time = moment().unix() * 1000;
        M.eq[obj_name].pins[pin].position = val;
        console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'off'.black.bgBrightCyan}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].event_off_desc.green}`);
        inform({obj_name: obj_name, pin: pin, event: 'off'});
    }else{
        console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'off'.black.bgBrightWhite}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].event_off_desc.green}`);
    }
}

let count = 0;


function main() {

    let str = moment().format('x');
    let time = Number(str);
    let time_h = moment(Number(str)).format('MM.DD HH:mm:ss SSS');
    let arr = [];
    Object.keys(M.eq)
    .filter(eq_name => M.eq[eq_name].enable)
    .forEach(eq_name => {
        Object.keys(M.eq[eq_name].pins.in)
        .filter(pin => M.eq[eq_name].pins.in[pin].enable)
        .forEach(pin => {
            let val = M.eq[eq_name].pins.in[pin].gpio.readSync();

            if(val !== M.eq[eq_name].pins.in[pin].value){
                if(val === 1 && M.eq[eq_name].pins.in[pin].additional_verification === 1){//extitation
                    if(M.eq[eq_name].pins.in[pin].last_extitation_time + M.eq[eq_name].pins.in[pin].delay_time < time &&
                        M.eq[eq_name].pins.in[pin].last_rollback_time + M.eq[eq_name].pins.in[pin].delay_time < time
                    ){
                        M.eq[eq_name].pins.in[pin].last_extitation_time = time;
                        M.eq[eq_name].pins.in[pin].count++;
                        M.eq[eq_name].pins.in[pin].position = val;
                        
                        console.log(`${time_h} `+
                        `${'on '.black.bgBrightGreen}: `+
                        `${M.eq[eq_name].pins.in[pin].obj_name} `+
                        `${pin} ${val} `+
                        `${M.eq[eq_name].pins.in[pin].event_on_desc}`);

                        inform({obj_name: M.eq[eq_name].pins.in[pin].obj_name, pin: pin, event: 'on'});
                    }else{
                        console.log(`${time_h} `+
                        `${'on '}: `+
                        `${M.eq[eq_name].pins.in[pin].obj_name} `+
                        `${pin} ${val} `+
                        `${M.eq[eq_name].pins.in[pin].event_on_desc}`);
                    }
                }else if(M.eq[eq_name].pins.in[pin].additional_verification === 1){//rollback
                    if(M.eq[eq_name].pins.in[pin].position !== val){
                        M.eq[eq_name].pins.in[pin].last_rollback_time = time;
                        M.eq[eq_name].pins.in[pin].position = val;

                        console.log(`${time_h} `+
                        `${'off'.black.bgBrightGreen}: `+
                        `${M.eq[eq_name].pins.in[pin].obj_name} `+
                        `${pin} ${val} `+
                        `${M.eq[eq_name].pins.in[pin].event_off_desc}`);
                        inform({obj_name: M.eq[eq_name].pins.in[pin].obj_name, pin: pin, event: 'off'});
                    }else{
                        console.log(`${time_h} `+
                        `${'off'}: `+
                        `${M.eq[eq_name].pins.in[pin].obj_name} `+
                        `${pin} ${val} `+
                        `${M.eq[eq_name].pins.in[pin].event_off_desc}`);
                    }
                }
                if(M.eq[eq_name].pins.in[pin].additional_verification === 0){
                    M.eq[eq_name].pins.in[pin].additional_verification = 1;
                }else{
                    M.eq[eq_name].pins.in[pin].additional_verification = 0;
                    M.eq[eq_name].pins.in[pin].value = val;
                }
                
            }

            str += ` ${M.eq[eq_name].pins.in[pin].value}`;
            //arr.push(pin);
        })
    });
    process.stdout.write(`${count++} ${str}\r`)
    setTimeout(main, null);
}


// function main(pin_arr) {

//     let str = moment().format('x');
//     let time = Number(str);
//     let time_h = moment(Number(str)).format('MM.DD HH:mm:ss SSS');
//     let arr = [];
//     pin_arr.forEach(pin => {
//         let val = pin.gpio.readSync();

//         if(val !== pin.value){
//             if(val === 1){//extitation
//                 if(pin.last_extitation_time + pin.delay_time < time &&
//                 pin.last_rollback_time + pin.delay_time < time
//                 ){
//                     pin.last_extitation_time = time;
//                     pin.count++;
//                     pin.position = val;
                    
//                     console.log(`${time_h} `+
//                     `${'on '.black.bgBrightGreen}: `+
//                     `${pin.obj_name} `+
//                     `${pin.pin} ${val} `+
//                     `${pin.event_on_desc}`);

//                     inform({obj_name: pin.obj_name, pin: pin.pin, event: 'on'});
//                 }else{
//                     console.log(`${time_h} `+
//                     `${'on '}: `+
//                     `${pin.obj_name} `+
//                     `${pin.pin} ${val} `+
//                     `${pin.event_on_desc}`);
//                 }
//             }else{//rollback
//                 if(pin.position !== val){
//                     pin.last_rollback_time = time;
//                     pin.position = val;

//                     console.log(`${time_h} `+
//                     `${'off'.black.bgBrightGreen}: `+
//                     `${pin.obj_name} `+
//                     `${pin.pin} ${val} `+
//                     `${pin.event_off_desc}`);
//                     inform({obj_name: pin.obj_name, pin: pin.pin, event: 'off'});
//                 }else{
//                     console.log(`${time_h} `+
//                     `${'off'}: `+
//                     `${pin.obj_name} `+
//                     `${pin.pin} ${val} `+
//                     `${pin.event_off_desc}`);
//                 }
//             }
//             pin.value = val;
//         }

//         str += ` ${pin.value}`;
//         arr.push(pin);
//     });
//     process.stdout.write(`${count++} ${str}\r`)
//     setTimeout(main, null, arr);
// }

//let pin_arr = [];

let init = function(){
    Object.keys(M.eq)
    .filter(name => name != 'option' && M.eq[name].enable)
    .forEach(obj_name => {
        Object.keys(M.eq[obj_name].pins.in).forEach(pin => {
            let obj = {
                pin: pin,
                obj_name: obj_name,
                gpio: new Gpio(convert[pin], 'in'),
                last_extitation_time: Number(moment().format('x')) - M.eq[obj_name].pins.in[pin].delay_time,
                last_rollback_time: Number(moment().format('x')) - M.eq[obj_name].pins.in[pin].delay_time,
                count: M.eq[obj_name].pins.in[pin].count || 0,
                additional_verification: 0
            }
            obj.value = obj.position = obj.gpio.readSync();
            M.eq[obj_name].pins.in[pin] = Object.assign(M.eq[obj_name].pins.in[pin], obj);
            //pin_arr.push(Object.assign(M.eq[obj_name].pins.in[pin], obj));
        })
    });
    //main(pin_arr);
    main();
}
init();

init = null


let position_map = `<code>_____________________________________
        |----|   1  3.3V   1 2   5V
        |----|   2   (2)   3 4   5V
________|----|   3   (3)   5 6   GRD
        |----|   4   (4)   7 8   (14)
  5V 4A |----|   5   GRD   9 10  (15)
________|----|   6  (17)  11 12  (18)
        |----|   7  (27)  13 14  GRD
        |----|   8  (22)  15 16  (23)
  HDMI  |----|   9  3.3V  17 18  (24)
        |----|  10  (10)  19 20  GRD
________|----|  11   (9)  21 22  (25)
        |----|  12  (11)  23 24  (8)
        |----|  13   GRD  25 26  (7)
        |----|  14   (0)  27 28  (1)
        |----|  15   (5)  29 30  GRD
        |----|  16   (6)  31 32  (12)
        |----|  17  (13)  33 34  GRD
        |----|  18  (19)  35 36  (16)
        |----|  19  (26)  37 38  (20)
        |----|  20   GRD  39 40  (21)
_____________________________________
             |           |           |
     RJ45    |    USB    |    USB    |
_____________|___________|___________|
</code>`;


let ooop = `
----------  3.3V   1  2  5V -----------
движение     211   3  4  5V -----------
дверь        211   5  6  GND ----------
флаг засов   211   7  8  211 ворота
-----------  GND   9 10  211 упр засов 1
упр засов 2  211  11 12  212 движение
дверь        212  13 14  GND ----------
флаг засов   212  15 16  212 ворота
----------- 3.3V  17 18  212 упр засов 1
упр засов 2  212  19 20  GND -----------


21 22
23 24
------------  GND   25 26
27 28
29 30  GND -----------
31 32
33 34  GND -----------
35 36
37 38
------------  GND   39 40`;

module.exports.gpio_obj = () => {
    return M;
}
module.exports.get_option_public_pins_out_pin_value = pin => {
    return M.option.public_pins.out[pin].value;
}
module.exports.set_option_public_pins_out_pin_value = (pin, value) => {
    M.option.public_pins.out[pin].value = value;
}

module.exports.get_eq_eq_name_enable = eq_name => {
    return M.eq[eq_name].enable;
}
module.exports.set_eq_eq_name_enable = (eq_name, value) => {
    M.eq[eq_name].enable = value;
}

module.exports.get_eq_eq_name_armed = eq_name => {
    return M.eq[eq_name].armed;
}
module.exports.set_eq_eq_name_armed = (eq_name, value) => {
    M.eq[eq_name].armed = value;
}

