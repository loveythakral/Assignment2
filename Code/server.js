// import modules
var express = require("express");
var app     = express();
var path    = require("path");
var pdf     = require('html-pdf');
var ejs     = require('ejs');
var fs      = require('fs');
var path    = require('path');
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
server.listen(3000);

// routes & DB
var routes  = require('./routes/routes');
var db = require('./db');

// Session variables
var shareReport = false;
var user_id;
var filename = '';


// socket module
io.on('connection', function(socket){
      socket.on('transferPDF',function(data)
      {
          // hard-coded value to be removed
          user_id = data[1];
          if (data[0] == true)
          {
            getReport(user_id);
            // hard-coded value to be removed
            shareReport = data[0];
          }
      });
      if (shareReport == true)
      {
        var readStream = fs.ReadStream(path.resolve(__dirname + '/pdf/empReport'+user_id+'.pdf'));
        var PDFArray = [], delay = 0;
        readStream.on('readable', function(){
          console.log("PDF Loading")
        });
        readStream.on('data',function(chunk)
        {
          PDFArray.push(chunk);
          socket.emit("sendPDF",chunk);
        });
        readStream.on('end',function() {
          console.log("PDF loaded");
        });
      }
});


app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/', routes);

function getReport(user_id)
{
  var mysql = require('mysql')
  var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'Halifax@1234',
  database : 'ninja_assignment2'
  });

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
}
console.log("Running at Port 3000");
module.exports = app;
