'use strict';

var user = require('./api/user');
var thread = require('./api/thread');
var post = require('./api/post');
var reply = require('./api/reply');
var report = require('./api/report');
var track = require('./api/track');

function restrict (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        req.flash('error', ['Access denied!']);
        res.redirect('/'); // send to register/promotion page
    }
}

// auth example
// app.post('/api/post', restrict, thread.get);
// NOTE: Authorization should only be required for actions, such as replying, posting, creating new threads, etc.

// @TODO
module.exports = function (app) {
    app.post('/api/user/login', user.login);
    app.get('/api/user/logout', user.logout);
    app.post('/api/user/register', user.register);
    app.get('/api/thread', thread.index);
    app.get('/api/thread/:id', thread.get);
    app.post('/api/thread', restrict, thread.save);
    app.get('/api/track', restrict, track.index);
    app.get('/api/track/:id', restrict, track.save);
    app.get('/api/track/remove/:id', restrict, track.remove);
    app.get('/api/post', post.index);
    app.post('/api/post', restrict, post.save);
    app.post('/api/report', restrict, report.save);
};
