'use strict';

var post = {};

// required parameters: threadId
post.index = function index (req, res, next, callback, threadId, page) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    if (!page) {
        page = 0;
    }
    // using raw query so that we can get a subset of our request
    // and get the total count of posts for our request in one go
    knex.raw('select SQL_CALC_FOUND_ROWS posts.id, content, replyId, userId, posts.updated_at, users.username from posts inner join users on users.id = posts.userId where threadId = ' + threadId + ' order by posts.updated_at asc limit 20 offset ' + (page * 20))
    .then(function (result) {
        var rows = result[0]; // For some reason, knex.raw sends back an array of two things. First is our results. I don't understand what the second one is.
        knex.raw('select FOUND_ROWS()')
        .then(function (count) {
            var date = require('../../shared/date');
        
            rows = date.formatUpdateAt(rows);
            console.log(rows);
            
            if (callback) {
                callback({
                    data: rows,
                    count: count
                });
            } else {
                res.json({
                    data: rows,
                    count: count
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            
            if (!callback) {
                req.flash('error', [error.code]);
                res.redirect('/recent');
            } else {
                callback(undefined, error.code);
            }
        });
    }).catch(function (error) {
        console.log(error);
        
        if (!callback) {
            req.flash('error', [error.code]);
            res.redirect('/recent');
        } else {
            callback(undefined, error.code);
        }
    });
};

post.save = function save (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    var now = date.sqlNow();
    var insane = require('insane');
    
    console.log('saving post');
    // clean up html to only allow a subset of html
    // see https://github.com/bevacqua/insane for documentation and defaults
    var content = insane(req.body.content);
    console.log(content);
    // second condition is checking for non-empty posts
    if (req.body.content && req.body.content.indexOf('<div><br></div>') !== 0 && req.body.threadId && req.body.userId) {
        console.log('inserting post');
        knex('posts').insert({
            content: content,
            userId: req.body.userId,
            threadId: req.body.threadId,
            created_at: now,
            updated_at: now
        }).then(function (rows) {
            console.log(rows);
            res.redirect('/thread/' + req.body.threadId);
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.status(500).send();
        });
    } else {
        req.flash('error', ['No post data submitted.']);
        res.status(500).send();
    }
};

module.exports = post;