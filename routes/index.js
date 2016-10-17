
/*
 * GET home page.
 */
var ejs = require("ejs");
var mysql = require('./mysql');

function setup (req, res){
	var getAllADs = "select ad.adid, ad.name,ad.detail,ad.price,ad.quantity,ad.sellerid, users.firstname, users.lastname from advertisements AS ad INNER JOIN users ON ad.sellerid = users.userid;";
	console.log("user:"+req.session.uid );
	console.log("Query is:"+getAllADs);

	mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else
	{
		if(results.length > 0){
			var rows = results;
			var jsonString = JSON.stringify(results);
			var jsonParse = JSON.parse(jsonString);

			console.log("Results Type: "+(typeof results));
			console.log("Result Element Type:"+(typeof rows[0].emailid));
			console.log("Results Stringify Type:"+(typeof jsonString));
			console.log("Results Parse Type:"+(typeof jsString));

			console.log("Results: "+(results));
			console.log("Result Element:"+(rows[0].name));
			console.log("Results Stringify:"+(jsonString));
			console.log("Results Parse:"+(jsonParse));
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			ejs.renderFile('./views/index.ejs',{data:jsonParse,userid:req.session.uid},function(err, result) {
						// render on success
						if (!err) {
								res.end(result);
						}
						// render or error
						else {
								//res.end('An error occurred');
								console.log(err);
						}
				});
		}else {
			console.log("No users found in database");

			res.render('index', { data: '',userid:req.session.uid });
			}
		}
	},getAllADs);

}



exports.index=setup;
