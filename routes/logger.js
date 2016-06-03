
var log4js = require('log4js');
log4js.configure({
appenders: [
   { type: 'console' },
   { type: 'file', filename: "C:/logs/test.log", category: 'ContentManagement' },
   { type: 'file', filename: "C:/logs/test.log", category: 'InventoryManagement'}
  ]
});

var logger  = log4js.getLogger('ContentManagement');
	logger.setLevel('ERROR');
Object.defineProperty(exports, "LOG", { value:logger, });

var ilogger  = log4js.getLogger('InventoryManagement');
	ilogger.setLevel('DEBUG');
Object.defineProperty(exports, "iLOG", { value:ilogger, });