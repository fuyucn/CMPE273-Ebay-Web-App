
/*
 * GET home page.
 */
var ejs = require("ejs");
var mysql = require('./mysql');
// get item from mysql and show
function getItemById(req,res){
	var itemID = req.param("id");
	console.log("id:"+itemID);
	var getItem = "SELECT ad.adid, ad.name, ad.detail, ad.price, ad.quantity, ad.location, ad.sellerid, users.firstname, users.lastname FROM advertisements ad INNER JOIN users ON ad.sellerid = users.userid WHERE ad.adID="+itemID+";";

	console.log("Query is:"+getItem);

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
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				ejs.renderFile('./views/item.ejs',{data:jsonParse,userid:req.session.uid},function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
                  console.log(result[0].userid);
			        }
			        // render or error
			        else {
			            //res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}else {
				console.log("No users found in database");
				res.render('index', { data:'', userid:req.session.uid });
			}
		}
  },getItem);
};

exports.index=getItemById;
