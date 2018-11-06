
console.log("check db")
var mysql = require('mysql')
//var connectionQueryGetReport= 'SELECT * from tblEmployee WHERE EmpID =' + user_id;
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'Halifax@1234',
  database : 'ninja_assignment2'
  });

module.exports = {
    getReport : function(user_id)
    {
      var connectionQuery = 'SELECT * from tblEmployee WHERE EmpID =' + user_id;
      connection.connect(function(err) {
          connection.query(connectionQuery, function(err, result) {
              if(err){
                  throw err;
              } else {
                  var obj = {};
                  obj = {empData: result};
                  ejs.renderFile(__dirname + '/views/exportReport.ejs', obj, function(err, result) {
                      // render on success
                      if (result) {
                          html = result;
                          var options = {
                              filename: 'pdf/empReport'+user_id+'.pdf',
                              format: 'A4',
                              orientation: 'portrait',
                              directory: './pdf/',
                              type: "pdf"
                            };
                          pdf.create(html,options).toFile(function(err, resPDF) {
                                if (err)
                                {
                                  return console.log("Error while creating PDF: " + err);
                                }
                                else
                                {
                                  // do nothing - error will be caught in the above if loop
                                }
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
    },

    getData : function(req,res)
    {
      connection.connect(function(err) {
          connection.query('SELECT * from tblEmployee', function(err, result) {
              if(err){
                  throw err;
              } else {
                  var obj = {};
                  obj = {empData: result};
                  console.log("db Object is"+obj)
                  return obj;
                  res.render(__dirname + './views/report', obj);
              }
          });
      })
    },
    exportPDF : function(req,res)
    {
        connection.connect(function(err) {
            connection.query('SELECT * from tblEmployee', function(err, result) {
              filename = "empReport.pdf";
                if(err){
                    throw err;
                } else {
                    var obj = {};
                    obj = {empData: result};
                    var ejs = require('ejs');
                    ejs.renderFile(__dirname + '/views/exportReport.ejs', obj, function(err, result) {
                        // render on success
                        if (result) {
                            var pdf = require('html-pdf');
                            html = result;
                            var options = { filename: 'pdf/empReport5.pdf', format: 'A4', orientation: 'portrait', directory: '/pdf/',type: "pdf" };
                                pdf.create(html, options).toFile(function(err, resPDF) {
                                if (err) return console.log("Error while creating PDF: " + err);
                                var fs = require('fs');
                                stream = fs.ReadStream(__dirname + '/pdf/empReport5.pdf');
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
    }
  }
