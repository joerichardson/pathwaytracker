var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	console.log('getting index request');
	console.log(__dirname + '/../client/build/index.html')
	res.sendFile(path.join(__dirname + '../client/build/index.html'));
});

module.exports = router;
