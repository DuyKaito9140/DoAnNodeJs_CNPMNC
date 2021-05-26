var express = require('express');
var router = express.Router();
var dbconnect = require("../database/sql");
var apijs = require("../api/api-user")
var randomId = require('random-id');
var len = 12;
var pattern = 'A0'
var noidi = "From...";
var noiden = "To...";
var ngaybay = "07/21/2000"
var str = ngaybay[3]+ngaybay[4];
var user1 = {};
//User
var userId = -1;
var email = "";
var pass = "";
var firstName = "";
var lastName = "";
var phone = "";
var userAddress = "";
var cards = "";
var statuslogin = false;
//Point
var value_DayPoint = "";
var value_TotalPoint = "";
var day_Point = "";
/* GET home page. */

router.get('/booknow/booking/addons', function(req, res, next) {
  res.render('setbody/booking-addons', { pagetitle: 'Booking' });
});
router.get('/booknow/booking/addons/payment', function(req, res, next) {
  res.render('setbody/booking-payment', { pagetitle: 'Booking' });
});

/* GET DATABASE. */
router.get('/', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.request().query('SELECT DISTINCT NoiDi FROM CHUYENBAY ORDER BY NoiDi ',(err, result1) => {      
      if(err) throw err;
      dbconnect.request().query('SELECT DISTINCT NoiDen FROM CHUYENBAY ORDER BY NoiDen ',(err, result2) => {      
        if(err) throw err;                
        dbconnect.request().query('SELECT * FROM LOAIVE ',(err, result3) => {      
          if(err) throw err;
          else{
            user1 = {
              //User
              muserId : userId,
              memail : email,
              mpass : pass,
              mfirstName : firstName,
              mlastName : lastName,
              mphone : phone,
              muserAddress : userAddress,
              mcards : cards,
              //POINT
              mvalue_DayPoint : value_DayPoint,
              mvalue_TotalPoint : value_TotalPoint,
              mday_Point : day_Point,
              //Status
              mstatuslogin: statuslogin              
            }
            console.log(user1);
            res.render('setbody/home', {result1:result1, result2: result2, result3: result3, user1 : user1});
          }                       
        })
      })
    }) 
  })
});


router.get('/setbody/booknow', function(req, res, next) {
  if(noidi=="From..." || noiden=="To..."){
    dbconnect.connect().then(() => {
      dbconnect.query(`SELECT * FROM VEMAYBAY v, CHUYENBAY c, LOAIVE l, MAYBAY m, HANGMAYBAY h WHERE v.idLoaiVe = l.idLoaiVe AND v.idChuyenBay = c.idChuyenBay AND c.idMayBay = m.idMayBay AND m.idHang = h.idHang`,function(err, result){
        if(err) throw err;
        else{
          res.render('setbody/booknow', {result: result, user1:user1});
        }
      }) 
    })
  }  
});

router.post('/setbody/home', function(req, res, next) {
  noidi = req.body.chuyenbaynoidi;
  noiden = req.body.chuyenbaynoiden;
  ngaybay = req.body.chuyenbayngaybay;
  res.redirect("/setbody/booknow");  
});

router.get('/setbody/booking/:idVe', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.query(`SELECT * FROM VEMAYBAY v, CHUYENBAY c, LOAIVE l, MAYBAY m, HANGMAYBAY h WHERE v.idLoaiVe = l.idLoaiVe AND v.idChuyenBay = c.idChuyenBay AND c.idMayBay = m.idMayBay AND m.idHang = h.idHang AND idVe = '${req.params.idVe}'`,function(err, result){
      if(err) throw err;
      else{
        res.render('setbody/booking', {result: result});
      }
    }) 
  })
});

//Login
router.get('/setbody/login', function(req, res, next) {
  res.render('setbody/login', {user1:user1});
});
router.post('/setbody/login', function(req, res, next) {
  var usseremail = req.body.email;
  var userpass = req.body.pass;

  apijs.connect().then(() => {
    apijs.query(`SELECT * FROM Users u, User_Point up WHERE u.userId = up.userId`,function(err, result){
      if(err) throw err;
      else{
         (result.recordset).forEach(function(user){
            if(usseremail == user.email && userpass == user.pass){
              //User
              userId = user.userId[0];
              email = user.email;
              pass = user.pass;
              firstName = user.fristName; //Data sai chính tả !
              lastName = user.lastName;
              phone = user.phone;
              userAddress = user.userAddress;
              cards = user.cards;
              //Point
              value_DayPoint = user.value_DayPoint;
              value_TotalPoint = user.value_TotalPoint;
              day_Point = user.day_Point;
              //Status
              statuslogin = true;
            }
         })
         if(statuslogin == true)
         res.redirect("/"); 
         else
         res.redirect("/setbody/login");        
      }
    }) 
  }) 
});

//Signin
router.get('/setbody/signin', function(req, res, next) {
  res.render('setbody/signin', {user1:user1});
});
router.post('/setbody/signin', function(req, res, next) {
  var lastname1 = req.body.LastName;
  var firstname1 = req.body.FirstName;
  var email1 = req.body.Email;
  var phone1 = req.body.Phone;
  var card1 = req.body.Cards;
  var address1 = req.body.Address;
  var pass1 = req.body.Password;
  apijs.query(`INSERT INTO Users (email, pass, fristName, lastName, phone, userAddress, cards) VALUES(N'${email1}',N'${pass1}',N'${firstname1}',N'${lastname1}','${phone1}',N'${address1}','${card1}')`,function(err){
    if(err) throw err;           
      res.redirect("/setbody/login");
  })
});


//logout
router.get('/setbody/logout', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.request().query('SELECT DISTINCT NoiDi FROM CHUYENBAY ORDER BY NoiDi ',(err, result1) => {      
      if(err) throw err;
      dbconnect.request().query('SELECT DISTINCT NoiDen FROM CHUYENBAY ORDER BY NoiDen ',(err, result2) => {      
        if(err) throw err;                
        dbconnect.request().query('SELECT * FROM LOAIVE ',(err, result3) => {      
          if(err) throw err;
          else{
            statuslogin = false;
             user1 = {
              //USER
              muserId : userId,
              memail : email,
              mpass : pass,
              mfirstName : firstName,
              mlastName : lastName,
              mphone : phone,
              muserAddress : userAddress,
              mcards : cards,
              //POINT
              mvalue_DayPoint : value_DayPoint,
              mvalue_TotalPoint : value_TotalPoint,
              mday_Point : day_Point,
              //STATUS
              mstatuslogin: statuslogin              
            }
            console.log(user1);
            res.render('setbody/home', {result1:result1, result2: result2, result3: result3, user1 : user1});
          }                       
        })
      })
    }) 
  })
});

//About
router.get('/setbody/about', function(req, res, next) {
  res.render('setbody/about', {user1:user1});
});
//Contact
router.get('/setbody/contact', function(req, res, next) {
  res.render('setbody/contact', {user1: user1});
});
//Promotion
router.get('/setbody/promotions', function(req, res, next) {
  res.render('setbody/promotions', {user1: user1});
});
router.get('/setbody/promotion', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.query(`SELECT * FROM KHUYENMAI`,function(err, result){
      if(err) throw err;
      else{
        res.render('setbody/promotion', {result: result, user1: user1});
      }
    }) 
  })
});

module.exports = router;
