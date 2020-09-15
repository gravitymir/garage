const fs = require('fs');
const path = require('path');
const telegramCommands = fs.readdirSync(path.join(__dirname, 'commands'), 'utf8');

module.exports = ctx => {
    LOG_FUNC(arguments, __filename);
    
    if(!/^\/[a-zA-Z0-9_]+/.test(ctx.text)){
        //ctx.reqInfo += ' ' + ctx.text;
    }

    switch (true) {
        case /^\/[a-zA-Z0-9_]+/.test(ctx.text)://command
            ctx.command = ctx.text.match(/[a-zA-Z0-9_]+/g)[0];
            ctx.reqInfo += '\ncommand ' +  String(ctx.text).yellow;

            //console.log(ctx);
            //console.log(telegramCommands); 
            if(!telegramCommands.includes(ctx.command)){
                console.log('Я не занаю такой команды');


                ctx.send(JSON.stringify({
                    telegram: {
                        type: 'sendMessage',
                        chat_id: ctx.chat.id,
                        text: `<code>Не известная команда ❗️</code>`,
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
                // ctx.reply({telegram: {
                //     chat_id: ctx.chat.id,
                //     reply_markup: {
                //         keyboard: [
                //             [
                //                 {text: '🏡', callback_data: 'rates/subscribe'},
                //                 {text: 'contact', request_contact: true},
                //                 {text: 'location', request_location: true}//,
                //                 //{remove_keyboard: true}
                //                 //{locationRequestButton: {text: 'asdasdas'}}
                //             ]
                
                //         ],
                //         resize_keyboard: true,
                //         one_time_keyboard: true
                //     },
                //     disable_notification: true,
                //     disable_web_page_preview: false,
                //     parse_mode: 'HTML'
                // }})
                return ctx;
            }
            return require(path.join(__dirname, 'commands', ctx.command))(ctx);
        break;
        default:
            return ctx;
    }
};
