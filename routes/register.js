
var ejs = require("ejs");
var mysql = require('./mysql');

/*
 * GET register page.
 */
function index(req,res)
{

  if (req.session.uid){
    res.redirect('/');
  }
  else {
    res.render('register', { title: 'Ebay - Login' });
  }

}


 function register(req,res)
 {
   var username= req.param("username");
   var password= req.param("password");
   var firstname= req.param("firstname");
   var lastname= req.param("lastname");
   var location= req.param("location");
   if (username == undefined || password == undefined || firstname == undefined || lastname ==undefined)
   {
     json_responses = {"statusCode" :401, "userid" : req.session.uid};
     res.send(json_responses);
   }else{
     // check user already exists
     var crypto = require('crypto');
     password=crypto.createHash('md5').update(password).digest("hex");

     var regUser="INSERT INTO users (email, password, firstname, lastname,location) VALUES ('"+ username +"','"+ password +"','"+ firstname +"','"+ lastname +"','"+ location +"');"
     console.log("Query is:"+regUser);
     var json_responses;
     mysql.fetchData(function(err,results){
       if(err){
         json_responses = {"statusCode" : 401};
         res.send(json_responses);
         res.end(json_responses);
         throw err;
       }
       else
       {
          res.redirect("/login");
         /*var getUser="SELECT userid FROM users where email = '"+username+"' and password = '"+password+"';"
         console.log("Query is:"+getUser);
         mysql.fetchData(function(err,getUser){
             if(err){
               throw err;
             }
             else
             {
               if(getUser.length > 0){
                 console.log("valid Login");
                 req.session.uid=getUser[0].userid;
                 json_responses = {"statusCode" :200,"userid" : req.session.uid};
                 res.send(json_responses);
                 res.end(json_responses);
               }
               else {
                 console.log("Invalid Login");
                 json_responses = {"statusCode" : 401,"userid":''};
                 res.send(json_responses);
                 res.end(json_responses);
               }
             }
           },getUser);*/
         }
     },regUser);
   }
}

exports.register=register;
exports.index=index;
