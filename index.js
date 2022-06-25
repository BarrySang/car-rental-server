// dependencies
const express = require("express");
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
let passport = require('passport');

// import model associations file


const app = express();

// global variables
const port = 5000;

// global middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// session
const Sequelize = require('sequelize');
const sessionsDatabase = new Sequelize('car_rental_sessions', 'root', 's3ntinel', {
    host: 'localhost',
    dialect: 'mysql'
});

const sequelizeSessionStore = new SessionStore({
    db: sessionsDatabase,
});

app.use(cookieParser());
app.use(expressSession({
    secret: 'keep it secret, keep it safe.',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// passport
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    next();
});

// routes
app.use('/auth', require('./routes/auth'));
app.use('/vehicles', require('./routes/vehicles'));

// listen to a port
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});