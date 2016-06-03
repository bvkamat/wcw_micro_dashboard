/**
 * Charts Calls file
 */
module.exports = function(app) {
	
	app.get('/Charts/quantity/site', function(req, res, next) {
		
		var Quantity = app.get('Quantity');
		var Site = app.get('Site');
		var db = app.get('db');
		var condition = {};
		var fields = {attributes: ['site_id', [db.fn('sum',db.col('quantity')),'y']], group: ['quantity.site_id']};
		var options = null;

		Quantity.findAll(condition,fields,options,function (err,result) {
			var sitequantarray = [];
			var siteidarray = [];
			for(i in result){
				sitequantarray.push(result[i].getValues());
				siteidarray.push(result[i].get('site_id'));
			}
			Site.findAll({where: {id : siteidarray}},null,null,function(err,data){
				for(i in result){
					var obj = data[i].getValues();
					sitequantarray[i].name = obj.name;
					}
				res.send(sitequantarray);
				}				
			);			
		});	
	});
	
	app.get('/Charts/quantity/category', function(req, res, next) {
		
		var site_name = req.query.sitename;
		var Category = app.get('Category');
		var Quantity = app.get('Quantity');
		var Site = app.get('Site');
		var db = app.get('db');
		var condition = {where : {name: site_name} };
		var fields = {attributes: ['category_id',[db.fn('sum',db.col('quantity')),'y']], group: ['quantity.category_id']};
		var options = null;
		
		Site.find(condition,null,function(err,site){
			condition = {where : {site_id: site.get('id')} };
			Quantity.findAll(condition,fields,options,function (err,quantities) {
				var sitequantarray = [];
				var categoryidarray = [];
				for(i in quantities){
					sitequantarray.push(quantities[i].getValues());
					categoryidarray.push(quantities[i].get('category_id'));
				}
				Category.findAll({where: {id : categoryidarray}},null,null,function(err,categories){
					for(i in categories){
						var obj = categories[i].getValues();
						sitequantarray[i].name = obj.name;
						}
					res.send(sitequantarray);
					}				
				);			
			});
		});
	});
	
	app.get('/Charts/quantity/subcategory', function(req, res, next) {
			
		var category_name = req.query.categoryname;	
		var site_name = req.query.sitename;
		var SubCategory = app.get('SubCategory');
		var Category = app.get('Category');
		var Quantity = app.get('Quantity');
		var Site = app.get('Site');
		var db = app.get('db');
		var condition = {where : {name: site_name} };
		var fields = {attributes: ['subcategory_id',[db.fn('sum',db.col('quantity')),'y']], group: ['quantity.subcategory_id']};
		var options = null;
		
		Category.find({where:{name:category_name}},null,function(err,category){			
			SubCategory.findAll({where: {category_id : category.get('id')}},null,null,function(err,subcategories){				
				var quantsubcatlist = [];
				var subcatidlist = [];
				for(i in subcategories){
					quantsubcatlist.push(subcategories[i].getValues());
					subcatidlist.push(subcategories[i].get('id'));
					}
				Site.find(condition,null,function(err,site){
					condition = {where : {site_id: site.get('id'), subcategory_id: subcatidlist} };
					Quantity.findAll(condition,fields,options,function (err,quantities) {
						var subcatquantarray = [];
						for(i in quantities){
							var obj = quantsubcatlist[i];
							obj.y = quantities[i].get('y');
							subcatquantarray.push(obj);
						}
						res.send(subcatquantarray);
					});
				});
			});
		});
	});

	app.get('/Charts/tweets', function(req, res, next) {

		var Tweet = app.get('Tweet');
		var brand = req.query.brand;
		var tweet_info = {};
		tweet_info.brand = brand;
		tweet_info.tweet_data = []
		Tweet.count({Tweet: {$regex : brand}, Sentiment:'Positive'},function(err,result){
        if (err)
            console.log('error occured in the database');
        else{
        	tweet_info.tweet_data[0] = {};
	        tweet_info.tweet_data[0].y = result;
	        tweet_info.tweet_data[0].name = 'Positive';
		        Tweet.count({Tweet: {$regex : brand}, Sentiment:'Negative'},function(err,result){
		        if (err)
		            console.log('error occured in the database');
		        tweet_info.tweet_data[1] = {};
		        tweet_info.tweet_data[1].y = result;
		    	tweet_info.tweet_data[1].name = 'Negative';
		    	res.send(tweet_info);
	    		});
	    	}
    	});	
	});

}