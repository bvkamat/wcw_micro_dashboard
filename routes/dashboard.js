
module.exports = function(app) {

	app.get('/dashboard/widgets/', function(req, res, next) {
		var dashboard = app.get('dbmaster');
		var condition = {};
		var fields = {};
		condition.where ={};  
		fields = 
					{'_id':0,'Title':1};

				dashboard.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
				});
	});		
	app.get('/dashboard/widgetlist/', function(req, res, next) {
		var dashboard = app.get('dbmaster');
		var condition = {};
		var fields = {};
		condition.where ={};  
		fields = 
					{'_id':0};

				dashboard.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
				});
	});		
	app.get('/dashboard/templates/', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var condition = {};
		var fields = {};
		condition.where ={};  
		fields = 
					{'_id':0,'templatename':1};

				dashboard.find(condition,fields,null,function(err,result){ 
					if(err)
						console.log("Error is : " +  err);
					else{
						var results = [];
						for(i in result){						
					    	results.push(result[i]);
					    }
						res.send(result);								
						}
				});
	});		
	app.get('/dashboard/templatedetails/:templatename', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var templatename = req.params.templatename;
		var condition = {};
		var fields = {};
		condition.where ={"templatename":{$eq:templatename}};  
		fields = 
					{'_id':0,'widgets':1};
		//console.log("condition "+JSON.stringify(condition));			
		dashboard.find(condition,fields,null,function(err,result){ 
			if(err)
				console.log("Error is : " +  err);
			else{
				var dbmaster = app.get("dbmaster");
				var widget;
				var wids = result[0].instance.widgets; 
				var result_modified = [];
				condition.where={};
					condition.where = {"Title":{$in:wids}}; 	
					fields = {'_id':0};
					dbmaster.find(condition,fields,null,function(err,reslt){
							if(err)
								console.log("Error is : " +  err);
							else {
								console.log(" result "," ",JSON.stringify(reslt[0]));
								var x=JSON.parse(JSON.stringify(reslt));
								for (m in x)
									result_modified.push({"Title":x[m].instance.Title,"ChartType":x[m].instance.ChartType,"Controls":x[m].instance.Controls,"Multi_Axis":x[m].instance.Multi_Axis})	;
									res.send(result_modified);																
							}
					})
			}
		});
	});	
	app.post('/dashboard/templatesave/', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var condition = {};
		condition = {templatename:req.body.templatename};
		var attributes = {}
		attributes = {widgets: req.body.widgets}; console.log("widgets "+attributes);
		
		console.log("condition "+JSON.stringify(condition));

		dashboard.update(condition,attributes,function(err,result){ 
			if(err)
				next(err);
			else {
				res.send(result);
			}
		});
	});			
	app.post('/dashboard/templatecreate/', function(req, res, next) {
		console.log("inside create");
		var dashboard = app.get('dashboard');
		var attributes = {}
		attributes = {templatename:req.body.templatename, widgets: req.body.widgets}; console.log("template is "+attributes);
		
		console.log("condition "+JSON.stringify(attributes));

		dashboard.save(attributes,function(err,result){ 
			if(err){
			console.log(err+"error");
				next(err);}
			else {
				res.send(result);
			}
		});
	});	
	app.delete('/dashboard/remove/:templatename', function(req, res, next) {
		var dashboard = app.get('dashboard');
		var templatename = req.params.templatename;
		var condition = {};
		var fields = {};
		condition.where ={"templatename":{$eq:templatename}};  
		fields = {};
		dashboard.delete(condition,fields,null,function(err,result){ 
			if(err)
				console.log("Error is : " +  err);
			else{
				res.send(result);
			}
		});
	});			
	app.get('/dashboard/chartdata/:chartlabel', function(req, res, next) {
		var chartlabel = req.params.chartlabel; console.log(getmodelname(chartlabel));
		var chart = app.get(getmodelname(chartlabel));
		var condition = {};
		var fields = {};
		fields = getchartfields(chartlabel); console.log(fields);
		condition.where =getcondition();  
		
		if(chartlabel == "Wave"){
			chart.find(condition,fields,null,function(err,rslt){
				var key = "";
				var map = [];
                var x1 = [], x2 = [], x3 = [];				
				var entryfound;
				var result = JSON.parse(JSON.stringify(rslt));
				for(i in result){
					entryfound = 0;
					key = result[i].instance.Wave_Number; console.log(key); //console.log("map - before "+JSON.stringify(map));	
					console.log("length of map "+map.length);
					for (j in map){
					 var temp =  map[0].values[0].label;
					 //console.log(" kkkkkkkkkkkkk "+j+" "+temp);
						if (key == temp){
							map[0].values[j].value++;
							if (result[i].instance.End_Date != null ) map[1].values[j].value++;
							if (result[i].instance.Pick_Quantity < result[i].instance.Ord_Quantity ) map[2].values[j].value++;//red color for this in UI
							entryfound = 1;
							//console.log("map 2nd "+JSON.stringify(map));
							break;		
						}
					}
					var End_Date_Flag, Order_Qty_Flag = 0;
					if (entryfound == 0){
						if (result[i].instance.End_Date != null ) End_Date_Flag = 1;
						if (result[i].instance.Pick_Quantity < result[i].instance.Ord_Quantity ) Order_Qty_Flag = 1;
							
               				x1.push({"label":key,"value":1}); //console.log(JSON.stringify(x1)+" x1");
               				x2.push({"label":key,"value":0}); //console.log(JSON.stringify(x2)+" x2");
               				x3.push({"label":key,"value":0}); //console.log(JSON.stringify(x3)+" x3");               				               				

							map=[{"key":"Total","values":x1},{"key":"Completed","values":x2},{"key":"Short Pick","values":x3}];		

                      console.log("map ist time "+JSON.stringify(map));									 
					}
				}
					//console.log(JSON.stringify(map)+"map");				
				res.send(map);
			});
		}else if(chartlabel == "Perfect Shipments"){
			var response = [];
			var today_wave1 = new Date("2016-09-12T06:00:00"); var hourlyValues1 = [0,0,0,0,0,0,0,0];
			var today_wave2 = new Date(2016,00,25,14); var hourlyValues2 = [0,0,0,0,0,0,0,0];
			var today_wave3 = new Date(2016,00,25,20); var hourlyValues3 = [0,0,0,0,0,0,0,0];
			condition.where = {};//{Order_line:{$elemMatch:{Order_Line_Modified:{$gt:today_wave1,$lt:new Date(today_wave1.getTime()+9*60*60*1000)}}}};
			chart.find(condition,fields,null,function(err,result){
				if(err)
					console.log("Error is Wave1: " +  err);
				else{
					response.push({"key":"Shift1","values":generateWaveData(result,hourlyValues1)});
						//console.log("W1 "+JSON.stringify(response));
					condition.where = {'Order_line.Order_Line_Modified':{$gt:today_wave2,$lt:new Date(today_wave2.getTime()+8*60*60*1000)}};		
					chart.find(condition,fields,null,function(err,result){ 
						if(err)
							console.log("Error is Wave2: " +  err);
						else{
							response.push({"key":"Shift2","values":generateWaveData(result,hourlyValues2)});
							//	console.log("W1-2 "+JSON.stringify(response));
							condition.where = {'Order_line.Order_Line_Modified':{$gt:today_wave3,$lt:new Date(today_wave3.getTime()+8*60*60*1000)}};
							chart.find(condition,fields,null,function(err,result){ 
								if(err)
									console.log("Error is Wave3: " +  err);
								else{
									response.push({"key":"Shift3","values":generateWaveData(result,hourlyValues3)});
							//			console.log("W1-2-3 "+JSON.stringify(response));
									//res.send(response);
									res.send([{"key":"Shift1","values":[[1,95],[2,98],[3,96],[4,97],[5,98],[6,94],[7,96],[8,95]]},{"key":"Shift2","values":[[1,98],[2,94],[3,96],[4,97],[5,98],[6,95],[7,96],[8,98]]},{"key":"Shift3","values":[[1,93],[2,98],[3,99],[4,96],[5,97],[6,94],[7,96],[8,97]]}]);
								}		
							});
						}
					});
				}
			});
		}else if(chartlabel == "Packing"){
			/*chart.find(condition,fields,null,function(err,rslt){
				var key = "";
				var map = [];
                var x1 = [], x2 = [], x3 = [];				
				var entryfound;
				var result = JSON.parse(JSON.stringify(rslt));
				for(i in result){
					entryfound = 0;
					key = result[i].instance.Wave_Number; console.log(key); //console.log("map - before "+JSON.stringify(map));	
					console.log("length of map "+map.length);
					for (j in map){
					 var temp =  map[0].values[0].label;
					 //console.log(" kkkkkkkkkkkkk "+j+" "+temp);
						if (key == temp){
							map[0].values[j].value++;
							if (result[i].instance.End_Date != null ) map[1].values[j].value++;
							if (result[i].instance.Pick_Quantity < result[i].instance.Ord_Quantity ) map[2].values[j].value++;//red color for this in UI
							entryfound = 1;
							//console.log("map 2nd "+JSON.stringify(map));
							break;		
						}
					}
					var End_Date_Flag, Order_Qty_Flag = 0;
					if (entryfound == 0){
						if (result[i].instance.End_Date != null ) End_Date_Flag = 1;
						if (result[i].instance.Pick_Quantity < result[i].instance.Ord_Quantity ) Order_Qty_Flag = 1;
							
               				x1.push({"label":key,"value":1}); //console.log(JSON.stringify(x1)+" x1");
               				x2.push({"label":key,"value":1}); //console.log(JSON.stringify(x2)+" x2");
               				x3.push({"label":key,"value":1}); //console.log(JSON.stringify(x3)+" x3");               				               				

							map=[{"key":"Total","values":x1},{"key":"End_Date_not_Null","values":x2},{"key":"Order_Complete","values":x3}];		

                      console.log("map ist time "+JSON.stringify(map));									 
					}
				}
					//console.log(JSON.stringify(map)+"map");				
				res.send(map);
			});		*/	
			//res.send([{"key":"Ordered","values":[{"label":1,"value":10},{"label":2,"value":15},{"label":3,"value":7},{"label":4,"value":10}]},{"key":"Shipped","values":[{"label":1,"value":6},{"label":2,"value":13},{"label":3,"value":3},{"label":4,"value":3}]}]);
			res.send([{"key":"Work Order","values":[{"label":999,"value":10},{"label":1000,"value":15}]},{"key":"Packed","values":[{"label":999,"value":9},{"label":10000,"value":8}]}]);

		}else if(chartlabel == "Pick Rate"){
			/*var response = [];
			var today_bulk = new Date("2016-09-12T06:00:00"); var hourlyValues1 = [0,0,0,0,0,0,0,0];
			var today_case = new Date(2016,00,25,14); var hourlyValues2 = [0,0,0,0,0,0,0,0];
			var today_each = new Date(2016,00,25,20); var hourlyValues3 = [0,0,0,0,0,0,0,0];

			condition.where = {};//{Order_line:{$elemMatch:{Order_Line_Modified:{$gt:today_wave1,$lt:new Date(today_wave1.getTime()+9*60*60*1000)}}}};
			chart.find(condition,fields,null,function(err,result){
				if(err)
					console.log("Error is Bulk: " +  err);
				else{
					response.push({"key":"Bulk","values":generateWaveData(result,hourlyValues1)});
						//console.log("W1 "+JSON.stringify(response));
					condition.where = {'Order_line.Order_Line_Modified':{$gt:today_wave2,$lt:new Date(today_wave2.getTime()+8*60*60*1000)}};		
					chart.find(condition,fields,null,function(err,result){ 
						if(err)
							console.log("Error is Case: " +  err);
						else{
							response.push({"key":"Case","values":generateWaveData(result,hourlyValues2)});
							//	console.log("W1-2 "+JSON.stringify(response));
							condition.where = {'Order_line.Order_Line_Modified':{$gt:today_wave3,$lt:new Date(today_wave3.getTime()+8*60*60*1000)}};
							chart.find(condition,fields,null,function(err,result){ 
								if(err)
									console.log("Error is Each: " +  err);
								else{
									response.push({"key":"Each","values":generateWaveData(result,hourlyValues3)});
							//			console.log("W1-2-3 "+JSON.stringify(response));
									res.send(response);										
								}		
							});
						}
					});
				}
			})*/
			res.send([{"key":"Each","values":[[0,25],[1,60],[2,100],[3,75],[4,75],[5,75],[6,50],[7,75]]},{"key":"Case","values":[[0,20],[1,75],[2,90],[3,75],[4,85],[5,80],[6,78],[7,80]]},{"key":"Bulk","values":[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]}]);	
		}else if(chartlabel == "Goods in Rate & Pallets Received"){
			res.send([{"key":"Pallets","values":[[15,34524],[16,35385],[17,35598],[18,35164],[19,35517],[20,33795],[21,35007],[22,34461],[23,36606],[24,36163],[25,30231],[26,33312],[27,34404]]},{"key":"Pallets Per Hour","values":[[15,28.0],[16,27.8],[17,29.0],[18,29.5],[19,27.5],[20,27.7],[21,26.4],[22,27.0],[23,27.7],[24,28.6],[25,27.4],[26,29.8],[27,29.5]]}]);
		}else if(chartlabel == "Weekly - Supplier Turnaround & FTAs"){
			res.send([{"key":"Failed TO Arrive Cases","values":[[15,6573],[16,2923],[17,3686],[18,3661],[19,1821],[20,2539],[21,4277],[22,10401],[23,9624],[24,6329],[25,5919],[26,6980],[27,9769]]},
{"key":"Turnaround Time","values":[[15,66],[16,66],[17,68],[18,64],[19,72],[20,71],[21,74],[22,70],[23,73],[24,61],[25,66],[26,74],[27,67]]}]
);
		}else if(chartlabel == "Daily - Supplier Turnaround & FTAs"){
			res.send([{"key":"Failed TO Arrive Cases","values":[[1,657],[2,292],[3,368],[4,366],[5,182],[6,253],[7,427],[8,1040],[9,962],[10,632],[11,591],[12,698],[13,976],[14,591],[15,632],[16,962],[17,1040],[18,427],[19,253],[20,182],[21,366],[22,368],[23,292],[24,657]]},
{"key":"Turnaround Time","values":[[1,66],[2,66],[3,68],[4,64],[5,72],[6,71],[7,74],[8,70],[9,73],[10,61],[11,66],[12,74],[13,67],[14,62],[15,63],[16,62],[17,72],[18,69],[19,62],[20,70],[21,66],[22,68],[23,61],[24,65]]}]
);
		}else if(chartlabel == "Putaway,Replishment & Performance"){
			res.send( [{"key":"OverAll Perfomance","values":[[15,98.9],[16,101.1],[17,100.7],[18,99.4],[19,98.6],[20,100.3],[21,100.3],[22,101.7],[23,98.0],[24,103.1],[25,105.2],[26,105.5],[27,103.3]]},
{"key":"Replenishment","values":[[15,10.7],[16,10.7],[17,10.5],[18,10.6],[19,10.2],[20,11.0],[21,10.7],[22,11.1],[23,10.6],[24,11.1],[25,11.4],[26,11.3],[27,11.3]]},
{"key":"Putaway","values":[[15,16.0],[16,15.5],[17,15.0],[18,14.4],[19,13.9],[20,14.1],[21,14.1],[22,15.0],[23,14.8],[24,16.3],[25,16.1],[26,17.1],[27,16.3]]}]);
		}else if(chartlabel == "Performance & Pick Rate"){
			res.send([{"key":"Performance","values":[[15,99.4],[16,97],[17,96],[18,95.6],[19,94.4],[20,95.6],[22,95.5],[23,97.4],[24,96.6],[25,100.5],[26,102.3],[27,101.5],[28,99.8]]},{"key":"Pick Rate","values":[[15,217.1],[16,215.8],[17,206.1],[18,203.9],[19,193.2],[20,189.6],[21,197.4],[22,196.3],[23,200.6],[24,211],[25,211],[26,211.9],[27,210]]}]);
		}else if(chartlabel == "Shift - Goods in Rate & Pallets Received"){
			res.send([{"key":"Pallets Per Hour","values":[[8,28],[9,27.8],[10,29],[11,29.5],[12,27.5],[13,27.7],[14,26.4],[15,27],[16,27.7],[17,28.6],[18,27.4],[19,29.8],[20,29.5]]},{"key":"Pallets","values":[[8,16.5],[9,31.875],[10,35.67],[11,27.92],[12,34.23],[13,3.48],[14,1.52],[15,25.125],[16,53.67],[17,45.76],[18,39.83],[19,94.85],[20,14.57]]}]);
		}else if(chartlabel == "Shift - Putaway,Replishment & Performance"){
			res.send([{"key":"OverAll Perfomance","values":[[8,98.9],[9,101.1],[10,100.7],[11,99.4],[12,98.6],[13,100.3],[14,100.3],[15,101.7],[16,98],[17,103.1],[18,105.2],[19,105.5],[20,103.3]]},{"key":"Replishment","values":[[8,10.7],[9,10.7],[10,10.5],[11,10.6],[12,10.2],[13,11],[14,10.7],[15,11.1],[16,10.6],[17,11.1],[18,11.4],[19,11.3],[20,11.3]]},{"key":"Putaway","values":[[8,16],[9,15.5],[10,15],[11,14.4],[12,13.9],[13,14.1],[14,14.1],[15,15],[16,14.8],[17,16.3],[18,16.1],[19,17.1],[20,16.3]]}]);
		}else if(chartlabel == "Perfect Order"){
			res.send([{"key":"Perfect Order","values":[[15,95.5],[16,96],[17,95],[18,97],[19,97.34],[20,97.5],[21,96.78],[21,97.8]]}]);
		}else{
			chart.find(condition,fields,null,function(err,rslt){ 
				if(err)
					console.log("Error is : " +  err);
				else{
					//send back the status and the count of individual statuses
					var map = [];
					var key = "";
					var obj = {};
					var entryfound;	
					var result = JSON.parse(JSON.stringify(rslt));		
					for (count in result) {
						entryfound = 0;
						key = result[count].instance.Status; console.log ("Key "+key);
						for (entry in map){
							console.log("map[entry].Status ", map[entry].Status)
							if(key == map[entry].Status) {
								obj = map[entry].Count++;
								entryfound = 1;
								break;
					        }
					    }
					    if (entryfound == 0) {
					        	obj = {"Status":key, "Count":1};
					        	map.push(obj); 
					    }
				    }
				   	res.send(map);				
				}
			})
		}
	});	
	function generateWaveData(data,hourlyValues){
		var reslt = JSON.parse(JSON.stringify(data));
		var valueArray = [];
		var totalEntries = [0,0,0,0,0,0,0,0];
		for (u in reslt){
			var oLines = reslt[u].instance.Order_line;
			var hourIs = 0;
			for (lines in oLines){
				hourIs = new Date(oLines[lines].Order_Line_Modified).getHours(); console.log("hourIs "+hourIs);
				if (oLines[lines].Ordered_QTY == oLines[lines].Shipped_Qty){
					hourlyValues[hourIs-6]=hourlyValues[hourIs-6]+1;	
					console.log("\n"+hourlyValues);
				}
				totalEntries[hourIs-6]=totalEntries[hourIs-6]+1;
				console.log("\n"+totalEntries);
			}
		}
		for(j in totalEntries) valueArray.push([parseInt(j),hourlyValues[j] != 0 ? hourlyValues[j]/totalEntries[j]*100:0]);
		return valueArray;
	};
	function generatePickRateData(data,hourlyValues){
		var reslt = JSON.parse(JSON.stringify(data));
		var valueArray = [];
		var totalEntries = [0,0,0,0,0,0,0,0];
		for (u in reslt){
			var oLines = reslt[u].instance.Order_line;
			var hourIs = 0;
			for (lines in oLines){
				hourIs = new Date(oLines[lines].Order_Line_Modified).getHours(); console.log("hourIs "+hourIs);
				hourlyValues[hourIs-6]=hourlyValues[hourIs-6]+oLines[lines].Ordered_QTY;	
				console.log("\n"+hourlyValues);
				totalEntries[hourIs-6]=totalEntries[hourIs-6]+1;
				console.log("\n"+totalEntries);
			}
		}
		for(j in totalEntries) valueArray.push([parseInt(j),hourlyValues[j] != 0 ? hourlyValues[j]/totalEntries[j]*100:0]);
		return valueArray;
	};	
	function getmodelname(label){
		switch(label) {
 	  	    case "ASN":
        		return "asn";
            	break;
		    case "Purchase Orders":
		        return "po";
		        break;
		    case "Replenishment":
		        return "repltask";
		        break;
		    case "Putaway":
		        return "puttask";
		        break;
		    case "Wave":
		        return "picktask";
		        break;
		    case "Perfect Shipments":
		        return "order";
		        break;
		    case "Order":
		    case "Units Shipped":
		        return "order";
		        break;
		    case "Pick Rate":
		        return "picktask";
		        break;		        
		    case "Put":
		        return "puttask";
		        break;								
		}
	}
	function getcondition(label){
		switch(label) {
		    case "Perfect Shipments":
		    case "Units Shipped":
		        return {'Order_line.Order_Line_Modified':{$eq:new Date(2016,1,24)}};
		        break;
		    default:
  		        return {};
		        break;
		}
	}
	function getchartfields(label){
		switch(label) {
		    case "Wave":
		        return {'_id':0,'Wave_Number':1, 'End_Date':1, 'Pick_Quantity':1, 'Ord_Quantity':1};
		        break;
		    case "Perfect Shipments":
		    case "Units Shipped":
		        return {'_id':0,'Order_line.Shipped_Qty':1, 'Order_line.Ordered_QTY':1, 'Order_line.Order_Line_Modified':1};
		        break;
		    case "Pick Rate":
		        return {'_id':0,'Pick_Quantity':1, 'Ord_Quantity':1, 'Pick_Type':1};
		        break;		        		        
		    default:
  		        return {'_id':0,'Status':1};
		        break;
		}
	}
	/*function process(label,result){
		switch(label) {
		    case "Wave":{
		    	for (i in result){

		    	}	
		    }
		    break;
		    default:
		    	break;
		}
	}*/
	/*	function getHourofDay(date){
		var hour = date.getHours();
		hour >= 12 ? (hour = hour-12) : hour;

		console.log("HOUR of THE DAY IS "+hour);
	}
	*/			
}