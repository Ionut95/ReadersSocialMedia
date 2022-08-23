var express = require('express');
var router = express.Router();
//const { register } = require('../controllers/register');
var { login, register } = require('../controllers/users')

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

router.post('/register/user', register);

router.post('/login/user', login);

module.exports = router;
