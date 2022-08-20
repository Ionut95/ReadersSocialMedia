var express = require('express');
var router = express.Router();
const { register } = require('../controllers/register');
var { login } = require('../controllers/login')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register/user', register);

router.post('/login/user', login);

module.exports = router;
