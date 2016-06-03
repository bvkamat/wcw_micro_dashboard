var path = require('path');
var fs = require('fs');
var MailObj = require('./lib/MailObj'); 
var LdapObj = require('./lib/LdapObj'); 
var SqlObj = require('./lib/SqlObj');
var MongooseObj = require('./lib/MongooseObj');
var config = require('config').database;

function configure(app){
	console.log('Calling the Configuration Function');
	console.log(config);
	var dbobj = this.createDBObj(config);
	console.log(dbobj);
}

function createMailObj(options){
	return new MailObj(options);
}

function createLdapObj(options){
	return new LdapObj(options);
}

function createDBObj(options){
	if(options.name=='mysql'){
		return new SqlObj(options);
	}
	else if(options.name=="mongodb"){
		return new MongooseObj(options);	
	}
}

module.exports.configure = configure;
module.exports.createMailObj = createMailObj;
module.exports.createLdapObj = createLdapObj;
module.exports.createDBObj = createDBObj;