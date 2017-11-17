'use strict'

var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var app = express();

app.use(express.json());
app.use(express.static('./frontend'));
app.use(cors());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'GR18pv',
  database: 'licenceplate'
});

connection.connect();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/search/:brand', function(req, res) {
  var data = [];
  var queryString = `SELECT * FROM licence_plates WHERE car_brand='${req.params.brand}'`;
  connection.query(queryString, function(err, result, fileds) {
    result.forEach(function(element){
      data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
    });
    res.send({'result': 'OK', 'cars': data});
  });
});

app.get('/all', function(req, res) {
  var data = [];
  var queryString = `SELECT * FROM licence_plates`;
  connection.query(queryString, function(err, result, fileds) {
    result.forEach(function(element){
      data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
    });
    res.send({'result': 'OK', 'cars': data});
  });
});

app.get('/search', function(req, res) {
  var data = [];
  var licenceOK = true;
    var queryString = `SELECT * FROM licence_plates`
    connection.query(queryString, function(err, result, fileds) {
      result.forEach(function(element){
        if (req.query.q) {
          licenceOK = licenceCheck(req.query.q);
          if (req.query.police === '1') {
            if (element.plate.includes(req.query.q) && element.plate.slice(0, 2).includes('RB')) {
              data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
            }
          } else if (req.query.diplomat === '1') {
            if (element.plate.includes(req.query.q) && element.plate.slice(0, 2).includes('DT')) {
              data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
            }
          } else {
            if (element.plate.includes(req.query.q)) {
              data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
            }
          }
        } else {
            if (req.query.police === '1') {
              if (element.plate.slice(0, 2).includes('RB')) {
                data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
              }
            } else if (req.query.diplomat === '1') {
              if (element.plate.slice(0, 2).includes('DT')) {
                data.push({'licence': element.plate, 'brand': element.car_brand, 'model': element.car_model, 'year': element.year, 'color': element.color});
              }
            }
        }
      });
      if (licenceOK) {
        res.send({'result': 'OK', 'cars': data});
      } else {
        res.send({'result': 'wrong'});
      }
    });
});

function licenceCheck (plate) {
  var temp = plate.replace(/[^a-zA-Z0-9-]/g, "");
  if (temp.localeCompare(plate) === 0) {
    return true;
  } else {
    return false;
  }
}

app.listen(4000, () => console.log('Running'));