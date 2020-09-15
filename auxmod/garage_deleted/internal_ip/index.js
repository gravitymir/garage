const path = require('path');
const moment = require('moment');
const os = require('os');
require('colors');

const CronJob = require('cron').CronJob;
let attempt = 0;
let flag_first_ip = true;//флаг первого получения ip

function equipment_survey_ip(ip){//опрос сканирование оборудования ip
    let ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(iname => {
	ifaces[iname].forEach(iface => {
		if ('IPv4' !== iface.family || iface.internal !== false) return;
			ip = iface.address
		});
    });

    if(!ip){
        global.INTERNAL_IP = null;
        if(flag_first_ip){
            process.stdout.write(`Ожидание внутреннего ip: ${String(attempt).cyan} попытка\r`);
        }else{
            process.stdout.write(`Аварийное ожидание внутреннего ip: ${attempt}\r`.yellow);    
        }
        return false;
    }

    global.INTERNAL_IP = ip;
    
    if(flag_first_ip){
        console.log(`${moment().format('HH:mm:ss').green} Получен внутренний ip: ${String(ip).green} с ${String(attempt).cyan} попытки`);
        flag_first_ip = false;//флаг получение ip
        require(path.join(global.DIR, 'auxmod', 'garage', 'check_arm'));
    }else{
        console.log('\nСоединение с локальной сетью восстановлено: ' + String(ip).green + ` с ${String(attempt).cyan} попытки`);
    }
    return true;
}

function get_ip(){
    ++attempt;
    if(equipment_survey_ip()){
        attempt = 0;
        cron_job_get_internal_ip.stop();
    }
}

const cron_job_get_internal_ip = new CronJob(
    '* * * * * *',
    get_ip,
    null,
    true,
    'Europe/Moscow'
);
//cron_job_get_ip.stop();
module.exports = cron_job_get_internal_ip;