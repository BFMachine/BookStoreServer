/*
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

/// automatic import
const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {

    const router = express.Router();
    require(`./${routeName}`)(router);
  
    app.use(`/${changeCase.paramCase(routeName)}`, router);
  });
};


//module.exports = router;
