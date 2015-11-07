var express = require('express');
var router = express.Router();

module.exports.getRouter = function(io){
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index.html');
	});

	return router;
};
