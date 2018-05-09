// Javascript server to connect domains to each other and the database

// Adapted from: https://github.com/claireellul/cegeg077-week5server/blob/master/httpServer.js

// Define variables for node.js functionality
var express = require('express');
var path = require("path");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


//Add functionality to allow cross-domain queries when PhoneGap is running a server
app.use(function(req, res, next) {
  	res.setHeader("Access-Control-Allow-Origin", "*");
  	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

//Uploading data from web application
app.post('/questUpload',function(req,res){
       console.dir(req.body);
       pool.connect(function(err,reqXML,done) {
             if(err){
             console.log("not able to get connection "+ err);
             res.status(400).send(err);
             }
// Form WKT string from coordinates
var geometrystring = "st_geomfromtext('POINT(" + req.body.lng + " " + req.body.lat + ")'";
// Enter string into table
var querystring = "INSERT into questions (locationdesc,question,answera,answerb,answerc,answerd,answercorrect,location) values ('";
querystring = querystring + req.body.locationdesc + "','" + req.body.question + "','" + req.body.answera+"','" + req.body.answerb+"','" + req.body.answerc+"','" + req.body.answerd+"','" + req.body.answercorrect+"'," + geometrystring +"))";
      console.log(querystring);
      reqXML.query( querystring,function(err,result) {
    done();
    if(err){
      console.log(err);
      res.status(400).send(err);
      }
      res.status(200).send("Question uploaded");
    });
  });
});

// Retrieve question data from database
// Used in both web and mobile applications
      app.get('/questGet', function (req,res) {
      pool.connect(function(err,reqXML,done) {
    if(err){
      console.log("connection not established"+ err);
      res.status(400).send(err);
}
// Use the inbuilt geoJSON functionality
// Create geoJSON format using query adapted from here: http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html

var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
querystring = querystring + "row_to_json((SELECT l FROM (SELECT locationdesc, question, answera, answerb, answerc, answerd, answercorrect) As l      )) As properties";
querystring = querystring + "   FROM questions  As lg limit 100  ) As f ";
      console.log(querystring);
      reqXML.query(querystring,function(err,result){

//call `done()` to release the reqXML back to the pool
    done();
    if(err){
      console.log(err);
      res.status(400).send(err);
      }
      res.status(200).send(result.rows);
      });
    });
});

// Uploading answer from mobile application
app.post('/ansUpload',function(req,res){
        console.dir(req.body);
      pool.connect(function(err,reqXML,done) {
      if(err){
        console.log("connection not estabilshed"+ err);
        res.status(400).send(err);
      }
var querystring = "INSERT into answers (question,answer,answercorrect) values ('"; querystring = querystring + req.body.question + "','" + req.body.answer +"','" + req.body.anscorrect+"')";
        console.log(querystring);
        reqXML.query( querystring,function(err,result) {
      done();
      if(err){
        console.log(err);
        res.status(400).send(err);
}
        res.status(200).send("Answer uploaded!");
       });
	});
});




// Add functionality to log requests
app.use(function (req, res, next) {
	var filename = path.basename(req.url);
	var extension = path.extname(filename);
	console.log("The file " + filename + " was requested.");
	next();
});


// Allow server to send files to the Edge browser
var http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(4480);

app.get('/',function (req,res) {
	res.send("hello world from the HTTP server");
});


// Require fs to ensure file sync works
var fs = require('fs');
var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");
// Convert the configuration file into the correct format
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
  var split = configarray[i].split(':');
  config[split[0].trim()] = split[1].trim();
}
//Release reqXML to pool
var pg = require('pg');
var pool = new pg.Pool(config);

// Indicate pathing for when you contact the server
// Create initial path:  http://developer.cege.ucl.ac.uk:32560/xxxxx
app.get('/:name1', function (req, res) {
	// Seng log values to the server console
	console.log('request '+req.params.name1);
	// Send log values to the web page
	res.sendFile(__dirname + '/'+req.params.name1);
});

// Add an additional path:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx
app.get('/:name1/:name2', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2);
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2);
});

// Add an additional path:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx/xxxx
app.get('/:name1/:name2/:name3', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3);
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3);
});

// Add an additional path:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx/xxxx
app.get('/:name1/:name2/:name3/:name4', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3+"/"+req.params.name4);
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3+"/"+req.params.name4);
});
