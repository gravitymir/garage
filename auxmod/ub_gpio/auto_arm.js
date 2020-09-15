let o = {
    enable: true,//флаг включённости обьекта под охрану
    on_arm: false,//флаг состояния обьекта под охраной или нет
    auto_arm: {//авто постановка под охрану
        arm_time_start: '0 0 22',//false || 'ss mm HH'
        arm_cron: new CronJob({
            cronTime: '10 52 7 * * *',
            onTick: auto_arm,
            start: true,
            timeZone: 'Europe/Kiev',
            context: {
                obj_name: '212'
            }
        }),
        delay_time_suitable_condition: 1000 * 60 * 30,//прошло времени в подходящем состоянии
    }
};
function auto_arm(){
    let flag = false;
    let now_time = moment().unix() * 1000;
    let obj_name = this.obj_name;
    let pins = Object.keys(mm[obj_name].pins)
        .filter(pin => mm[obj_name].pins[pin].in_out === 'in' &&
        mm[obj_name].pins[pin].enable)
        //.filter(pin => mm[obj_name].pins[pin].enable)
    let not_suitable_pins = pins.filter(pin => mm[obj_name].pins[pin].last_rollback_time * 1000 > now_time - mm[obj_name].auto_arm.delay_time_suitable_condition);
   
    if(pins.length === not_suitable_pins.length){//все пины в удволитворительном положении для постановки на охрану

        let last_rollback_time = pins.reduce(pin => {
            return mm[obj_name].pins[pin].last_rollback_time;
        });
    
        

        let next_cron = moment(Math.max(last_rollback_time) * 1000 +
            mm[obj_name].auto_arm.delay_time_suitable_condition);

        if(next_cron){

        }

        // next_cron = `${next_cron.get('second')} ${next_cron.get('minute')} ${next_cron.get('hour')} * *`;
        // console.log(next_cron);
        
        mm[obj_name].auto_arm.arm_cron.stop();
        mm[obj_name].auto_arm.arm_cron = new CronJob({
            cronTime: next_cron.format('ss mm HH * * *'),
            onTick: auto_arm,
            start: true,
            timeZone: 'Europe/Kiev',
            context: {
                obj_name: '212'
            }
        })
        console.log(`Автоохрана ${obj_name.cyan} отложена до`, next_cron.format('HH:mm:ss').green);
        
    }else{
        mm[obj_name].on_arm = true;
        console.log(`Автоохрана ${obj_name.cyan} включена`, moment().format('HH:mm:ss').green);
    }
}