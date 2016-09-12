var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log(login.loginStatus);
  // login.setLogin='tyngyi';
  // login.setLogin='peeler';
  // console.log(login.getLogin);
  //
  // login.deleteLogin('tyngyi');
  // login.setLogin='aaa';
  // console.log(login.getLogin);

  res.send('respond with a resource');
});
//使用者登入判斷
var login = {
  loginStatus :{},
  get getLogin() { return this.loginStatus; },
  set setLogin(name) { this.loginStatus[name]=1; },
  deleteLogin: function(name) {
    // console.log('delete');
    this.loginStatus[name]=0;
  }
};

module.exports = router;
