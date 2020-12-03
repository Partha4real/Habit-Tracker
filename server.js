const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const maorgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const connectDB = require('./config/db');


// express init
const app = express();

// config
dotenv.config({path: './config/config.env'});

// passport config
require('./config/passport')(passport)

// connect DB
connectDB();

// body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

var midnight = "0:00:00";
var now = null;



// morgan
app.use(morgan('dev'));

// public folder
app.use(express.static(path.join(__dirname, 'public')));

// passport-middleware
app.use(passport.initialize());
app.use(passport.session());

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')
app.set('layout', path.join(__dirname, 'viewa'));
app.set('user_layout', 'habit_layout');

// routes
app.use('/user', require('./routes/user'));
app.use('/habit', require('./routes/habit'));

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Running '+PORT));
