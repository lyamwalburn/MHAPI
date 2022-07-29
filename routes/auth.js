const express = require('express')
const passport = require('passport')
const config = require('../config/config')
const router = express.Router()


router.get('/login', (req, res) => {
  res.render('login.ejs', {message: req.flash('loginMessage')})
})

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/recipes',
  failureRedirect: '/auth/login',
  failureFlash: true
}))

  //Logout
  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/signup', (req, res) => {
  res.render('signup.ejs',{message: req.flash('signupMessage')})
})
 //process the signup form
 router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/auth/login',
  failureRedirect: '/auth/signup',
  failureFlash: true
}))

module.exports = router