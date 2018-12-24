/// automatic import
const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {

    const router = express.Router();
    /* eslint-disable import/no-dynamic-require */
    require(`./${routeName}`)(router);
    app.use(`/${changeCase.paramCase(routeName)}`, router);
    
  });
};
