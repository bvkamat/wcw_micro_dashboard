
	
module.exports = function(app) {
	
	app.get("/login", function (req, res, next) {
		var logger= require('./logger.js');
		var log=logger.LOG;	
		var ilog=logger.iLOG;	
		/*console.log("Entering the login function");
		log.debug("testing the debug log here....................");
		log.error("testing the error log here....................");
		log.info("testing the info log here....................");
		log.warn("testing the warn log here....................");
		log.trace("testing the trace log here....................");
		ilog.debug("testing the debug ilog here....................");
		ilog.error("testing the error ilog here....................");
		ilog.info("testing the info ilog here....................");
		ilog.warn("testing the warn ilog here....................");
		ilog.trace("testing the trace ilog here....................");*/
		
		//if (req.session.username) {
		//	res.render('index')
		//} else {
			res.render('login')
		//}
	});
	
	app.post("/login", function (req, res, next) {
		res.sendStatus(200).json({uName:"BBBBB"});
/*		var name = req.body.name;
		var password = req.body.password;    	  
		var present = false;
		var role = null;
		var siteid = null;
		var client = app.get('ldapclient');
				
		var rootuser = {
				"username" : 'cn=Manager,dc=maxcrc,dc=com',
				"password" : 'secret'	
			};
		
		var myuser = {
				"root" : 'dc=maxcrc,dc=com',
				"opts" : {
					"filter" : '(&(objectclass=inetOrgPerson)(cn=' + name + ')(userPassword=' + password + '))',
					"scope" : 'sub'
				}
		};
		
		client.authenticate(rootuser,myuser, function(err,data){
			if(err)
				next(err);
			else{
				if(data===null)
					res.redirect('/login');
				else{
				req.session.regenerate(function () {
						   req.session.username = name;
						   req.session.role = role;
						   req.session.siteid = siteid;
						   req.session.isAuthenticated = true;
						   res.send(200);
					   });
					res.send(200);
					}
				}
			}
		);*/
	});
	
	app.post("/logout", function (req, res, next) {
		req.session.destroy(function () {
			res.send(200);
		});
	});
	
	app.get("/", function (req, res, next) {
		if(req.session.username){
			res.render('index');
			//res.sendfile('views/index.html')
		}
		else{
			res.render('index');	
			//res.sendfile('views/index.html')
		}
	});
	
	app.get("/operation", function (req, res, next) {
		if(req.session.username){
			res.render('operation');
			//res.sendfile('views/index.html')
		}
		else{
			res.render('operation');	
			//res.sendfile('views/index.html')
		}
	});
};