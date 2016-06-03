
module.exports = function(app) {
	app.get('/warehouse/names', function(req, res, next) {
		var warehouse = app.get('warehouse');console.log(warehouse);
		var condition = {};
		var fields = {};
		condition.where ={};
		fields = {'_id':0,'Warehouse_ID':1, 'Warehouse_Name':1, 'Warehouse_Type':1};

				warehouse.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(results);								
						}
					});
	});

	app.get('/itemmaster/names', function(req, res, next) {
		var item = app.get('item');
		var condition = {};
		var fields = {};
		condition.where ={};
		fields = {'_id':0,'Item_ID':1,'Item_Description':1};

				item.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(results);								
						}
					});
	});		
}