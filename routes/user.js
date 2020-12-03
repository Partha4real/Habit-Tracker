const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const Habit = require('../models/Habit');

//@desc     login for user
//@route    POST /login
//@access   PUBLIC
router.get('/', (req, res) => {
    res.render('login',  {layout: "user_layout"});
});

//@desc     Registration for user
//@route    POST /register
//@access   PUBLIC
router.get('/register', (req, res) => {
    res.render('register',  {layout: "user_layout"});
});

//@desc     Dashboard
//@route    GET /dashboard
//@access   PRIVATE
router.get('/dashboard', async (req, res) => {
    try {
        let habit = await Habit.find({email: req.user.email}).lean();
        if(!habit){
            req.flash('error_msg', 'No habits');
            return;
        } 
        // const array = []
        // array.push(habit)
        
        res.render('dashboard', {
            //name: req.user.firstName,
            layout: "habit_layout",
            user: req.user,
            Habits: habit,
        })
    } catch (err) {
        console.error(err);
    }
   
});

//@desc     Registration for user
//@route    POST /auth/register
//@access   PUBLIC
router.post('/register', async (req, res) => {
    console.log(req.body);
    const {name, email, password, passwordConfirmation} = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !passwordConfirmation) {
        errors.push({msg: 'Please fill in all fields'})
    }
    //check password match
    if (password !== passwordConfirmation) {
        errors.push({msg: 'Password do not match'})
    }
    //password length
    if (password.length <6) {
        errors.push({msg: 'Password should be atleast 6 characters'})
    }

    if (errors.length >0) {
        res.render('register', {
            layout: "user_layout",
            errors,
            name, 
            email, 
            password
        })
    } else {
        try {
            let user = await User.findOne({email: email})
            if (user) {
                //user existe
                errors.push({msg: 'Email is already registered'})
                res.render('register', {
                    layout: "user_layout",
                    errors,
                    name, 
                    email
                })
            } else {
                //new user
                const newUser = new User({
                    name, 
                    email, 
                    password
                });

                //encrypt password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        try {
                            newUser.save()
                            req.flash('success_msg', 'You are now registered and can login')
                            res.redirect('/user/')
                        } catch (err) {
                            console.error(err);
                        }
                    }) 
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
});

//@desc     login for user
//@route    POST /auth/login
//@access   PUBLIC
router.post('/login', async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/',
        failureFlash: true
    })(req, res, next);
});

//@desc     logout user
//@route    /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/user/');
});


module.exports = router;