
var ejs = require("ejs");
var mysql = require('./mysql');

//add item into carts
exports.addToCarts = function(req,res)
{
    if(!req.session.uid)
    {
      var json_responses = {"statusCode" : 400};
      res.send(json_responses);
    }
    else {
      var carts = req.session.carts || [];
      var cartsize =carts.length;
      var adid = req.param("adid");
      var name = req.param("name");
      var price = req.param("price");
      var sellerid = req.param("sellerid");
      console.log(cartsize);
      if (carts.push({"cartid":cartsize,"adid": adid, "name":name, "price":price, "sellerid":sellerid})){
          console.log("add success");
      }
      else {
          console.log("add not success");
      }

      req.session.carts=carts;
      for( var i in req.session.carts){
        console.log(req.session.carts[i].name);
        console.log(req.session.carts[i].adid);
        console.log(req.session.carts[i].price);
        console.log(req.session.carts[i].sellerid);
      }

      var json_responses = {"statusCode" : 200, "carts":req.session.carts};
      res.send(json_responses);
    }
}

// redirect to cart page
exports.cartspage = function(req,res)
{
  var empty;
  if (req.session.uid){
    if (req.session.carts){
        for(var i in req.session.carts){
            console.log(req.session.carts[i]);
        }
        empty = false;
        var nullCount = 0;
        for( var i in req.session.carts)
        {
          if (req.session.carts[i]==null)
            nullCount++;
        }
        if (nullCount == req.session.carts.length)
        {
          empty=true;
        }
        res.render('carts', { 'data':req.session.carts, 'userid':req.session.uid,'empty':empty });

      /*ejs.renderFile('./views/carts.ejs',{data:req.session.carts, userid:req.session.uid},function(err, result) {
            // render on success
            if (!err) {
                res.end(result);
                console.log(result[0].adid);
            }
            // render or error
            else {
                //res.end('An error occurred');
                console.log(err);
            }
        });*/
    }
    else{
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      res.render('carts', { 'data':req.session.carts, 'userid':req.session.uid,'empty':empty });
    }
  }else{
      res.redirect('/');
  }
}

//delitem from carts
exports.delFromCarts = function(req,res)
{
  var itemID = req.param("id");
  if (req.session.uid)
  {
    if (req.session.carts){
      //req.session.carts.splice(itemID,1);
      delete req.session.carts[itemID];
    }
    res.redirect('/carts');
  }else{
    res.redirect("/");
  }

}

//redirect to pay
exports.payPage = function(req,res)
{
  res.render('payPage', { });
}


//delitem from carts
exports.submitCarts = function(req,res)
{
  var json_responses;
  if(req.session.uid && req.session.carts){
    console.log(req.session.carts);
    for(var i in req.session.carts)
    {
      if (req.session.carts[i]!=null){
          var updateItem = "UPDATE advertisements SET quantity=(quantity-1) WHERE adid ="+req.session.carts[i].adid+";"
          var payCarts = "INSERT INTO transactions (sellerID, buyerID,itemID) VALUES ("+req.session.carts[i].sellerid+","+req.session.uid+","+req.session.carts[i].adid+");";
          mysql.fetchData(function(err,results){
            if(err){
              console.log("UPDATE advertisements fail");
              throw err;
            }
            else {
              mysql.fetchData(function(err,results){
                if(err){
                  throw err;
                }
                else {

                }
              },payCarts);
            }
          },updateItem);

          console.log("Query is:"+payCarts);
      }
    }
    delete req.session.carts;
    json_responses = {"statusCode" : 200,"uid":req.session.uid};
    res.send(json_responses);

  }
  else {
    json_responses = {"statusCode" : 401};
    res.send(json_responses);
  }

}
