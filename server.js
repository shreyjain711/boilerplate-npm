 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

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

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })
app.get('/:date',function (req,res){
  
  let months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  let data = req.params.date;
  let resOb = { unix : null, natural : null};
  if( isNaN(parseInt(data)) ){
    let d = new Date(data);
    if(!isNaN(d.getTime())){
      resOb.unix = d.getTime()/1000;
      resOb.natural = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  } else {
    if( (parseInt(data).toString().length === data.length) || (parseInt(data).toString().length === data.length-1) ){
      let d = new Date(parseInt(data));
      resOb.unix = d.getTime();
      resOb.natural = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
  }
  
  res.send(JSON.stringify(resOb));
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

