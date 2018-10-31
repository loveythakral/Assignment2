var express = require("express");
var app     = express();
var path    = require("path");
/*var pdf = require('html-pdf');
var fs = require('fs');
var ejs = require('ejs');*/

var fs = require('fs');
var pdfList =[];
var pdf = '';
var stream = '';
var filename = '';
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);


io.on('connection', function(socket){
  console.log("pdfList in socket"+pdfList.length);
    socket.emit('sendPDF', function(data) {
    data.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    //data.send(stream,{binary:true});
    data.send(new Buffer(stream, 'binary'))
    });

  socket.on('confirmation', function (data) {
    console.log(data);
  });
});

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/',function(req,res){
    res.render(__dirname + '/views/index');
    //res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/availableReports',function(req,res){
    res.render(__dirname + '/views/availableReports');
    //res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/users',function(req,res){
    res.render(__dirname + '/views/users');
    //res.sendFile(path.join(__dirname+'/views/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.post('/exportPDF', function(req, res){
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
                //console.log(obj)
                //res.render(__dirname + '/views/report', obj);
                var ejs = require('ejs');
                ejs.renderFile(__dirname + '/views/exportReport.ejs', obj, function(err, result) {
                    // render on success
                    if (result) {
                        var pdf = require('html-pdf');
                        html = result;
                        var options = { filename: 'pdf/empReport.pdf', format: 'A4', orientation: 'portrait', directory: './pdf/',type: "pdf" };
                            pdf.create(html, options).toFile(function(err, resPDF) {
                            if (err) return console.log("Error while creating PDF: " + err);
                            var fs = require('fs');
                            stream = fs.ReadStream(__dirname + '/pdf/empReport.pdf');
                            filename = encodeURIComponent(filename);
                            // Ideally this should strip them
                            //res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
                            res.setHeader('Content-type', 'application/pdf');
                            res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
                            console.log("before rendering pdf");
                            stream.pipe(res);
                            });
                            pdfList.push(stream);
                            console.log("pdflist size is is :"+pdfList.length);
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

app.get('/report', function(req, res){
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
                res.render(__dirname + '/views/report', obj);
            }
        });
    })
});
console.log("Running at Port 3000");
