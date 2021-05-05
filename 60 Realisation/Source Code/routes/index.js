var express = require('express');
var router = express.Router();
var dbconnect = require("../database/connect");
var noidi = "From...";
var noiden = "To...";
var ngaybay = "07/21/2000"
var str = ngaybay[3]+ngaybay[4];
/* GET home page. */

router.get('/booknow/booking/addons', function(req, res, next) {
  res.render('setbody/booking-addons', { pagetitle: 'Booking' });
});
router.get('/booknow/booking/addons/payment', function(req, res, next) {
  res.render('setbody/booking-payment', { pagetitle: 'Booking' });
});

/*TICKET */
/* GET DATABASE. */
router.get('/', function(req, res, next) {
  dbconnect.query(`SELECT DISTINCT noidi FROM chuyenbay ORDER BY noidi `,function(err, results){
    if(err) throw err;
      else{
        data = {print: results};
      res.render('setbody/home', data); }        
  })
});

router.get('/setbody/booknow', function(req, res, next) {
  if(noidi=="From..." || noiden=="To..."){
    dbconnect.query(`SELECT * FROM vemaybay, chuyenbay, maybay WHERE idmaynay = idmaybay AND vemaybay.idchuyenbay = chuyenbay.idchuyenbay`,function(err, results){
      if(err) throw err;
        else{
          data = {print: results};
        res.render('setbody/booknow', data); }        
    })
  }
  else if(ngaybay==""&&noidi!="From..." && noiden!="To..."){
    dbconnect.query(`SELECT * FROM vemaybay, chuyenbay, maybay WHERE idmaynay = idmaybay AND vemaybay.idchuyenbay = chuyenbay.idchuyenbay AND chuyenbay.noidi LIKE '%${noidi}%' AND chuyenbay.noiden LIKE '%${noiden}%'`,function(err, results){
      if(err) throw err;
        else{
          data = {print: results};
        res.render('setbody/booknow', data); }        
    })
  }
  else{
    dbconnect.query(`SELECT * FROM vemaybay, chuyenbay, maybay WHERE idmaynay = idmaybay AND vemaybay.idchuyenbay = chuyenbay.idchuyenbay AND chuyenbay.noidi LIKE '%${noidi}%' AND chuyenbay.noiden LIKE '%${noiden}%' AND chuyenbay.ngaybay LIKE '%${str}%'`,function(err, results){
      if(err) throw err;
        else{
          data = {print: results};
        res.render('setbody/booknow', data); }        
    })
  } 
});
router.post('/setbody/home', function(req, res, next) {
  noidi = req.body.chuyenbaynoidi;
  noiden = req.body.chuyenbaynoiden;
  ngaybay = req.body.chuyenbayngaybay;
  res.redirect("/setbody/booknow");  
});

router.get('/setbody/booking/:idvmb', function(req, res, next) {
  var data = dbconnect.query(`SELECT * FROM vemaybay, chuyenbay, maybay WHERE idmaynay = idmaybay AND vemaybay.idchuyenbay = chuyenbay.idchuyenbay AND idvemaybay = '${req.params.idvmb}'`,function(err, result){
    if(err) throw err;
    data = {
      idvemaybay: result[0].idvemaybay,
      ngaybay: result[0].ngaybay,
      gioden: result[0].gioden,
      noidi: result[0].noidi,
      tenmaybay: result[0].tenmaybay,
      hangmaybay: result[0].hangmaybay,
      soluongkhach: result[0].soluongkhach,
      noiden: result[0].noiden,
      idmaynay: result[0].idmaynay,
      sokghanhlymacdinh: result[0].sokghanhlymacdinh,
      giave: result[0].giave 
    }
    console.log(data);
    res.render("setbody/booking",{data});       
  })
});
module.exports = router;
