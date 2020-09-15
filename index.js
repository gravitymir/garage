//moment axios telegraf express cron colors
require('colors');
const moment = require('moment');
const path = require('path');

//console.log('\nwait internet connection'.cyan);
global.DIR = __dirname;

global.DB = require(path.join(global.DIR, 'auxmod', 'mongodb'));
//require(path.join(global.DIR, 'auxmod', 'telegram', 'garazhbot'));

global.LOG_FUNC = function LOG_FUNC(args, filename){
    //console.log(moment().format("DD:MM HH:mm:ss").dim + ' ' + (args.callee.name).inverse + ' ' + filename);
}

global.INTERNAL_IP = null;
global.EXTERNAL_IP = null;
global.SENTRY_URL = `http://167.71.12.44:8080/`;


//global.cron_job_to_arm = require(path.join(global.DIR, 'auxmod', 'garage', 'to_arm'));
//global.cron_job_get_external_ip = require(path.join(global.DIR, 'auxmod', 'garage', 'external_ip'));
//global.cron_job_get_internal_ip = require(path.join(global.DIR, 'auxmod', 'garage', 'internal_ip'));1

require(path.join(global.DIR, 'auxmod', 'ub_gpio'));

// let convert = {
//     //3: 2, 5: 3, 7: 4, 8: 14, 10: 15, 11: 17, 12: 18, 13: 27,
//     //15: 22, 16: 23, 18: 24, 19: 10, 21: 9, 22: 25, 23: 11,
//     //24: 8, 26: 7, 27: 0, 28: 1, 29: 5, 31: 6, 32: 12,
//     33: 13, 35: 19, 36: 16, 37: 26, 38: 20, 40: 21
// };
// let Gpio = require('onoff').Gpio;
// let obj = {};
// Object.keys(convert).forEach(key =>{
//     obj[key] = {
//         pin: key,
//         gpio: new Gpio(convert[key], 'in'),
//         value: 0
//     }
// });

// let oo = false;
// function gg(){
//     let arrk = [];
//     let arrv = [];
//     Object.keys(obj).forEach(key => {
//         obj[key].value = obj[key].gpio.readSync();
//         //obj[key].value = obj[key].gpio.writeSync(0);

//         arrk.push(String(key))
        
//         arrv.push(String(obj[key].value).padStart(String(key).length))
//     });

//     //console.log(arrk.join(' '))
//     //console.log(arrv.join(' '))
//     if(!oo){
//         console.log(arrk.join(' '))
//         oo = true
//     }
//     process.stdout.write(`${arrv.join(' ')}\r`);
//     // arr.forEach(pin => {
//     //     console.log(arr[pin])
//     //     //console.log(pin.gpio.readSync())
//     // })
// }

// setInterval(gg);
//(async function(){
    
    // DB.updateOne({
    //     collection: 'users',
    //     _id: 1,
    //     update: {$set: {user: 'ssplast'}},
    //         opt: {upsert: true}
    //     });

    // console.log(await DB.find({
    //     collection: 'users',
    //     find:{}
    // }));
    // await DB.deleteOne({
    //     collection: 'users',
    //     _id: 283404954
    // });
        
    //console.log(await DB.listCollectionsNameArray())
//}())

//module_ip.ip();
// let get_external_ip = (args = {}) => {
// 	args.t = args.t || 1;
// 	if(!args.crash){
// 		process.stdout.write(`Ожидание внешнего IP:` + ` ${args.t}\r`.green);
// 	}
	
// 	try{
// 		let response = require('sync-request')('GET', global.SENTRY_URL + 'sentry?get_my_ip=true');
// 		if(response.statusCode !== 200 || !response.body.length){
// 			global.EXTERNAL_IP = null;
// 			return setTimeout(get_external_ip, 1000, ++args.t);
// 		}
// 		let res = JSON.parse(response.body);
// 		global.EXTERNAL_IP = res.ip;
// 		console.log('Получен внешний    IP: ' + global.EXTERNAL_IP.green);
// 		return to_arm();
// 	}catch(e){
// 		global.INTERNAL_IP = null;
// 		global.EXTERNAL_IP = null;
// 		process.stdout.write('Аварийное ожидание внешнего IP:' + ` ${args.t}\r`.red);
// 		return setTimeout(get_external_ip, 1000, {crash: true, t: ++args.t});
// 	}	
// }

// let to_arm = (t = 1) => {
// 	let url = global.SENTRY_URL + 'sentry?to_arm='+
// 	JSON.stringify({
// 		name: encodeURI("Гаражи"),
// 		ipv4: global.EXTERNAL_IP,
// 		telegram_chat_id: -206137215
// 	});

// 	process.stdout.write('Запрос ' + String(t).green + ' встать на учёт: ' + decodeURI(url) + '\r');
	
// 	try{
// 		let response = require('sync-request')('GET', url);
		
// 		if(response.statusCode !== 200){
// 			return to_arm(++t);
// 		}else if(t >= 120){
// 			process.stdout.write(
// 				`\nНе удалось встать на учёт.`.yellow +
// 				`\nСовершено ${t} попыток.`.yellow +
// 				`\nОтвет не получен!`.red +
// 				`\nЗапуск без учёта`.yellow
// 			)
// 			return timer();
// 		}else if(!response.body.length){
// 			return to_arm(++t);
// 		}else{
// 			let res = JSON.parse(response.body);
// 			console.log('\n', res ,'\n')
// 			console.log('\nПолучен ответ/статус: ' + `${response.statusCode === 200 ? '200'.green: String(response.statusCode).red}`
// 			+'/'+ (res.status ? 'true'.green: 'false'.red));
				
// 			if(res.status){
// 				//start cron check
// 				return check();
// 			}else{
// 				return to_arm(++t);
// 			}
// 		}
// 	}catch(e){
// 		console.log(e);
// 		return to_arm(++t)
// 	}
// }

// let check = (t = 1) => {
// 	let url = global.SENTRY_URL + 'sentry?check='+
// 	JSON.stringify({
// 		name: encodeURI("Гаражи"),
// 		ipv4: global.EXTERNAL_IP,
// 		client_time: moment().format('YYYY MM DD HH:mm:ss')
// 	});

// 	try{
// 		let response = require('sync-request')('GET', url);
// 		if(response.statusCode !== 200){
// 			return setTimeout(check, 15000, ++t);
// 		}
// 		let res = JSON.parse(response.body);

// 		console.log('Учёт отметка: ' +
// 			(res.status ? String(res.message).green: String(res.message).red) +
// 			' ' + String(moment().format('HH:mm:ss')).yellow
// 		);
// 		return setTimeout(check, 30000, ++t);
// 	}catch(e){
// 		console.log('Учёт отметка: ' + 'не удалость выйти на связь'.red,
// 		'\nВероятно произошел обрыв интернет соединения'.yellow);
// 		return get_internal_ip({crash: true});
// 	}
// }
// let options_state = {
//     enable: true,// считывать датчики или нет
//     armed: true,// состояние охранного режима (на охране или нет)
//     armedStartTime: moment().format("hh"),// начало охранного режима
//     armedEndTime: moment().format("hh"),// завершение охранного режима
//     autoArmed: {//автоприём под охрану спустя задержку
//         enable: true,//
//         atention_5_min: true,//
//         proposition: true,//
//         atention_canceled: true,//
//         delayTime: moment().format("mm")
//     },
//     autoWarningOpenDoor: {//дверь открыта долгий промежуток
// 	    enable: true,//
// 	    delayTime: moment().format("ss")//задержка
//     },
//     armedLastEvent: {//кто поставил
//         user: "ssplast",//кто поставил под охрану
// 	    time: moment().format("mm")//момент передачи под охрану
//     },
//     disarmed: {//кто снял
//         user: "ssplast",//кто поставил под охрану
//         time: moment().format("mm")//момент снятия под охрану
//     },
//     log: true,//вести лог, файл с записями о событиях
//     logToTelegram: 1//вести лог в телеграм ([номер чата]) файл с записями о событиях
// };


// let timer = (t = 1) => {
// 	process.stdout.write( `Далее ` + `${t}\r`.green);
// 	return setTimeout(timer, 1000, ++t);
// }
// console.log("nodejs is started".gray);
// get_internal_ip();




//setTimeout(require, 1000 * 60 * 5, './index.js');

// let Gpio = require('onoff').Gpio;
// let p2 = new Gpio(2, 'in');
// let p3 = new Gpio(3, 'in');
// let p4 = new Gpio(4, 'in');



// let detectChanges = async () => {
// 	console.log(p2.readSync(), p3.readSync(), p4.readSync());
// 	setTimeout(detectChanges, 500);
// };

// detectChanges();




// process.env.NODE_ENV = JSON.stringify('production');
// global.BOT_TOKEN = "652358176:AAGHL_ZOhVVysvyAmZNdjBS8kTZapOPsigw";
// global.DIR = global.DIR = __dirname;
// global.HTTP_PORT = '80';
// global.WS_PORT = '8080';
// global.HOSTNAME = '-';
// global.DOMAIN = '-';
// global.DB_NAME = 'garage';

// //const colors = require('colors');
// global.PATH = require('path');
// global.INSPECT = require(PATH.join(DIR, 'auxmod', 'console_log'));
// global.LOG = console.log;

// global.INTERNAL_IP = require(PATH.join(DIR, 'auxmod', 'internal_ip'));
// //global.EXTERNAL_IP = require(PATH.join(DIR, 'auxmod', 'external_ip'));

// global.MOMENT = require('moment');
// MOMENT.locale("ru");

// global.Db = require(PATH.join(DIR, 'auxmod', 'mongodb'));

// (async ()=>{
//     //INSPECT(await Db.collection('test_users'));
//     //INSPECT(await Db.updateOne('test_users', {_id: '4'}, {$set: {name: 'Артём'}}, { upsert: true }));
//     //INSPECT(await Db.findToArray('garage', {}));
//     LOG(await Db.info());
// })()

// //global.Cron = require(PATH.join(DIR, 'auxmod', 'cron_job'));
// //Cron.init();


// //INSPECT(Telegram);
// let Gpio = require('onoff').Gpio;

// let state2 = {
//     enable: true,// считывать датчики или нет
//     armed: true,// состояние охранного режима (на охране или нет)
//     armedStartTime: MOMENT().format("hh"),// начало охранного режима
//     armedEndTime: MOMENT().format("hh"),// завершение охранного режима
//     autoArmed: {//автоприём под охрану спустя задержку
//         enable: true,//
//         atention_5_min: true,//
//         proposition: true,//
//         atention_canceled: true,//
//         delayTime: MOMENT().format("mm")
//     },
//     autoWarningOpenDoor: {//дверь открыта долгий промежуток
// 	    enable: true,//
// 	    delayTime: MOMENT().format("ss")//задержка
//     },
//     armedLastEvent: {//кто поставил
//         user: "ssplast",//кто поставил под охрану
// 	    time: MOMENT().format("mm")//момент передачи под охрану
//     },
//     disarmed: {//кто снял
//         user: "ssplast",//кто поставил под охрану
//         time: MOMENT().format("mm")//момент снятия под охрану
//     },
//     log: true,//вести лог, файл с записями о событиях
//     logToTelegram: 1//вести лог в телеграм ([номер чата]) файл с записями о событиях
// };

// let opt = {
// 	gpio_linux: {
// 		3:2,
// 		5:3,
// 		7:4,
// 		8:14,
// 		10:15,
// 		11:17,
// 		12:18,
// 		13:27,
// 		15:22,
// 		16:23,
// 		18:24,
// 		19:10,
// 		21:9,
// 		22:25,
// 		23:11,
// 		24:8,
// 		26:7,
// 		27:0,
// 		28:1,
// 		29:5,
//         31:6,
//         32:12,
//         33:13,
//         35:19,
//         36:16,
//         37:26,
//         38:20,
//         40:21
// 	},
// 	state: {//настройки состояния
// 		timeStep: 500
// 	},
// 	garazh:{
// 		211: {
//         objectName: 'Гараж 211',
//         enable: true,// считывать датчики или нет
//         armed: false,// состояние охранного режима (на охране или нет)
//         armedStartTime: MOMENT().format("hh"),// начало охранного режима
//         armedEndTime: MOMENT().format("hh"),// завершение охранного режима
//         autoArmed: {//автоприём под охрану спустя задержку
//             atention_5_min: true,//
//             proposition: true,//
//             atention_canceled: true,//
//             delayTime: 768765876//MOMENT()//
//         },
//         autoWarningOpenDoor: {//дверь открыта долгий промежуток
//             enable: true,//
//             delayTime: 123123//MOMENT()//задержка
//         },
//         armedUser: {//кто поставил
//             user: "ssplast",//кто поставил под охрану
//             time: MOMENT().format("mm")//момент передачи под охрану
//         },
//         disarmedUser: {//кто снял
//             user: "ssplast",//кто поставил под охрану
//             time: MOMENT().format("mm")//момент снятия под охрану
//         },
//         log: true,//вести лог, файл с записями о событиях
//         logToTelegram: 1,//вести лог в телеграм ([номер чата]) файл с записями о событиях
//         master: [], //главный юзер обьекта
//         control: [], //учавствующие юзеры
//         observer: [], //доп наблюдатели

//         pins: {
//             3: {
//                 enable: true,
// 				linux: 2,
// 				way: 'in',
//                 pause: 1000, //задержка опроса между считываниями
//                 last_time_read: 0,
//                 val: 0, //значение
//                 last_val: 0,
//                 last_time_change_val: 0,

//                 armedState: 1, //состояние pin-а удволетворяющее переход в режим охраны
//                 alarmLevel: 2, //уровень тревоги датчика (информационный = 3, внимание = 2, тревога = 1)

//                 sensorName: "обьект 211",
//                 description: 'Датчик движения в передней части гаража',
//                 actionName: 'Движение в передней части гаража'
//             }
// 		}
//     },
// 	212:{
//         name: 'Гараж 212',
//         enable: true,// считывать датчики или нет
//         armed: false,// состояние охранного режима (на охране или нет)
//         armedStartTime: MOMENT().format("hh"),// начало охранного режима
//         armedEndTime: MOMENT().format("hh"),// завершение охранного режима
//         autoArmed: {//автоприём под охрану спустя задержку
//             atention_5_min: true,//
//             proposition: true,//
//             atention_canceled: true,//
//             delayTime: 768765876//MOMENT()//
//         },
//         autoWarningOpenDoor: {//дверь открыта долгий промежуток
//             enable: true,//
//             delayTime: 123123//MOMENT()//задержка
//         },
//         armedUser: {//кто поставил
//             user: "ssplast",//кто поставил под охрану
//             time: MOMENT().format("mm")//момент передачи под охрану
//         },
//         disarmedUser: {//кто снял
//             user: "ssplast",//кто поставил под охрану
//             time: MOMENT().format("mm")//момент снятия под охрану
//         },
//         log: true,//вести лог, файл с записями о событиях
//         logToTelegram: 1,//вести лог в телеграм ([номер чата]) файл с записями о событиях
//         master: [], //главный юзер обьекта
//         control: [], //учавствующие юзеры
//         observer: [], //доп наблюдатели
//         pins: {
//             	5: {
// 					enable: true,
// 					linux: 3,
// 					way: 'in',
// 					pause: 1000, //задержка опроса между считываниями
// 					last_time_read: 0,
// 					val: 0, //значение
// 					last_val: 0,
// 					last_time_change_val: 0,

// 					armedState: 1, //состояние pin-а удволетворяющее переход в режим охраны
// 					alarmLevel: 2, //уровень тревоги датчика (информационный = 3, внимание = 2, тревога = 1)

// 					sensorName: "обьект 211",
// 					description: '211 вход',
// 					actionName: 'Движение 211'
//             	}
// 			}
//     	}
//     }
// };

// var sendToTelegramLog = (str, keyboard) => {
// 	Telegram.bots.garage_bot.sendMessage(-206137215, str, keyboard)
// }

// var changesProcessing = changes => {
//     INSPECT(changes);
//     sendToTelegramLog('<code>'+JSON.stringify(changes)+'</code>');
// };

// var detectChanges = async () => {
// 	let time = Number(MOMENT().format('x'));
// 	//LOG(MOMENT(time).format('hh:mm:ss.SSS'));
// 	let changes = [];
//     for(let num in opt.garazh){
//     	if(!opt.garazh[num].enable) continue;
// 		for(let pin in opt.garazh[num].pins){
//             if(!opt.garazh[num].pins[pin].enable || time < (opt.garazh[num].pins[pin].last_time_read + opt.garazh[num].pins[pin].pause)) continue;
// 				opt.garazh[num].pins[pin].last_time_read = time;
// 				opt.garazh[num].pins[pin].val = opt.garazh[num].pins[pin].gpio.readSync();
//             	if(opt.garazh[num].pins[pin].last_val != opt.garazh[num].pins[pin].val){
//                     opt.garazh[num].pins[pin].last_val = opt.garazh[num].pins[pin].val;

//                     changes.push({
//                         garazh: +num,
//                         pin: +pin,
//                         time: time,
//                         val: opt.garazh[num].pins[pin].val,
//                         state: opt.garazh[num].pins[pin].armedState == opt.garazh[num].pins[pin].val ? 'excitation': 'rollback'
//                 	});
// 				}
// 		}
//     };

//     if(changes.length){
//         changesProcessing(changes);
// 	}
// 	setTimeout(detectChanges, opt.state.timeStep);
// };

// Db.findOne('state', {_id: '1'}).then(r => {
//     	opt.state = Object.assign(r.state, opt.state);
//     	for(let num in opt.garazh){
//             for(let pin in opt.garazh[num].pins){
//                 opt.garazh[num].pins[pin].gpio = new Gpio(
//                 	opt.gpio_linux[pin],
// 					opt.garazh[num].pins[pin].way
// 				);
// 			}
// 		};
// 		detectChanges();
// 	}
// );

// let osUptime = require('os-uptime');
// console.log(
// 	'\n<code>Включился\n'+
// 	moment().format('LLLL') +
// 	'\nПроцесс: ' + process.pid +
// 	'\nДиректория: ' + global.DIR +
// 	'\nВнутренний ip: ' + process.env.INTERNAL_IP +
// 	//'\nHttp порт: ' + HTTP_PORT +
// 	//'\nИмя хоста: ' + HOSTNAME +
// 	//'\nДомен: ' + DOMAIN +
// 	'\nВнешний ip: ' + process.env.EXTERNAL_IP +
// 	'\nПоднят: ' + process.uptime() +
//     '\nВ работе ' + moment(osUptime()).toNow('days') + '</code>\n'
// );
