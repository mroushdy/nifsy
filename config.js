var config = {}
config.facebook = {};
config.web = {};

process.env.NODE_ENV = (typeof(process.env.NODE_ENV) !== 'undefined') ? process.env.NODE_ENV : 'development';

switch(process.env.NODE_ENV){
    case 'development':
        //abcde
    case 'production':
        //abcde
    default:
        //abcde
}

config.facebook.appid = '145309202292977';
config.facebook.appsecret =  '6e77cc90af28863b24732685d53f6dd9';
config.web.url = 'http://localhost:3000';
config.db = {
	db: 'nifsy',
	host: 'localhost'
};

config.cookie_secret = 'keyboardcat';

module.exports = config;