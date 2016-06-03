module.exports = function(app) {

	app.get('/alert/:facility_id/:func/:alert_id/:alert_type', function(req, res, next) {
		var alert = app.get('alert');
		var facility_id = req.params.facility_id;
		var func = req.params.func;
		var alert_id = req.params.alert_id;
		var alert_type = req.params.alert_type;
		var condition = {};
		condition.where = {};
		var fields = {};
		condition.where.Ack = {$eq:false};  
		if (func != "undefined" && func != "null") condition.where.Function = {$eq:func};
		if (facility_id != "undefined" && facility_id != "null") condition.where.Facility_ID = {$eq:facility_id};
		if (alert_id != "undefined" && alert_id != "null") condition.where.Alert_Id = {$eq:alert_id};
		if (alert_type != "undefined" && alert_type != "null") condition.where.Alert_Type = {$eq:alert_type};

		fields = 
				{'_id':0};

				alert.find(condition,fields,null,function(err,result){ 
				
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = [];
					var critical = [];
					var medium = [];
					var low = [];
					for(i in result){	
						var obj = JSON.parse(JSON.stringify(result[i].instance));
						if (obj.Alert_Type=="Critical") critical.push(result[i].instance);
						if (obj.Alert_Type=="Medium") medium.push(result[i].instance);
						if (obj.Alert_Type=="Low") low.push(result[i].instance);
					}	

					results = critical.concat(medium,low);
					res.send(results);								
					}
				});
	});		
	
	app.post('/alert/:ack',function(req,res,next){
		var alert = app.get('alert');

		var condition = {};
		condition = {Alert_Id:req.body.Alert_ID}; 
		var attributes = {}

		attributes = {Ack: req.params.ack};

		alert.update(condition,attributes,function(err,result){ 
			if(err)
				next(err);
			else {
				res.send(result);
			}
		});
	});

	app.get('/alert/', function(req, res, next) {
		var alert = app.get('alert');
		var condition = {};
		var fields = {};
		condition.where ={};  
		condition.where.Ack = {$eq:false};  

		
		fields = 
				{'_id':0};

				alert.find(condition,fields,null,function(err,result){ 
				
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = [];
					var critical = [];
					var medium = [];
					var low = [];
					for(i in result){	
						var obj = JSON.parse(JSON.stringify(result[i].instance));
						if (obj.Alert_Type=="Critical") critical.push(result[i].instance);
						if (obj.Alert_Type=="Medium") medium.push(result[i].instance);
						if (obj.Alert_Type=="Low") low.push(result[i].instance);
					}	
					
					results = critical.concat(medium,low);
					res.send(results);								
					}				
				});
	});		
	
	app.get('/alert/openalerts', function(req, res, next) {
		var alert = app.get('alert');
		var condition = {};
		var fields = {};
		condition.where ={};  
		condition.where.Ack = {$eq:false};  
		fields = 
				{'_id':0};

				alert.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else
						res.send({"count":result.length});								
				});
	}); 
}


