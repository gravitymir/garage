const path = require('path');
const fs = require('fs');
const moment = require('moment');
moment.locale("ru");
require('colors');

const update_type_paths = fs.readdirSync(path.join(__dirname), 'utf8').map(el => {
    return el.split('.')[0];
});

const ws_update = function ws_update(ctx){
    LOG_FUNC(arguments, __filename);
    //console.log(ctx);
    ctx.update_type = Object.keys(ctx)[1];

    ctx[ctx.update_type].reqInfo = `${moment().format('DD HH:mm:ss')} ws_telegram ${ctx.update_type.yellow}`;
    ctx[ctx.update_type].owner = ctx.owner;
    ctx[ctx.update_type].send = ctx.send;

    // console.log(update_type_paths);
    // console.log(ctx.update_type);
    // console.log(!update_type_paths.includes(ctx.update_type));
    if(!update_type_paths.includes(ctx.update_type)){
		ctx.reqInfo += ' path отсутствует'.red;
		return ctx;
    }

    //console.log(ctx.update_type);
    ctx = require(path.join(__dirname, ctx.update_type))(ctx[ctx.update_type]);

    console.log(ctx.reqInfo);
    
    return ctx;
}

module.exports.update = ws_update;