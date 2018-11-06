// import functions
var express = require('express');
var router = express.Router();
var db = require('./../db');

// home page
router.get('/',function(req,res){
    res.render(__dirname + './../views/index.ejs');
});

// retrieve list of users
router.get('/users',function(req,res){
    res.render(__dirname + './../views/users');
});

// retrieve available reports
router.get('/availableReports',function(req,res){
    res.render(__dirname + './../views/availableReports');
});

// Generate Report
router.post('/exportPDF', function(req, res){
  // invoke db.exportPDF() from db.js and move the logic below in there
    var mysql = require('mysql')
    var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'Halifax@1234',
    database : 'ninja_assignment2'
    });

    connection.connect(function(err) {
        connection.query('SELECT * from tblEmployee', function(err, result) {
          filename = "empReport.pdf";
            if(err){
                throw err;
            } else {
                var obj = {};
                obj = {empData: result};
                var ejs = require('ejs');
                ejs.renderFile(__dirname + '/../views/exportReport.ejs', obj, function(err, result) {
                    // render on success
                    if (result) {
                        var pdf = require('html-pdf');
                        html = result;
                        var options = { filename: 'pdf/empReport5.pdf', format: 'A4', orientation: 'portrait', directory: '../../pdf/',type: "pdf" };
                            pdf.create(html, options).toFile(function(err, resPDF) {
                            if (err) return console.log("Error while creating PDF: " + err);
                            var fs = require('fs');
                            stream = fs.ReadStream(__dirname + '/../pdf/empReport5.pdf');
                            filename = encodeURIComponent(filename);
                            res.setHeader('Content-type', 'application/pdf');
                            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
                            stream.pipe(res);
                            });
                    }
                    // render or error
                    else {
                       res.end('An error occurred');
                       console.log(err);
                    }
                });
            }
        });
    })
});

// retrieve report
router.get('/report', function(req, res){
// invoke db.getData() from db.js and move the logic below in there
    // db.getData(res);  

    var mysql = require('mysql')
    var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'Halifax@1234',
    database : 'ninja_assignment2'
    });

    connection.connect(function(err) {
        connection.query('SELECT * from tblEmployee', function(err, result) {
            if(err){
                throw err;
            } else {
                var obj = {};
                obj = {empData: result};
                //console.log(obj)
                res.render(__dirname + './../views/report', obj);
            }
        });
    })
});

module.exports = router;
