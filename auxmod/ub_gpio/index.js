const path = require('path');
const Gpio = require('onoff').Gpio;
const moment = require('moment');
moment.locale('ru');
require('colors');
let aux_check = {};
let send_to_telegram = require(path.join(global.DIR, 'auxmod', 'ws_socket')).send;
//console.log('--------------------');
//console.log(moment(moment().unix() * 1000).format('YYYY. M.DD HH: M:ss'));
//console.log(moment(1588305325).format('YYYY. M.DD HH: M:ss'));
//console.log('--------------------');

// let convert_pins = {
//     3: 2, 5: 3, 7: 4, 8: 14, 10: 15, 11: 17, 12: 18, 13: 27,
//     15: 22, 16: 23, 18: 24, 19: 10, 21: 9, 22: 25, 23: 11,
//     24: 8, 26: 7, 27: 0, 28: 1, 29: 5, 31: 6, 32: 12,
//     33: 13, 35: 19, 36: 16, 37: 26, 38: 20, 40: 21
// }

// let all_pins = {

// }




class Pin{
    constructor(pin){

        this.num = pin.num,
        this.facility = pin.facility,
        this.desc = pin.desc
        this.on_desc = pin.on_desc
        this.off_desc = pin.off_desc
        
        // Object.entries(pin).forEach(([key, value]) => {
        //     this[key] = value;
        // });
        this.linux_num = this.pin_to_linux(this.num);
    }
}

Pin.prototype.pin_to_linux = num => {
    let linux_num = {
        3: 2, 5: 3, 7: 4, 8: 14, 10: 15, 11: 17, 12: 18, 13: 27,
        15: 22, 16: 23, 18: 24, 19: 10, 21: 9, 22: 25, 23: 11,
        24: 8, 26: 7, 27: 0, 28: 1, 29: 5, 31: 6, 32: 12,
        33: 13, 35: 19, 36: 16, 37: 26, 38: 20, 40: 21
    }[num];
    if(linux_num){
        return linux_num
    }
    throw new Error(`Пина ${num} нет в распиновке!`);
}

Pin.prototype.pin_from_linux = num => {
    let linux_num = {
        2: 3, 3: 5, 4: 7, 14: 8, 15: 10, 17: 11, 18: 12, 27: 13,
        22: 15, 23: 16, 24: 18, 10: 19, 9: 21, 25: 22, 11: 23,
        8: 24, 7: 26, 0: 27, 1: 28, 5: 29, 6: 31, 12: 32,
        13: 33, 19: 35, 16: 36, 26: 37, 20: 38, 21: 40
    }[num];
    if(linux_num){
        return linux_num
    }
    throw new Error(`Пина ${num} нет в распиновке!`);
}



class InPin extends Pin{
    constructor(pin){

    //console.log(pin);
        super(pin);

        this.delay = pin.delay;
        this.next_on_time = moment().unix();
        //if(this.delay){
            this.next_on_time = moment().unix();
            // this.next_extitation_time =
            // this.next_rollback_time = moment().unix();
        //}
        this.gpio = new Gpio(this.linux_num);
        this.read = () => {
            // if(this.num === 12){
            //     console.log(this.gpio.readSync())
            // }
            
            return this.gpio.readSync();
        }
        this.value = this.read();
        aux_check[this.num] = this.value;
        this.rollback = true;
    }

    check_change_value = () => {

        let time = moment().unix();
        let value = this.read();



        if(value !== this.value && aux_check[this.num] !== value){// && value !== this.aux_value){
            this.value = value;
            aux_check[this.num] = value;
            // console.log(`this.next_on_time: `, this.next_on_time);
            // console.log(`facility: `, this.facility);
            // console.log(`num: `, this.num);
            // console.log(`value: `, value);
            // console.log(`this.value: `, this.value);
            // console.log(`this.delay: `, this.delay);
            // console.log(`time: `, time);
            // console.log(`this.rollback: `, this.rollback);

            if(value){//extitation
                if(time > this.next_on_time){
                    this.next_on_time = time + this.delay;
                    this.rollback = true;

                    console.log(
                        `${this.facility}`+
                        ` ${this.num}`+
                        ` ${value}`+
                        ` ${this.on_desc}`.cyan
                        );
                    return true;
                }

                console.log(
                    `${this.facility}`+
                    ` ${this.num}`+
                    ` ${value}`+
                    ` ${this.on_desc}`
                    );
                return false;
            }else{//rollback
                if(this.rollback){
                    this.rollback = false;
                    console.log(
                        `${this.facility}`+
                        ` ${this.num}`+
                        ` ${value}`+
                        ` ${this.off_desc}`.cyan
                        );
                    return true;
                }
                
                console.log(
                    `${this.facility}`+
                    ` ${this.num}`+
                    ` ${value}`+
                    ` ${this.off_desc}`
                    );
                return false;
                
                // if(time > this.next_on_time){
                //     this.next_on_time = time + this.delay;
                //     console.log(`rollback`.cyan);
                // }else{
                //     console.log(`rollback`);
                // }
                // this.next_rollback_time = time + this.delay;
                // return true;
            }
        }
        // console.log(`check_change: ${this.num} => linux: ${this.pin_to_linux(this.num)}`);
        // console.log(`${typeof this.value} ${this.value}`);
        //let r = this.read()
        
        // if(this.next_read_time && moment().unix() < this.next_read_time){
        //     return false;
        // }
        
        // if(value && moment().unix() < this.extitation_time){
        //     return false
        // }else{
        //     this.value = value;
        //     this.extitation_time = this.delay + moment().unix();
        //     return false;
        // }
        
        // if(value !== this.value && value !== this.aux_value){
        //     this.value = value;
        //     return false;
        // }else if(value === this.value && value !== this.aux_value){
        //     this.aux_value = value;
        //     if(value === 0){
        //         this.next_read_time = this.delay + moment().unix();
            
        //     }
        //     return true;
        // }
    };
}

class Facility {
    constructor(el) {
        Object.entries(el).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
let data_from_db = [{
    name: 212,
    enable: true,
    armed: true,
    personal_chat_id: -493180402,//-366271163 (211)
    users: [{
        id: 283404954,
        first_name: 'Андрей',
        username: 'ssplast'
    }],
    in_pins: [{
        num: 12,
        desc: 'сенс. движ.',
        on_desc: 'движение',
        off_desc: 'движение окончено',
        delay: 20
    },{
        num: 13,
        desc: 'дверь',
        on_desc: 'открытие двери',
        off_desc: 'закрытие двери',
        delay: 2
    },{
        num: 15,
        desc: 'флаг эл. замка',
        on_desc: 'эл. замка открыт',
        off_desc: 'эл. замка закрыт',
        delay: 0
    },{
        num: 16,
        desc: 'ворота',
        on_desc: 'ворота открыты',
        off_desc: 'ворота закрыты',
        delay: 0
    }
],
    out_pins: [],
    methods: []
}];

class Equipment {
    constructor(data) {

        this.gpio_in_pins = {};
        this.gpio_out_pins = [];
        this.facility = {};
        
        this.general_chat_id = -1001452183757;
        this.send_to_telegram = send_to_telegram;

        data.forEach(el => {
            this.facility[el.name] = new Facility(el);
            this.users = el.users;
            el.in_pins.forEach(pin => {
                pin.facility = el.name;
                this.gpio_in_pins[pin.num] = new InPin(pin);
            });
            
        });

        //console.log(this.facility);
    }

    alarm = ({facility, num}) => {
        //console.log('alarm alarm', facility, num);
    }

    handler_event_pin_changed = pin => {

        //console.log(pin);
        //console.log(moment().format('DD HH:mm:ss'), pin.facility, pin.num, pin.desc);
        
        if(this.facility[pin.facility].armed){
            this.alarm(pin);
        }

        //console.log(this.facility[pin.facility].personal_chat_id)
        this.send_to_telegram({
                telegram: {
                    type: 'sendMessage',
                    chat_id: this.general_chat_id,//this.facility[pin.facility].personal_chat_id,
                    text: `<code>${moment().format('DD HH:mm:ss.SSS')}\n${pin.facility} ${pin.num} ${pin.value ? this.gpio_in_pins[pin.num].on_desc: this.gpio_in_pins[pin.num].off_desc}</code>`,
                    opt: {
                        disable_notification: false,
                        disable_web_page_preview: true,
                        parse_mode: 'HTML'
                        //reply_markup: [Object]
                    }
                }
          })
    }

    enumeration = () => {
        if(this.enumeration_flag === true){
            Object.values(this.gpio_in_pins).forEach(pin => {
                if(pin.check_change_value()){
                    this.handler_event_pin_changed(pin);
                }
            });
            setTimeout(this.enumeration)//, 2000);
        }else{
            console.log(`enumeration stoped, enumeration_flag is false`.red)
        }
    }
    
    start_enumeration = () => {
        this.enumeration_flag = true;
        this.enumeration();
    }

    stop_enumeration = () => {
        this.enumeration_flag = false;
    }

}


let eq = new Equipment(data_from_db);
eq.start_enumeration();
module.exports.EQ = eq;
//console.log(eq)


// let claster_in_pins = new ClasterInPins([3, 5])
// console.log(claster_in_pins)
// claster_in_pins.start_enumeration();

//setTimeout(claster_in_pins.stop_enumeration, 1000);
// class Claster {
//     constructor([...facilitys]) {
//         this.facilitys = facilitys.map(f => {
            
//         });
//     }
// }

// global.M = {
//     option: {
//         main_chat_id: -1001452183757,
//         condition: '',//
//         public_pins: {
//             out: {
//                 14: {
//                     access: true,
//                     description: 'Фонарь #1',
//                     on_desc: 'Фонарь светит',
//                     off_desc: 'Фонарь отключён',
//                     delay_time: 60000,
//                     value: 0
//                 }
//             }
//         }
//     },
//     eq: {
//         '211': {
//             enable: true,//флаг включённости обьекта под охрану
//             armed: false,//флаг состояния обьекта под охраной или нет
//             telegram: {
//                 alarm_chat_id: -366271163,//-345034533,
//                 event_chat_id: -366271163,//-345034533,
//                 stdout_chat_id: -366271163//-345034533
//             },
//             users: [{
//                 id: 283404954,
//                 is_bot: false,
//                 first_name: 'Андрей',
//                 username: 'ssplast',
//                 language_code: 'ru'
//             }],
//             pins: {
//                 out: {
//                     14: {
//                         access: true,
//                         description: 'авар. освещ.',
//                         on_desc: 'on',
//                         off_desc: 'off'
//                     }
//                 },
//                 in: {
//                     3: {
//                         enable: true,
//                         description: 'сенс. движ.',
//                         on_desc: 'движение',
//                         off_desc: 'движение окончено',
//                         delay_time: 60000,
//                     },
//                     5: {
//                         enable: true,
//                         description: 'дверь',
//                         on_desc: 'открытие двери',
//                         off_desc: 'закрытие двери',
//                         delay_time: 5000,
//                     },
//                     7: {
//                         enable: true,
//                         description: 'флаг эл. замка',
//                         on_desc: 'эл. замка открыт',
//                         off_desc: 'эл. замка закрыт',
//                         delay_time: 0,
//                     },
//                     8: {
//                         enable: true,
//                         description: 'ворота',
//                         on_desc: 'ворота открыты',
//                         off_desc: 'ворота закрыты',
//                         delay_time: 3000,
//                     }
//                 }
//             }
//         },
//         '212': {
//             enable: true,//флаг включённости обьекта под охрану
//             armed: false,//флаг состояния обьекта под охраной или нет
//             telegram: {
//                 alarm_chat_id: -493180402,//-345034533,
//                 event_chat_id: -493180402,//-345034533,
//                 stdout_chat_id: -493180402//-345034533
//             },
//             users: [{
//                 id: 283404954,
//                 is_bot: false,
//                 first_name: 'Андрей',
//                 username: 'ssplast',
//                 language_code: 'ru'
//             }],
//             funcs : {
//                 electric_lock_switch: {
//                     description: 'эл. замок',   
//                     callback_data_path: '',
//                     position: 1,
//                     cycle_position: 1,
//                     cycle_position_desc: 'движение',
//                     intermediate_cycle_desc: 'движение',
//                     intermediate_value_cycle_desc: 'движение',
//                     position_off_desc: 'движение окончено',
//                     delay_time: 60000,
//                 }
//             },
//             pins: {
//                 out: {
//                     18: {
//                         access: true,
//                         description: 'открыть эл замок',
//                         on_desc: 'активно',
//                         off_desc: '0'
//                     },
//                     19: {
//                         access: true,
//                         description: 'закрыть эл замок',
//                         on_desc: 'активно',
//                         off_desc: '0'
//                     }
//                 },
//                 in: {
//                     12: {
//                         enable: true,
//                         description: 'сенс. движ.',
//                         on_desc: 'движение',
//                         off_desc: 'движение окончено',
//                         delay_time: 60000,
//                     },
//                     13: {
//                         enable: true,
//                         description: 'дверь',
//                         on_desc: 'открытие двери',
//                         off_desc: 'закрытие двери',
//                         delay_time: 5000,
//                     },
//                     15: {
//                         enable: true,
//                         description: 'флаг эл. замка',
//                         on_desc: 'эл. замка открыт',
//                         off_desc: 'эл. замка закрыт',
//                         delay_time: 0,
//                     },
//                     16: {
//                         enable: true,
//                         description: 'ворота',
//                         on_desc: 'ворота открыты',
//                         off_desc: 'ворота закрыты',
//                         delay_time: 3000,
//                     }
//                 }
//             }
//         }
//     }
// }


// let sendMessage = async ({chat_id, message, disable_notification}) => {


//     send({
//         telegram: {
//             type: 'sendMessage',
//             chat_id: chat_id,
//             message: message,
//             opt: {
//             disable_notification: disable_notification,
//             disable_web_page_preview: true,
//             parse_mode: 'HTML',
//             reply_markup: {
//                     inline_keyboard: [
//                         [{
//                             text: '🔄', callback_data: ''
//                         }],
//                         [{
//                             text: '💰', callback_data: ''
//                         }]
//                     ]
//                 }
//             }
//         }
//     });
// /*
//     tel_bot.context.sendMessage(id, `<code>${str}</code>`,
//     {
//         disable_notification: disable_notification,
//         disable_web_page_preview: true,
//         parse_mode: 'HTML'
//     }).then(res => {
//         //console.log(res)
//     }).catch(e => {
//         console.log(e)
//     });
// */

// }





// let print = ({val}) => {

// }
// //inform, notify
// let inform = ({obj_name, pin, event}) => {

//     let t = Number(moment().format('HH'));    

//     if(M.eq[obj_name].armed || !(t > 8 && t < 21)){
//         sendMessage({
//             chat_id: M.option.main_chat_id,
//             message: `‼️ ${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}`,
//             disable_notification: false
//         });
//         sendMessage({
//             chat_id: M.eq[obj_name].telegram.event_chat_id,
//             message: `‼️ ${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}`,
//             disable_notification: false
//         })
//     }else{
//         sendMessage({
//             chat_id: M.option.main_chat_id,
//             message: `${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}`,
//             disable_notification: true
//         });
//         sendMessage({
//             chat_id: M.eq[obj_name].telegram.event_chat_id,
//             message: `${obj_name} ${pin} ${M.eq[obj_name].pins.in[pin]['event_' + event + '_desc']}`,
//             disable_notification: true
//         });
//     }
// }

// let extitation = ({obj_name, pin, val}) => {
//     if(M.eq[obj_name].pins[pin].last_extitation_time + M.eq[obj_name].pins[pin].delay_time <= moment().unix() * 1000&&
//     M.eq[obj_name].pins[pin].position === 0){
//         M.eq[obj_name].pins[pin].count++;
//         M.eq[obj_name].pins[pin].last_extitation_time = moment().unix() * 1000;
//         M.eq[obj_name].pins[pin].position = val;
//         console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'on '.black.bgBrightCyan}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].on_desc.red}`);
//         inform({obj_name: obj_name, pin: pin, event: 'on'});
//     }else{
//         console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'on '.black.bgBrightWhite}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].on_desc.red}`);
//     }
// }

// let rollback = ({obj_name, pin, val}) => {
//     if(M.eq[obj_name].pins[pin].position === 1){
//         M.eq[obj_name].pins[pin].count++;
//         M.eq[obj_name].pins[pin].last_rollback_time = moment().unix() * 1000;
//         M.eq[obj_name].pins[pin].position = val;
//         console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'off'.black.bgBrightCyan}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].off_desc.green}`);
//         inform({obj_name: obj_name, pin: pin, event: 'off'});
//     }else{
//         console.log(`${moment().format('HH:mm:ss SSS').green} ${val} ${'off'.black.bgBrightWhite}: ${obj_name} ${pin} ${M.eq[obj_name].pins[pin].off_desc.green}`);
//     }
// }

// let count = 0;


// function main() {

//     let str = moment().format('x');
//     let time = Number(str);
//     let time_h = moment(Number(str)).format('MM.DD HH:mm:ss SSS');
//     let arr = [];
//     Object.keys(M.eq)
//     .filter(eq_name => M.eq[eq_name].enable)
//     .forEach(eq_name => {
//         Object.keys(M.eq[eq_name].pins.in)
//         .filter(pin => M.eq[eq_name].pins.in[pin].enable)
//         .forEach(pin => {
//             let val = M.eq[eq_name].pins.in[pin].gpio.readSync();

//             if(val !== M.eq[eq_name].pins.in[pin].value){
//                 if(val === 1 && M.eq[eq_name].pins.in[pin].additional_verification === 1){//extitation
//                     if(M.eq[eq_name].pins.in[pin].last_extitation_time + M.eq[eq_name].pins.in[pin].delay_time < time &&
//                         M.eq[eq_name].pins.in[pin].last_rollback_time + M.eq[eq_name].pins.in[pin].delay_time < time
//                     ){
//                         M.eq[eq_name].pins.in[pin].last_extitation_time = time;
//                         M.eq[eq_name].pins.in[pin].count++;
//                         M.eq[eq_name].pins.in[pin].position = val;
                        
//                         console.log(`${time_h} `+
//                         `${'on '.black.bgBrightGreen}: `+
//                         `${M.eq[eq_name].pins.in[pin].obj_name} `+
//                         `${pin} ${val} `+
//                         `${M.eq[eq_name].pins.in[pin].on_desc}`);

//                         inform({obj_name: M.eq[eq_name].pins.in[pin].obj_name, pin: pin, event: 'on'});
//                     }else{
//                         console.log(`${time_h} `+
//                         `${'on '}: `+
//                         `${M.eq[eq_name].pins.in[pin].obj_name} `+
//                         `${pin} ${val} `+
//                         `${M.eq[eq_name].pins.in[pin].on_desc}`);
//                     }
//                 }else if(M.eq[eq_name].pins.in[pin].additional_verification === 1){//rollback
//                     if(M.eq[eq_name].pins.in[pin].position !== val){
//                         M.eq[eq_name].pins.in[pin].last_rollback_time = time;
//                         M.eq[eq_name].pins.in[pin].position = val;

//                         console.log(`${time_h} `+
//                         `${'off'.black.bgBrightGreen}: `+
//                         `${M.eq[eq_name].pins.in[pin].obj_name} `+
//                         `${pin} ${val} `+
//                         `${M.eq[eq_name].pins.in[pin].off_desc}`);
//                         inform({obj_name: M.eq[eq_name].pins.in[pin].obj_name, pin: pin, event: 'off'});
//                     }else{
//                         console.log(`${time_h} `+
//                         `${'off'}: `+
//                         `${M.eq[eq_name].pins.in[pin].obj_name} `+
//                         `${pin} ${val} `+
//                         `${M.eq[eq_name].pins.in[pin].off_desc}`);
//                     }
//                 }
//                 if(M.eq[eq_name].pins.in[pin].additional_verification === 0){
//                     M.eq[eq_name].pins.in[pin].additional_verification = 1;
//                 }else{
//                     M.eq[eq_name].pins.in[pin].additional_verification = 0;
//                     M.eq[eq_name].pins.in[pin].value = val;
//                 }
                
//             }

//             str += ` ${M.eq[eq_name].pins.in[pin].value}`;
//             //arr.push(pin);
//         })
//     });
//     process.stdout.write(`${count++} ${str}\r`)
//     setTimeout(main, null);
// }


// // function main(pin_arr) {

// //     let str = moment().format('x');
// //     let time = Number(str);
// //     let time_h = moment(Number(str)).format('MM.DD HH:mm:ss SSS');
// //     let arr = [];
// //     pin_arr.forEach(pin => {
// //         let val = pin.gpio.readSync();

// //         if(val !== pin.value){
// //             if(val === 1){//extitation
// //                 if(pin.last_extitation_time + pin.delay_time < time &&
// //                 pin.last_rollback_time + pin.delay_time < time
// //                 ){
// //                     pin.last_extitation_time = time;
// //                     pin.count++;
// //                     pin.position = val;
                    
// //                     console.log(`${time_h} `+
// //                     `${'on '.black.bgBrightGreen}: `+
// //                     `${pin.obj_name} `+
// //                     `${pin.pin} ${val} `+
// //                     `${pin.on_desc}`);

// //                     inform({obj_name: pin.obj_name, pin: pin.pin, event: 'on'});
// //                 }else{
// //                     console.log(`${time_h} `+
// //                     `${'on '}: `+
// //                     `${pin.obj_name} `+
// //                     `${pin.pin} ${val} `+
// //                     `${pin.on_desc}`);
// //                 }
// //             }else{//rollback
// //                 if(pin.position !== val){
// //                     pin.last_rollback_time = time;
// //                     pin.position = val;

// //                     console.log(`${time_h} `+
// //                     `${'off'.black.bgBrightGreen}: `+
// //                     `${pin.obj_name} `+
// //                     `${pin.pin} ${val} `+
// //                     `${pin.off_desc}`);
// //                     inform({obj_name: pin.obj_name, pin: pin.pin, event: 'off'});
// //                 }else{
// //                     console.log(`${time_h} `+
// //                     `${'off'}: `+
// //                     `${pin.obj_name} `+
// //                     `${pin.pin} ${val} `+
// //                     `${pin.off_desc}`);
// //                 }
// //             }
// //             pin.value = val;
// //         }

// //         str += ` ${pin.value}`;
// //         arr.push(pin);
// //     });
// //     process.stdout.write(`${count++} ${str}\r`)
// //     setTimeout(main, null, arr);
// // }

// //let pin_arr = [];

// let init = function(){
//     Object.keys(M.eq)
//     .filter(name => name != 'option' && M.eq[name].enable)
//     .forEach(obj_name => {
//         Object.keys(M.eq[obj_name].pins.in).forEach(pin => {
//             let obj = {
//                 pin: pin,
//                 obj_name: obj_name,
//                 gpio: new Gpio(convert[pin], 'in'),
//                 last_extitation_time: Number(moment().format('x')) - M.eq[obj_name].pins.in[pin].delay_time,
//                 last_rollback_time: Number(moment().format('x')) - M.eq[obj_name].pins.in[pin].delay_time,
//                 count: M.eq[obj_name].pins.in[pin].count || 0,
//                 additional_verification: 0
//             }
//             obj.value = obj.position = obj.gpio.readSync();
//             M.eq[obj_name].pins.in[pin] = Object.assign(M.eq[obj_name].pins.in[pin], obj);
//             //pin_arr.push(Object.assign(M.eq[obj_name].pins.in[pin], obj));
//         })
//     });
//     //main(pin_arr);
//     main();
// }
// init();

// init = null


// let position_map = `<code>_____________________________________
//         |----|   1  3.3V   1 2   5V
//         |----|   2   (2)   3 4   5V
// ________|----|   3   (3)   5 6   GRD
//         |----|   4   (4)   7 8   (14)
//   5V 4A |----|   5   GRD   9 10  (15)
// ________|----|   6  (17)  11 12  (18)
//         |----|   7  (27)  13 14  GRD
//         |----|   8  (22)  15 16  (23)
//   HDMI  |----|   9  3.3V  17 18  (24)
//         |----|  10  (10)  19 20  GRD
// ________|----|  11   (9)  21 22  (25)
//         |----|  12  (11)  23 24  (8)
//         |----|  13   GRD  25 26  (7)
//         |----|  14   (0)  27 28  (1)
//         |----|  15   (5)  29 30  GRD
//         |----|  16   (6)  31 32  (12)
//         |----|  17  (13)  33 34  GRD
//         |----|  18  (19)  35 36  (16)
//         |----|  19  (26)  37 38  (20)
//         |----|  20   GRD  39 40  (21)
// _____________________________________
//              |           |           |
//      RJ45    |    USB    |    USB    |
// _____________|___________|___________|
// </code>`;


// let ooop = `
// ----------  3.3V   1  2  5V -----------
// движение     211   3  4  5V -----------
// дверь        211   5  6  GND ----------
// флаг засов   211   7  8  211 ворота
// -----------  GND   9 10  211 упр засов 1
// упр засов 2  211  11 12  212 движение
// дверь        212  13 14  GND ----------
// флаг засов   212  15 16  212 ворота
// ----------- 3.3V  17 18  212 упр засов 1
// упр засов 2  212  19 20  GND -----------


// 21 22
// 23 24
// ------------  GND   25 26
// 27 28
// 29 30  GND -----------
// 31 32
// 33 34  GND -----------
// 35 36
// 37 38
// ------------  GND   39 40`;

