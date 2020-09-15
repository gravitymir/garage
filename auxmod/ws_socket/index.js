const path = require('path');
const moment = require('moment');
moment.locale("ru");
require('colors');

const ws_url = 'ws://167.71.12.44:9000';

const WebSocket = require('ws');

const authorization_name = 'гараж';
const authorization_secret = '21212122';
const ws_telegram = require(path.join(global.DIR, 'auxmod', 'ws_telegram')).update;

const JSON_validator = function(str_json){
  //LOG_FUNC(arguments, __filename);
  let obj_json = null;

  if (/^[\],:{}\s]*$/.test(str_json.replace(/\\["\\\/bfnrtu]/g, '@').
          replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
          replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
              obj_json = JSON.parse(str_json);
      }
  return obj_json;
}

let client;

function heartbeat(ws) {
    //console.log(moment().format('DD HH:mm:ss') + ' ws ping '.reset + 'OK'.green);
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.isAlive = false;
      this.terminate();
    }, 15000);
}



function connection(){
    client = new WebSocket(ws_url);
 
    client.on('open', function(){
      console.log(`ws is ${'open'.green} ws.readyState: ${client.readyState}`.bgMagenta);
      
        client.isAlive = true;
        send({
          authorization: {
              authorization_secret,
              client_id: authorization_name
          }
        })
    });
    client.on('ping', heartbeat);

    client.on('error', function error() {
        //console.log(`ws ${'error'.red} ws.readyState: ${client.readyState}`);      
    });

    client.on('close', () => {
      //console.log(`ws is ${'close'.yellow} ws.readyState: ${client.readyState}`);
      clearTimeout(this.pingTimeout);
      
      this.isAlive = false;
      setTimeout(() => {
          console.log('ws reconnection');
          connection();
      }, 5000);
      
    });
    client.on('message', function message(message) {
      let obj = JSON_validator(message);
      if(!obj){
        return console.log(obj);
      }
      
      // console.log('\n\n\n');
      // console.log(obj);
      obj.send = send;
      let res = ws_telegram(obj)
      //console.log(message);
      //console.log(res.reqInfo);
      
      //obj.reply(message);
    });
}

function send(obj){
  // console.log(client);
  // console.log(client.isAlive);
  // console.log(client.readyState);
  
  
  
  //console.log(obj);


 //console.log('websocket -> '.green, obj.chat_id + ' -> ', obj.message);
    if(client && client.readyState === 1 && client.isAlive){
        //console.log('ws send: '.green, obj)
        client.send(JSON.stringify(obj));
    }else{
        /*onsole.log('not send'.red,
            client,
            client.readyState,
            client.isAlive
        )*/
    }
}

function fff(){
  console.log('send-------------------------------------------------')
  send({
    telegram: {
        type: 'sendMessage',
        chat_id: -366271163,//-345034533,
        text: `<code>Test</code>`,
        opt: {
            disable_notification: false,
            disable_web_page_preview: true,
            parse_mode: 'HTML'
            //reply_markup: [Object]
        }
    }
})
}
//setInterval(fff, 10000)
connection();

module.exports.send = send;