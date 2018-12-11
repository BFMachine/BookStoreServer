//var express = require('express');
//var router = express.Router();
let db = require("../models");

// add books to cart
//curl -v --header "Content-Type: application/json" -H "authorization:Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDQ4ODQ1MjI3MzIsImlkIjo0LCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVtcEBnbWFpbC5jb20ifQ.Q7_KlBWCjNiLvb10E1KWuvEWmgLPqTQpR3OvL5oWzDg" --request POST --data '{"title":"Метро чегототам","author":"Дмитрий Глуховский","price":"5.95","rank":"two","category":"4","description":"Третья мировая стерла человечество с лица Земли. Планета опустела. Мегаполисы обращены в прах и пепел. Железные дороги ржавеют. Спутники одиноко болтаются на орбите. Радио молчит на всех частотах. Выжили только те, кто, услышав сирены тревоги, успел добежать до дверей московского метро. Там, на глубине в десятки метров, на станциях и в туннелях, люди пытаются переждать конец света. Там они создали себе новый мирок вместо потерянного огромного мира..."}' http://localhost:3000/cart
exports.cart_add = function(req, res) {
    
  res.send('NOT IMPLEMENTED: cart_add');
};

exports.cart_delete = function(req, res) {
    
  res.send('NOT IMPLEMENTED: cart_delete');
};

exports.cart_clear = function(req, res) {
    
  res.send('NOT IMPLEMENTED: cart_clear');
};


