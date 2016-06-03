
var express = require('express')
   , routes = require('./routes')
   , http = require('http')
   , path = require('path')
   , connection  = require('express-myconnection')
   , favicon = require('express-favicon')
   , bodyParser = require('body-parser')
   , cookieParser = require('cookie-parser')
   , log4js = require('log4js')
   , methodOverride = require('method-override')
   , session = require('express-session')
   , myframework = require('myframework');

var app = express();

app.set('port', process.env.PORT || 3606);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(favicon);

/*app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());*/
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(cookieParser('secret'));
app.use(session({secret:'yoursecret', cookie:{maxAge:10*60*1000}}));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}


app.use(express.Router());
require('./routes/index')(app);
require('./routes/warehouse')(app);
require('./routes/alert')(app);
require('./routes/dashboard')(app);

/*require('./routes/categories')(app);
require('./routes/subcategories')(app);
require('./routes/charts')(app);
require('./routes/vendor')(app);
require('./routes/order')(app);*/


log4js.configure('./config/log4js.json',{});
app.set('logger',log4js);
var logger = log4js.getLogger("app.js");

myframework.configure(app, function(err,data){
  if(err)
    console.log('Error Found');
  else
    {
      console.log(" Callback function is being called ");
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
      });
   }
});

/* http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
*/ 


/*var config = {
    user: 'node',
    password: 'password_1',
    server: '10.200.208.28', // You can use 'localhost\\instance' to connect to named instance 
    database: 'demo',
    port: '53693',    
    /*options: {
       tdsVersion: '7_2',
    }
}*/
 
/*var connection = new sql.Connection(config, function(err) {
    // ... error checks 
    if(err){
      console.log('error' +err);
    }
    else {
      console.log('success');
    // Query 
    
    var request = new sql.Request(connection); // or: var request = connection.request(); 
    request.query('select 1 as number', function(err, recordset) {
        // ... error checks 
        console.dir(recordset);
    });
    
    // Stored Procedure 
    
    var request = new sql.Request(connection);
    request.input('input_parameter', sql.Int, 10);
    request.output('output_parameter', sql.VarChar(50));
    request.execute('procedure_name', function(err, recordsets, returnValue) {
        // ... error checks 
        
        console.dir(recordsets);
    });
    
}});
*/