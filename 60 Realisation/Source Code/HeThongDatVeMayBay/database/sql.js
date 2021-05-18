const sql = require("mssql/msnodesqlv8");

const pool = new sql.ConnectionPool({    
    server: "DESKTOP-0G2IHRM\\SQLEXPRESS",
    database: "QLHeThongMayBayNodejs",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
        enableArithAbort: true
    }
});
pool.connect(function(err){
    if(err) throw err;
    console.log("Connected Success !")
  })
  
module.exports = pool;
