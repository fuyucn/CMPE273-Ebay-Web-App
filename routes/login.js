
var ejs = require("ejs");
var mysql = require('./mysql');

function setup (req, res){
  res.render('login', { title: 'Ebay - Login' });
};

exports.signin = function(req,res) {
  // check user already exists
  var user = req.param("username");
  var pw = req.param("password");

  console.log("user:"+user+", pw:" +pw+" .try to login!");
  var json_responses;
  if (user == undefined || pw == undefined)
  {
    console.log("login info error");
    var json_responses = {"statusCode" : 401};
    res.send(json_responses);
  }else {
    //encrypt
    var crypto = require('crypto');
    var getUser="select * from users where email='"+ user +"' and password='" + crypto.createHash('md5').update(pw).digest("hex")+"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
      if(err){
        throw err;
      }
      else
      {
        if(results.length > 0){
          console.log("valid Login");
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          req.session.uid=results[0].userID;
          json_responses = {"statusCode" : 200};
          res.send(json_responses);
          console.log("userid: "+req.session.uid+" Logged!");
          //  res.end(result);

        }
        else {
          json_responses = {"statusCode" : 401};
          res.send(json_responses);
        }
      }
    },getUser);
  }
};


exports.index = setup;
