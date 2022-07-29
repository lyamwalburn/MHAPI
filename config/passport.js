const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const config = require('../config/config')
const User = require('../models/User')

module.exports = async function (passport) {

    //Local Signup -----------------------------------------------------------------------------------------------------------------------------------------------------------
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req,email,password,done){
        //async
        //user.findOne wont fire unless data is sent back
        process.nextTick(function(){
            //find user whos email is the same asthe forms email
            User.findOne({'email' : email}, function(err,user){
                if(err)
                    return done(err)
                //check to see if theres already a user with that email
                if(user){
                    return done(null,false,req.flash('signupMessage','That email is taken.'))
                } else {
                    //if there is no user with that email create the user
                    let newUser = new User()
                    //set user's local credentials
                    newUser.displayName = req.body.name
                    newUser.email = email
                    newUser.password = newUser.generateHash(password)

                    newUser.save(function(err){
                        if(err)
                            throw err
                        return done(null,newUser)
                    })
                }
            })
        })
    }
    ))
    //Local-login--------------------------------------------------------------
    passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  }, function(req,email,password,done){
      User.findOne({'email':email}, function(err,user){
          if(err)
              return done(err)
          if(!user)
              return done(null,false,req.flash('loginMessage','User not found.'))
          if(!user.validPassword(password))
              return done(null,false,req.flash('loginMessage','Invalid password.'))

          return done(null,user)
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}