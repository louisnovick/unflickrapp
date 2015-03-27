

var User = require('../models/user');   // grabs user model
var passport = require('passport');     


//takes an error from a Mongoose error object
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {

        switch (err.code) {

            case 11000:             // ?predefined?, ?mongoose predefined?
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong.';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};


// if user that is requires by passport
// is not signed in then we need to ask them to.
exports.renderSignin = function(req,res,next) {
    if (!req.user) {    
        res.render('signin', {
            title: 'Sign-in',
            error: req.flash('error') || req.flash('info')  // ?sends to flash?
            
        });
    } else {
        return res.redirect('/');   // !if failed w/ redirect! 
    }
};

exports.renderSignup = function(req,res,next) {
    //returns an error if the user can't be signed up
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up',
            error: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};


//makes a new local user from the signup information
exports.signup = function(req, res,next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        
        user.provider = 'local';
        
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err)
                    return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};

//sends a logout request and reloads the main page
exports.signout = function(req,res) {
    req.logout();
    res.redirect('/');
};