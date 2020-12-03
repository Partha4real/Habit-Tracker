const localStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const passport = require('passport');

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => {
        //match user
        try {
            let user = await User.findOne({email: email})
            if (!user) {
                return done(null, false, {message: 'Email is not registered'})
            }

            //match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if (isMatch) {
                    return done(null, user)
                    res.redirect('/dashboard')
                } else {
                    return done(null, false, {PasswordError: 'password incorect'})
                }
            })
        } catch (err) {
            console.error(err);
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}