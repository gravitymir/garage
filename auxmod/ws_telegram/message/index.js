const fs = require('fs');
const path = require('path');
require('colors');
const arr_subtypes = fs.readdirSync(path.join(__dirname, 'private'), 'utf8').map(el => {
    return el.split('.')[0];
});

module.exports = function updateMessage(ctx){
    LOG_FUNC(arguments, __filename);
    

    // console.log(arr_subtypes);
    // console.log(Object.keys(ctx));
    
    ctx.updateSubTypes = Object.keys(ctx).filter(key => arr_subtypes.includes(key));

    if(ctx.updateSubTypes.length !== 1){
        ctx.reqInfo += `${String('\nНе известная команда ctx.updateSubTypes').red}`;
        return ctx;
    }
    
    ctx.reqInfo += `\n${ctx.chat.type.green} `+
	`${String(ctx.chat.id).bgWhite.black} `+
	`${String(ctx.chat.first_name).bgWhite.black} `+
	`${String(ctx.chat.username).bgWhite.black}`+
	`\n${String(ctx.updateSubTypes).green} `+
    `${String(ctx[ctx.updateSubTypes]).cyan}`;
    

    if(ctx.chat.type === 'supergroup'){
        ctx.chat.type = 'group';
    }
    
    if(ctx.chat.type === 'group'){
        return ctx;
    }

    return require(path.join(__dirname, ctx.chat.type, String(ctx.updateSubTypes)))(ctx);
}