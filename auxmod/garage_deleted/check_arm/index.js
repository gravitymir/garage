const axios = require('axios');
const os = require('os');
const moment = require('moment');
moment.locale('ru');
require('colors');
const path = require('path');
const CronJob = require('cron').CronJob;

let bytes_to_size = require(path.join(global.DIR, 'auxmod', 'bytes_to_size'));
let cpus_temp = require(path.join(global.DIR, 'auxmod', 'cpus_temp'));

async function get_url(){
    let data = {
        _id: os.hostname(),
        ipv4: global.EXTERNAL_IP,
        ipv4_in: global.INTERNAL_IP,
        [os.hostname() + '_time']: moment().format('YYYY.MM.DD HH:mm:ss'),
        platform: `${os.type()} ${os.release()}${os.arch()} (${os.hostname()})`,
        cpus: `(${os.cpus()[0]['model']}) x ${os.cpus().length}`,
        cpus_temp: await cpus_temp(),
        s_memory: bytes_to_size(os.totalmem()) + ' всего, ' + bytes_to_size(os.freemem()) + ' свободно',
        p_memory: bytes_to_size(process.memoryUsage().rss) + ' / ' + bytes_to_size(process.memoryUsage().heapTotal),
        s_uptime: moment.duration(os.uptime(), 's').humanize(),
        p_uptime: moment.duration(process.uptime(), 's').humanize(),
        p_pid: process.pid,
        telegram_chat_id: -1001452183757
    }

    global.M.option.condition = data;

    return encodeURI('http://167.71.12.44:8080/sentry?check_arm='+
    JSON.stringify(data)
    );
}

async function check_arm(){
    
    axios.get(await get_url())
    .then(res => {
        if(res.status === 200){
            console.log(String(moment().format('DD HH:mm:ss ') + res.status).green)
            //console.log(`${String(moment().format('HH:mm:ss')).green} отметка ${res.data._id.cyan} server_time: ${String(res.data.server_time).green} mem: ${res.data.p_memory}`);
            //console.log(res.data)
            if(global.EXTERNAL_IP !== res.data.ipv4){
                console.log(`${String(moment().format('DD HH:mm:ss')).green} изменение внешнего ip ${String(global.EXTERNAL_IP).green} => ${String(res.data.ipv4).green}`);
                
                //global.tel_bot.sendMessage();

                global.EXTERNAL_IP = res.data.ipv4;
                //перезапустить процесс
                global.tel_bot.stop().then(()=>{
                    delete global.tel_bot;

                    global.tel_bot = require(path.join(global.DIR, 'auxmod', 'telegram', 'garazhbot'));
                    
                    global.tel_bot.launch();
                    //global.tel_bot.startPolling();
                });
            }
        }else{
            console.log(`${moment().format('HH:mm:ss').yellow}Не удалось отметиться, статус: ${res.status}`);
        }
    }).catch(function (error) {
        console.log(`${error}`);
    });
}

(async function(){
    axios.get(await get_url())
    .then(function (res){
        if(res.status !== 200){
            console.log(`${moment().format('HH:mm:ss').yellow} Не удалось получить внешний ip адрес`);
        }else{
            console.log(`${moment().format('HH:mm:ss').green} Получен внешний ip ${res.data.ipv4.green}`);
            global.EXTERNAL_IP = res.data.ipv4;


            global.tel_bot = require(path.join(global.DIR, 'auxmod', 'telegram', 'garazhbot'));

            global.tel_bot.startPolling();

            new CronJob({
                cronTime: '*/1 * * * * *',
                onTick: check_arm,
                start: true,
                timeZone: 'Europe/Moscow'
            });
        }
    }).catch(function (error) {
        console.log(error);
        console.log(`${moment().format('HH:mm:ss').yellow} Не удалось получить внешний ip адрес`);
    });
}())



