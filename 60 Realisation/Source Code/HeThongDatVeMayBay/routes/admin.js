var express = require('express');
var router = express.Router();
var dbconnect = require("../database/sql")
var randomId = require('random-id');
var len = 12;
var pattern = 'A0'

//HOME
router.get('/home/index', function(req, res, next) {
  res.render('admin/home/index', { pagetitle: 'Home' });
});
/*PLANE */
/* GET DATABASE. */
router.get('/plane/index', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.request().query('SELECT * FROM MAYBAY mb, HANGMAYBAY hb WHERE mb.idHang = hb.idHang',(err, result) => {      
      if(err) throw err;               
      res.render('admin/plane/index', {result:result});
    }) 
  })
}); 
  //----ADD Plane---
  router.get('/plane/add', function(req, res, next) {
    dbconnect.connect().then(() => {
      dbconnect.request().query('SELECT * FROM HANGMAYBAY',(err, result) => {      
        if(err) throw err;               
        res.render('admin/plane/add', {result:result});
      }) 
    })
  });
  router.post('/plane/add', function(req, res, next) {
    var idmaybay = randomId(len, pattern);
    var idhang = req.body.idHang.split(" ");
    dbconnect.query(`INSERT INTO MAYBAY (idMayBay,TenMayBay,idHang,SoLuongKhach) VALUES('${idmaybay}','${req.body.TenMayBay}','${idhang[0]}','${req.body.SoLuongKhach}')`,function(err){
      if(err) throw err;
      res.redirect("/admin/plane/index");
    })
  });
  
  //----DELETE Plane---
  router.get('/plane/delete/:idMayBay', function(req, res, next) {
    dbconnect.query(`DELETE FROM MAYBAY WHERE idMayBay = '${req.params.idMayBay}'`,function(err){
      if(err) throw err;      
      res.redirect("/admin/plane/index");
      })
  });
  
  //----EDIT Plane---
  router.get('/plane/edit/:idMayBay', function(req, res, next) {
    dbconnect.query(`SELECT * FROM MAYBAY mb, HANGMAYBAY hb WHERE mb.idHang = hb.idHang AND idMayBay = '${req.params.idMayBay}'`,function(err, result){
      if(err) throw err;
      console.log(result);
      dbconnect.request().query('SELECT * FROM HANGMAYBAY',(err, result2) => {      
        if(err) throw err;              
        res.render("admin/plane/edit", {result: result, result2: result2});
      })
    })
  });
  router.post('/plane/edit', function(req, res, next) {
    var idhang = req.body.idHang.split(" ");
    dbconnect.query(`UPDATE MAYBAY SET TenMayBay = '${req.body.TenMayBay}', idHang = '${idhang[0]}', SoLuongKhach = '${req.body.SoLuongKhach}' WHERE idMayBay = '${req.body.idMayBay}'`,function(err){
      if(err) throw err;
      res.redirect("/admin/plane/index");
    })
  });

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

/*FLIGTH */
/* GET DATABASE. */
router.get('/flight/index', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.query("SELECT * FROM CHUYENBAY cb, MAYBAY mb, HANGMAYBAY hb WHERE cb.idMayBay = mb.idMayBay AND mb.idHang = hb.idHang",function(err, result){
      if(err) throw err;
      else{
        res.render('admin/flight/index', {result: result});
      }
    }) 
  })
});


//----ADD Flight---
router.get('/flight/add', function(req, res, next) {
  dbconnect.connect().then(() => {
    dbconnect.query("SELECT * FROM MAYBAY mb, HANGMAYBAY hb WHERE mb.idHang = hb.idHang",function(err, result){
      if(err) throw err;
      else{
        res.render('admin/flight/add', {result: result});
      }
    }) 
  })
});

router.post('/flight/add', function(req, res, next) {
  var idmaybay = req.body.idMayBay.split(" ");
  var idchuyenbay = randomId(len, pattern);
  console.log(req.body.NoiDen + req.body.NoiDi);
  dbconnect.query(`INSERT INTO CHUYENBAY (idChuyenBay, NgayBay, GioBay, GioDen, NoiDi, NoiDen, idMayBay) VALUES('${idchuyenbay}','${req.body.NgayBay}','${req.body.GioBay}','${req.body.GioDen}',N'${req.body.NoiDi}',N'${req.body.NoiDen}','${idmaybay[0]}')`,function(err){
    if(err) throw err;
    res.redirect("/admin/flight/index");
  })
});

//----DELETE Flight---
router.get('/flight/delete/:idChuyenBay', function(req, res, next) {
  dbconnect.query(`DELETE FROM CHUYENBAY WHERE idChuyenBay = '${req.params.idChuyenBay}'`,function(err){
    if(err) throw err;
    res.redirect("/admin/flight/index");
    })
});

//----EDIT Flight---
router.get('/flight/edit/:idChuyenBay', function(req, res, next) {
  dbconnect.query(`SELECT * FROM CHUYENBAY, MAYBAY, HANGMAYBAY WHERE CHUYENBAY.idMayBay = MAYBAY.idMayBay AND HANGMAYBAY.idHang = MAYBAY.idHang AND idChuyenBay = '${req.params.idChuyenBay}'`,function(err, result){
    if(err) throw err;
    console.log(result);
    dbconnect.request().query('SELECT * FROM MAYBAY',(err, result2) => {      
      if(err) throw err;              
      res.render("admin/flight/edit", {result: result, result2: result2});
    })
  })
});
router.post('/flight/edit', function(req, res, next) {
  var idmaybay = req.body.idMayBay.split(" ");
    dbconnect.query(`UPDATE CHUYENBAY SET NgayBay = '${req.body.NgayBay}', GioBay = '${req.body.GioBay}', GioDen = '${req.body.GioDen}', NoiDi = N'${req.body.NoiDi}', NoiDen = N'${req.body.NoiDen}', idMayBay = '${idmaybay[0]}' WHERE idChuyenBay = '${req.body.idChuyenBay}'`,function(err){     
    if(err) throw err;       
    res.redirect("/admin/flight/index");
    })    
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

/*TICKET */
/* GET DATABASE. */
router.get('/ticket/index', function(req, res, next) {
  dbconnect.query("SELECT * FROM vemaybay, chuyenbay, maybay WHERE idmaynay = idmaybay AND vemaybay.idchuyenbay = chuyenbay.idchuyenbay",function(err, results){
    if(err) throw err;
    else{
      data = {print: results};
      console.log(data);     
      res.render('admin/ticket/index', data);
    }
  })
});

//----ADD Ticket---
router.get('/ticket/add', function(req, res, next) {
  dbconnect.query(`SELECT * FROM chuyenbay, maybay WHERE idmaynay = idmaybay`,function(err, results){
    if(err) throw err;
      else{
        data = {print: results};
      res.render('admin/ticket/add', data); }        
  })
});
router.post('/ticket/add', function(req, res, next) {
  var idstr = req.body.idchuyenbay;
  var idchuyenbay = idstr.split(" ")[0];
  var idvemaybay = randomId(len, pattern);
  dbconnect.query(`INSERT INTO vemaybay (idvemaybay, idchuyenbay, sokghanhlymacdinh, giave) VALUES('${idvemaybay}','${idchuyenbay}','${req.body.sokghanhlymacdinh}','${req.body.giave}')`,function(err){
    if(err) throw err;
    res.redirect("/admin/ticket/index");
  })
});

//----DELETE Ticket---
router.get('/ticket/delete/:idvemaybay', function(req, res, next) {
  dbconnect.query(`DELETE FROM vemaybay WHERE idvemaybay = '${req.params.idvemaybay}'`,function(err){
    if(err) throw err;
    res.redirect("/admin/ticket/index");
    })
});

//----EDIT Ticket---
router.get('/ticket/edit/:idvemaybay', function(req, res, next) {
  var data = dbconnect.query(`SELECT * FROM vemaybay WHERE idvemaybay = '${req.params.idvemaybay}'`,function(err, result){
  if(err) throw err;
  data = {
    idvemaybay: result[0].idvemaybay,
    idchuyenbay: result[0].idchuyenbay,
    sokghanhlymacdinh: result[0].sokghanhlymacdinh,
    giave: result[0].giave 
  }
  res.render("admin/ticket/edit",{data});
  })
});
router.post('/ticket/edit', function(req, res, next) {
    dbconnect.query(`UPDATE vemaybay SET sokghanhlymacdinh = '${req.body.sokghanhlymacdinh}', giave = '${req.body.giave}'`,function(err){     
    if(err) throw err;       
    res.redirect("/admin/ticket/index");
    })    
});
  module.exports = router;
  
  