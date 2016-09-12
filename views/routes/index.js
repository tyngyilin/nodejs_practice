var express = require('express');
var request = require('request');
var md5 = require('md5');
var url = require('url');
var querystring = require('querystring');

var router = express.Router();

var server = 'http://tyngyilin.mega99.net:8080/agent/index.php/inter/';
var key = 'key=32cf2641f3b38088b2f7ef0866eb719d&time=1464940035';

/* GET home page. */
router.get('/',function(req,res) {

  checkLogin(req,res,function(){
    console.log(req.session.isLogin);
    // checkLogin(req,res,login,function(body){});
    res.render('index',{ title: 'title'});
  });

});

router.get('/getDesk', function(req, res) {
  checkLogin(req,res,function(){
    var getDesk = function (req,res,callback) {
      var url = server+'desk/detail_list'+'?'+key;
      var message = '';
      console.log(url);

      callback(url,function(body){
        console.log(body);
        if(body.code=='1')
        {
          var deskList = body.data;
          res.render('getDesk',{ title : 'Desk List',deskList:deskList, message: message});
        } else {
          message = "wrong operator";
          res.render('getDesk',{ title : 'Desk List', message: message});
        }
      });
    };
    getDesk(req,res,Api);

  });
});
router.get('/userList', function(req, res) {
  // console.log(url.parse(req.url).pathname);
  // console.log(url.parse(req.url).query);
  // console.log(req.query['id']);
  // console.log(req.url);
  // console.log(querystring(req.url)['id']);
  var db = req.db;
  var collection = db.get('usercollection');

  checkLogin(req,res,function(){
    collection.find({}, {}, function (e, docs) {
      // var name = [];
      // var email = [];
      // var objKey = Object.keys(docs);
      // console.log(docs);
      // objKey.forEach(function (objectid) {
      //   var items = Object.keys(docs[objectid]);
      //   // console.log(items);
      //   items.forEach(function (itemkey) {
      //     var itemvalue = docs[objectid][itemkey];
      //     // console.log(objectid + ': ' + itemkey + ' = ' + itemvalue);
      //
      //     if (itemkey == 'username') {
      //       name.push(itemvalue);
      //     }
      //     if (itemkey == 'email') {
      //       email.push(itemvalue);
      //     }
      //
      //   });
      // });
      // // console.log(email);
      // res.render('userList', {
      //   'userList': [{'name': name},{'email': email}]
       res.render('userList', {
        'userList': docs
      });

    });
  });

});
router.get('/deleteUser',function(req, res){
  // console.log(req.query['id']);
  // Set our internal DB variable
  var db = req.db;

  // Set our collection
  var collection = db.get('usercollection');

  checkLogin(req,res,function(){
    var id = req.query['id'];
    // Submit to the DB
    collection.remove({
      "_id" : id
    }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
      }
      else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("userList");
        // And forward to success page
        res.redirect("userList");
      }
    });
  });
});
router.get('/modifyUser',function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');

  checkLogin(req,res,function() {
    var id = req.query['id'];
    console.log(id);
    collection.find({_id: id }, function (e, docs) {
      console.log(docs);
      res.render('modifyUser', {title: 'Modify User',userDetail:docs});
    });
  });
});

router.post('/modifyUser',function(req, res){
  // Set our internal DB variable
  var db = req.db;
  console.log(req.body);
  // Get our form values. These rely on the "name" attributes


  // Set our collection
  var collection = db.get('usercollection');

  checkLogin(req,res,function(){
    var id = req.body.id;
    var userName = req.body.username;
    var Email = req.body.email;
    // Submit to the DB
    collection.update({_id : id },
      { "username" : userName, "email" : Email }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
      }
      else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("userList");
        // And forward to success page
        res.redirect("userList");
      }
    });
  });
});

router.get('/addUser',function(req, res) {
  checkLogin(req,res,function() {
    res.render('addUser', {title: 'Add New User'});
  });
});

router.post('/addUser',function(req, res){
  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var Email = req.body.email;

  // Set our collection
  var collection = db.get('usercollection');

  checkLogin(req,res,function(){
    // Submit to the DB
    collection.insert({
      "username" : userName,
      "email" : Email
    }, function (err, doc) {
      if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
      }
      else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("userList");
        // And forward to success page
        res.redirect("userList");
      }
    });
  });
});

router.get('/userLogin',function(req, res) {
  if(!req.session.isLogin) {
    res.render('userLogin', {title: 'User Login', message: ''});
  } else {
    res.location("userList");
    res.redirect("userList");
  }
});
router.post('/userLogin',function(req, res) {
  var login = function (req,res,callback) {
    var account = req.body.username;
    var password =  req.body.password;
    var api = 'login';
    var url = server+api+'?'+key+'&account='+account+'&password='+password;
    var message = '';
    console.log(url);

    callback(url,function(body){
      if(body.code=='1')
      {
        req.session.isLogin = body.data;
        res.location("userList");
        res.redirect("userList");
      } else {
        message = "wrong login";
        res.render('userLogin',{ title : 'User Login', message: message});
      }
    });
  };
  login(req,res,Api);
});

var checkLogin = function(req,res,callback) {
  // console.log('session',req.session.isLogin);
  if(!req.session.isLogin) {
    res.location("userLogin");
    res.redirect("userLogin");
  } else {
    callback();
  }
};

var Api = function(url,callback) {
  request(url, function (error, response, body) {
    // console.log(body);
    body = JSON.parse(body);
    callback(body);
  });
};

module.exports = router;
