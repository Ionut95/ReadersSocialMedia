require('dotenv').config()
var express = require('express');
var router = express.Router();
const { accessHomepage, accessLoginpage } = require('../controllers/login');
const { getUser } = require('../configs/dbQueries');

/* GET home page. */
router.get('/', function(req, res, next) {
  const flashMessage = req.flash('flMess')
  res.render('pages/register', { flashMessage });
});

router.get('/pages/login', accessLoginpage, function(req, res) {
  const flashMessage = req.flash('flMess');
  //console.log(flashMessage);
  res.render('pages/login', { flashMessage });
});

router.get('/pages/welcome', accessHomepage, async function(req, res) {
  //console.log('pw%' + process.env.USER);
  let data = await getUser(process.env.USER);
  res.render('pages/welcome', { data });
});

router.get('/logout', function(req, res) {
  res.clearCookie('token');
  req.flash('flMess', 'Log in again!')
  res.redirect('pages/login');
});

module.exports = router;