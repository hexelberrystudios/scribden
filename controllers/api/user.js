'use strict';

var user = {};

user.login = function login (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    if (req.body.username && req.body.email) {
        knex('users').select('id', 'username', 'status', 'restoreDate').where({
            username: req.body.username,
            email: req.body.email
        }).then(function (rows) {
            if (rows.length === 1) {
                req.session.regenerate(function () {
                    req.session.user = rows[0];
                    res.redirect('/recent');
                });
            } else if (rows.length > 1) {
                req.flash('error', ['There is an issue with your account. Please contact support at hexelberrystudios@gmail.com']);
                res.redirect('/');
            } else {
                req.flash('error', ['User or email is incorrect.']);
                res.redirect('/');
            }
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.redirect('/');
        });
    } else {
        req.flash('error', ['Parameters are missing. Please complete the form.']);
        res.redirect('/');
    }
};

user.logout = function logout (req, res, next) {
    req.session.destroy(function(){
        res.redirect('/');
    });
};

user.register = function register (req, res, next) {
    var now;
    var hasError = false;
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    
    if (!req.body.username || !req.body.email) {
        req.flash('error', ['Parameters are missing. Please fill out the form.']);
        hasError = true;
    } else {
        if (!/[a-z0-9_-]{3,15}/.test(req.body.username)) {
            req.flash('error', ['Username must be alphanumeric and 3 to 15 characters long.']);
            hasError = true;
        }
        
        if (req.body.email.indexOf('@') === -1 || req.body.email.length >= 255) {
            req.flash('error', ['Email is invalid.']);
            hasError = true;
        }
    }
    
    if (!hasError) {
        now = date.sqlNow();
        
        knex('users').insert({
            username: req.body.username,
            email: req.body.email,
            created_at: now,
            updated_at: now
        }).then(function (rows) {
            console.log(rows);
            req.session.regenerate(function () {
                req.session.user = {
                    id: rows[0],
                    username: req.body.username,
                    email: req.body.email
                };
                res.redirect('/recent');
            });
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.redirect('/register');
        });
    } else {
        res.redirect('/register');
    }
};

module.exports = user;