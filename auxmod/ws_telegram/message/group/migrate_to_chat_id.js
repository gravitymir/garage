let path = require('path');
let Db = require(path.join(process.env.DIR, 'auxmod', 'mongodb'));
let inspect = require('util').inspect;
require('colors');

module.exports = async function migrate_to_chat_id(ctx){
    LOG_FUNC(arguments, __filename);

    return ctx;
}