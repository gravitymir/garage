module.exports = async function groupNewChatTitle(ctx){

  ctx.reqInfo.new_chat_title = String(ctx.message.new_chat_title).cyan;
  
  return ctx;
};