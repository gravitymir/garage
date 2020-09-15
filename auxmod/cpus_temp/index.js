module.exports = async function cpus_temp(){
    return await new Promise(function (fulfill, reject){
        let data = '';
        let t = '';
        require('child_process')
        .spawn('cat', [
            '/sys/devices/platform/coretemp.0/hwmon/hwmon1/temp2_input',
            '/sys/devices/platform/coretemp.0/hwmon/hwmon1/temp3_input',
            '/sys/devices/platform/coretemp.0/hwmon/hwmon1/temp4_input',
            '/sys/devices/platform/coretemp.0/hwmon/hwmon1/temp5_input'
        ]).stdout.on('data', function(chunk) {
            data += chunk;
        }).on('end', function(){    
            let str = data.split('\n').filter(i => i && i).map(el => {
                return el.replace(/0{3}/, '');
            }).join(',');

            //fulfill(t + '°C');
            fulfill(`${str} °C`);
        }).on('error', function(error){
            console.log(error);
            fulfill('Данные температуры не получены');
        });
    });
}