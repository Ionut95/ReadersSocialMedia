require('dotenv').config()
var express = require('express');
var router = express.Router();
const { accessHomepage, accessLoginPage } = require('../controllers/users');
const { getUser } = require('../configs/dbQueries');

/* GET home page. */
router.get('/', function(req, res, next) {
  const flashMessage = req.flash('flMess')
  res.render('pages/register', { flashMessage });
});

router.get('/login', accessLoginPage, function(req, res) {
  const flashMessage = req.flash('flMess');
  //console.log(flashMessage);
  res.render('pages/login', { flashMessage });
});

router.get('/welcome', accessHomepage, async function(req, res) {
  //console.log('pw%' + process.env.USER);
  let data = await getUser(process.env.USER);
  res.render('pages/welcome', { data });
});

router.get('/logout', function(req, res) {
  res.clearCookie('token');
  req.flash('flMess', 'Log in again!')
  res.redirect('/login');
});

module.exports = router;
