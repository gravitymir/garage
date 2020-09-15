module.exports = ctx => ctx;
// const path = require('path');
// const fs = require('fs');
// const moment = require('moment');
// const targz = require('tar.gz');


// module.exports = async function commandNodePack(ctx){
//     LOG_FUNC(arguments, __filename);

// 	if(ctx.from.id == ctx.owner){
// 		let read = targz().createReadStream(path.join(global.DIR));
//         let write = fs.createWriteStream(path.join(global.DIR, '..', ctx.username+'.tar'));
//         write.on('finish', async function packIsFinished(){
//             LOG_FUNC(arguments, __filename);
//             ctx.replyWithDocument(
//                 {
//                     source: fs.createReadStream(path.join(global.DIR, '..', ctx.username+'.tar')),
//                     filename: ctx.username+'.tar'
//                 }, {
//                     caption: moment().format('YYYY.MM.DD HH:mm:ss')
//                 })
//         });
//         read.pipe(write);
//         return ctx;
// 	}
    
//     ctx.reply('Я не занаю такой команды');
//     //, {
//       //      reply_markup: {
//         //        inline_keyboard: 
//           //          [[{
//             //            text: 'ℹ', callback_data: 'a'
//               //      }]]
//            // }
//         //}
    
// 	return ctx;
// };