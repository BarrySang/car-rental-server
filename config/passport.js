const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyCallback = (email, password, done) => {
    User.findOne({ where: { email: email}})
    .then(user => {

        // check if a user has been found
        if(!user) {return done(null, false)}

        // compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                done(err);
            }

            if(!isMatch) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        })
        
    })
    .catch(err => {
        console.log(err);
        done(err);
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findByPk(userId)
    .then((user) => {
        done(null, user);
    })
    .catch(err => done(err));
});