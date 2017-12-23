/*
*  Time-Stamp Microservice
*/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
/*
if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}
*/
function toMonth(digit) {
  var months = ["January", "February", "March", "April",
                "May", "June", "July", "August", "September",
                "October", "November", "December"];
  return months[digit];
  
}
// direct to the CSS
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

app.get('/:time', function(req, res) {
  console.log(String(req.params.time));
  var date; 
  
  if(isNaN(parseInt(req.params.time)))
    date = new Date(req.params.time);
  else
    date = new Date(parseInt(req.params.time));
  console.log(typeof(date.getDate()));
  var result = { unix : null, natural: null};
  
  // check that it is a valid date. 
  // if it is not a valid date then getDate will return NaN
  if (!isNaN(date.getDate())) {
    result.unix = date.getTime();
    result.natural = toMonth(date.getMonth()) + " " + date.getDate()
      + ", " + (date.getYear() + 1900);
    
  }
  
  res.type('txt').status(200).send(JSON.stringify(result));
});
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});

