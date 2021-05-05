var express = require('express');
var router = express.Router();
var dbconnect = require("../database/connect")
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
    dbconnect.query("SELECT * FROM maybay",function(err, results){
      if(err) throw err;
      else{
        data = {print: results};
        res.render('admin/plane/index', data);
      }
    })
  });
  
  //----ADD Plane---
  router.get('/plane/add', function(req, res, next) {
        res.render('admin/plane/add', data);
  });
  router.post('/plane/add', function(req, res, next) {
    var idmaybay = randomId(len, pattern);
    dbconnect.query(`INSERT INTO maybay (idmaybay,tenmaybay,hangmaybay,soluongkhach) VALUES('${idmaybay}','${req.body.tenmaybay}','${req.body.hangmaybay}','${req.body.soluongkhach}')`,function(err){
      if(err) throw err;
      res.redirect("/admin/plane/index");
    })
  });
  
  //----DELETE Plane---
  router.get('/plane/delete/:idmaybay', function(req, res, next) {
    dbconnect.query(`DELETE FROM maybay WHERE idmaybay = '${req.params.idmaybay}'`,function(err){
      if(err) throw err;      
      res.redirect("/admin/plane/index",alert("Deleted Success !"));
      })
  });
  
  //----EDIT Plane---
  router.get('/plane/edit/:idmaybay', function(req, res, next) {
    var data = dbconnect.query(`SELECT * FROM maybay WHERE idmaybay = '${req.params.idmaybay}'`,function(err, result){
      if(err) throw err;
      data = {
        idmaybay: result[0].idmaybay,
        tenmaybay: result[0].tenmaybay,
        hangmaybay: result[0].hangmaybay,
        soluongkhach: result[0].soluongkhach
      };
      res.render("admin/plane/edit", {data});
    })
  });
  router.post('/plane/edit', function(req, res, next) {
    dbconnect.query(`UPDATE maybay SET tenmaybay = '${req.body.tenmaybay}', hangmaybay = '${req.body.hangmaybay}', soluongkhach = '${req.body.soluongkhach}' WHERE idmaybay = '${req.body.idmaybay}'`,function(err){
      if(err) throw err;
      res.redirect("/admin/plane/index");
    })
  });

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//

/*FLIGTH */
/* GET DATABASE. */
router.get('/flight/index', function(req, res, next) {
  dbconnect.query("SELECT * FROM chuyenbay, maybay WHERE idmaynay = idmaybay",function(err, results){
    if(err) throw err;
    else{
      data = {print: results};
      res.render('admin/flight/index', data);
    }
  })
});

//----ADD Flight---
router.get('/flight/add', function(req, res, next) {
  dbconnect.query(`SELECT * FROM maybay`,function(err, results){
    if(err) throw err;
      else{
        data = {print: results};
      res.render('admin/flight/add', data); }        
  })
});
router.post('/flight/add', function(req, res, next) {
  var idstr = req.body.idmaybay;
  var idmaybay = idstr.split(" ")[0];
  var idchuyenbay = randomId(len, pattern);
  dbconnect.query(`INSERT INTO chuyenbay (idchuyenbay, ngaybay, giobay, gioden, noidi, noiden, idmaynay) VALUES('${idchuyenbay}','${req.body.ngaybay}','${req.body.giobay}','${req.body.gioden}','${req.body.noidi}','${req.body.noiden}','${idmaybay}')`,function(err){
    if(err) throw err;
    res.redirect("/admin/flight/index");
  })
});

//----DELETE Flight---
router.get('/flight/delete/:idchuyenbay', function(req, res, next) {
  dbconnect.query(`DELETE FROM chuyenbay WHERE idchuyenbay = '${req.params.idchuyenbay}'`,function(err){
    if(err) throw err;
    res.redirect("/admin/flight/index");
    })
});

//----EDIT Flight---
router.get('/flight/edit/:idchuyenbay', function(req, res, next) {
  var data = dbconnect.query(`SELECT * FROM chuyenbay WHERE idchuyenbay = '${req.params.idchuyenbay}'`,function(err, result){
  if(err) throw err;
  data = {
    idchuyenbay: result[0].idchuyenbay,
    ngaybay: result[0].ngaybay,
    giobay: result[0].giobay,
    gioden: result[0].gioden,
    noidi: result[0].noidi,
    noiden: result[0].noiden,
    idmaynay: result[0].idmaynay
  }
  res.render("admin/flight/edit",{data});
  })
});
router.post('/flight/edit', function(req, res, next) {
    dbconnect.query(`UPDATE chuyenbay SET ngaybay = '${req.body.ngaybay}', giobay = '${req.body.giobay}', gioden = '${req.body.gioden}', noidi = '${req.body.noidi}', noiden = '${req.body.noiden}', idmaynay = '${req.body.idmaynay}' WHERE idchuyenbay = '${req.body.idchuyenbay}'`,function(err){     
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
  
  