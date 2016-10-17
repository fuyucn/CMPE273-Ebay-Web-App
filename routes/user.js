
var ejs = require("ejs");
var mysql = require('./mysql');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  var myID;
  if (!req.param("id"))
  {
    myID =req.session.uid;
  }
  else {
    myID = req.param("id");
  }

  if(req.session.uid==myID){

    var getUser = "SELECT userid, firstname, lastname FROM users WHERE userid='"+req.session.uid+"';";
  	console.log("Query is:"+getUser);

    var userInfo;
    var sellItems;
    var buyItems;
    mysql.fetchData(function(err,results){
      if(err){
        throw err;
      }
      else
      {
        if(results.length > 0){
          var rows = results;
          var jsonString = JSON.stringify(results);
          userInfo = JSON.parse(jsonString);
          for(var i in userInfo) {
              console.log(userInfo[i].firstname);console.log(userInfo[i].lastname);
          }
          console.log("+++++++Get uinfo success!");
        }else {
          console.log("No users found in database");
        }
      }
    },getUser);


  	var mySell = "SELECT name, price, adID FROM advertisements WHERE sellerID='"+myID+"';";
  	console.log("Query is:"+mySell);

  	mysql.fetchData(function(err,results){
  		if(err){
  			throw err;
  		}
  		else
  		{
  			if(results.length > 0){
  				var rows = results;
  				var jsonString = JSON.stringify(results);
  				sellItems = JSON.parse(jsonString);
          console.log("+++++++Get sellItems success!");

  			}else {
  				console.log("No sells found in database");
  			}
  		}
	  },mySell);

      var myBuy = "select tr.id, tr.itemID,ad.name,ad.price,tr.sellerID,tr.buyerID, u1.FirstName,u1.LastName FROM transactions tr,advertisements ad, users u1, users u2 where tr.buyerID=u1.userID AND tr.sellerID= u2.userID AND ad.adid=tr.itemid AND u1.userID="+req.session.uid+";";
      console.log("Query is:"+myBuy);

      mysql.fetchData(function(err,results){
        if(err){
          throw err;
        } else {
          if(results.length > 0) {
            var rows = results;
            var jsonString = JSON.stringify(results);
            buyItems = JSON.parse(jsonString);
            console.log("+++++++Get buyItems success");

            ejs.renderFile('./views/user.ejs',{sells:sellItems, buys:buyItems, userid:req.session.uid, uinfo:userInfo},function(err, result) {
              // render on success
              if (!err) {
                console.log("++++++++send all data success!");
                console.log(req.session.uid);
                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                res.end(result);
              }
              // render or error
              else {
                  res.end('An error occurred');
                  console.log(err);
              }
            });
          } else {
            console.log("No buys found in database");
            res.render('user', {'sells':sellItems, 'buys':buyItems, 'userid':req.session.uid, 'uinfo':userInfo});
          }
        }
      },myBuy);
    } else {

        res.redirect("/profile/"+myID);
    }
};

exports.profile = function(req,res)
{
  var profileID;
  if (!req.param("id"))
  {
    profileID = req.session.uid;
  }
  else {
    profileID = req.param("id");
  }

	console.log("start profile");
  if(profileID){
    var getUser = "SELECT userid, firstname, lastname, email,location FROM users WHERE userid="+profileID;


    mysql.fetchData(function(err,results){
      console.log("start mysql");
      if(err){
        throw err;
      }
      else
      {
        if(results.length > 0){
          var rows = results;
          var jsonString = JSON.stringify(results);
          var userInfo = JSON.parse(jsonString);
          console.log("+++++++Get uinfo success!");
          res.render('profile', {'userid':req.session.uid, 'profileID':profileID,'uinfo':userInfo});
        }else {
          console.log("No users found in database");
          window.alert("No User's Information found!")
          res.redirect('/');
        }
      }
    },getUser);
  }else{
    console.log("get profileID error");
    res.redirect('/');
  }
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	console.log("start logout");
	req.session.destroy();
	res.redirect('/');
};
