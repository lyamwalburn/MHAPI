const express = require('express')
const passport = require('passport')
const config = require('../config/config')
const router = express.Router()


router.get('/login', (req, res) => {
  res.render('login.ejs')
})

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/recipes',
  failureRedirect: '/auth/login',
  failureFlash: false
}))

  //Logout
  router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/signup', (req, res) => {
  res.render('signup.ejs')
})
 //process the signup form
 router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/auth/login',
  failureRedirect: '/auth/signup',
  failureFlash: false
}))

module.exports = router