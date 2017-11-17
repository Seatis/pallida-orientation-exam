'use strict'

function appendTable(result){
  var table = document.querySelector('section table');
  var message = document.querySelector('p.message');
  if (result.result === 'wrong') {
    table.innerHTML = '';
    message.innerHTML = `Wrong licence plate format, 
                         please do not use invalid cgaracters (@ or #)!`;
  } else {
    message.innerHTML = '';
    table.innerHTML = `<tr>
                        <th>Plate</th>
                        <th>Brand</th> 
                        <th>Model</th>
                        <th>Color</th>
                        <th>Year</th>
                      </tr>
    `
    result.cars.forEach(function(element) {
      const markup = `<tr>
                        <td>${element.licence}</td>
                        <td><a>[${element.brand}]</a></td>
                        <td>${element.model}</td>
                        <td>${element.color}</td>
                        <td>${element.year}</td>
                      </tr>
      `
      table.innerHTML += markup;
    }, this);
    var brand = document.querySelectorAll('a');
    brand.forEach(function(element) {
      element.addEventListener('click', function () {
        var url = 'http://localhost:4000/search/' + element.textContent.slice(1, -1);
        ajax('GET', url, null, appendTable);
      });
    }, this);
  }
}

function ajax (method, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      var requestAPI = JSON.parse(xhr.response);
      callback(requestAPI);
    }
  });
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

function addListenerToButtons (submit, plate, police, diplomat, reset) {
  reset.addEventListener('click', function () {
    plate.value = '';
    police.checked = false;
    diplomat.checked = false;
    ajax('GET', 'http://localhost:4000/all', null, appendTable)
  });
  
  submit.addEventListener('click', function () {
    if (plate.value) {
      var url = 'http://localhost:4000/search?q=' + plate.value;
      if (police.checked) {
        url += '&police=1';
      } else if (diplomat.checked) {
          url += '&diplomat=1';
      }
    } else if (police.checked) {
        var url = 'http://localhost:4000/search?police=1';
    } else if (diplomat.checked) {
        var url = 'http://localhost:4000/search?diplomat=1';
    } else {
      var url = 'http://localhost:4000/all';
    }
    ajax('GET', url, null, appendTable);
  });
} 

function start () {
  var submit = document.querySelector('button.submit');
  var plate = document.querySelector('input');
  var police = document.getElementById('police');
  var diplomat = document.getElementById('diplomat');
  var reset = document.querySelector('button.reset');
  addListenerToButtons(submit, plate, police, diplomat, reset);
  ajax('GET', 'http://localhost:4000/all', null, appendTable);
}
start();
