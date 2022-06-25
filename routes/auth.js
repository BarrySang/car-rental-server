const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// register user
router.post('/register', (req, res, next) => {
    // get registration details from request
    const {first_name, last_name, phone, email, pwd, admin} = req.body;

    // check for missing fields
    if(!first_name || !last_name || !phone || !email || !pwd) {
        res.status(400).json({msg: 'akk fields must be filled'});
    } else {
        
        // check for existing email
        User.findOne({where: {email: email}})
        .then(user => {
            if(user) {
                res.status(409).json({msg: 'email already in use'});
            } else {
                // hash pasword
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(pwd, salt, (err, hash) => {
                        if(err) {
                            res.status(500).json({msg: 'internal server error'});
                            console.log(err);
                        } else {
                            // set 'password' variable
                            const password = hash;

                            // add user to database
                            User.create({
                                first_name,
                                last_name,
                                phone,
                                email,
                                password,
                                admin
                            })
                            .then(user => {
                                res.status(200).json(user);
                            })
                            .catch(err => {
                                res.status(500).json({msg: 'internal server error'});
                                console.log(err);
                            });
                        }
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({msg: 'internal server error'});
            console.log(err);
        });
    }
});

// login user
router.post('/login', passport.authenticate('local', { failureRedirect: 'login-failure', successRedirect: 'login-success' }));

// logout user
// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});


// succesful login
router.get('/login-success', (req, res, next) => {
    res.status(200).json({msg: 'logged in succesfully'});
});

// failed login
router.get('/login-failure', (req, res, next) => {
    res.status(200).json({msg: 'login failed'});
});

module.exports = router;