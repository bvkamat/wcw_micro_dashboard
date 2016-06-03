
module.exports = function(app) {

		app.get('/categories', function(req, res,next) {
		var Category = app.get('Category');
		var condition = {};
		var fields = null;
		var options = null;
		Category.findAll(condition, fields, options, function(err, result) 
				{ 
				if(err)
					console.log("Error is : " +  err);
				else{
					var results = []
					for(i in result) 
				    results.push(result[i].getValues());
					res.send(results);
					}
				}
		);
	});
}