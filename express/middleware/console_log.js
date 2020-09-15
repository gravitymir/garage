const moment = require('moment');
const colors = require('colors');

module.exports = async (req, res, next) => {  
	let req_time = new Date();
 
    await next();
   
    let i = {
    	date: moment(req_time).format('YYYY-MM-DD HH:mm:ss.SSS'),
		url: req.originalUrl || req.url || '{not detected url}',
		method: req.method || '{not detected method}',
		ip: req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress ? req.connection.remoteAddress : '{not detected ip}'),
		httpVersio: (req.httpVersionMajor ? req.httpVersionMajor : '{not detected Major}') +
		'.' + (req.httpVersionMinor ? req.httpVersionMinor : '{not detected Minor}'),
		user_agent: req.headers && req.headers['user-agent'] ? req.headers['user-agent'] : '{not detected user_agent}',
		status: res.statusCode ? String(res.statusCode) : '{not detected status}',
		host: req.hostname ? req.hostname : req.headers && req.headers['host'] ? req.headers['host']: '{not detected host}'

	};
	i.status = i.status >= 500 ? i.status.red
        : i.status >= 400 ? i.status.yellow
        : i.status >= 300 ? i.status.cyan
        : i.status >= 200 ? i.status.green
        : i.status.white

    console.log(
    	'requst'.inverse + ' ' +
    	i.status + ' ' +
    	i.method.yellow + ' ' +
    	i.date + ' ' +
    	i.ip.replace(/::ffff:/, '').blue + ' ' +
    	String(new Date - req_time).red + '\n' +
    	//i.httpVersio + ' ' +
    	//i.user_agent + ' ' +
    	i.host.cyan + ' ' +
    	i.url.grey
   	);

};