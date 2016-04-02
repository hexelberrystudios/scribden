'use strict';

var report = {};

report.save = function save (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    var now = date.sqlNow();
    var insane = require('insane');
    
    // clean up html to only allow a subset of html
    // see https://github.com/bevacqua/insane for documentation and defaults
    var content = insane(req.body.content);
    
    if (req.body.content && req.body.userId && req.body.id) {
        knex('reports').insert({
            complaint: content,
            reporterId: req.body.userId,
            postId: req.body.id, // id of the post the user is replying to
            created_at: now,
            updated_at: now
        })
        .then(function (rows) {
            res.redirect('/thread/' + req.body.threadId);
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.status(500).send();
        });
    } else {
        req.flash('error', ['Parameters are missing. Please fill out the form.']);
        res.redirect('/thread/' + req.body.threadId);
    }
};

module.exports = report;