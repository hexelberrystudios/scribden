// DEPRECATED
/*
'use strict';

var reply = {};

reply.index = function index (req, res, next, callback, threadId, replyId) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    knex('posts').select('posts.id', 'content', 'replyId', 'userId', 'posts.updated_at', 'users.username')
    .where({
        threadId: threadId,
        replyId: replyId
    })
    .innerJoin('users', 'users.id', 'posts.userId')
    .orderBy('updated_at', 'asc')
    .then(function (rows) {
        var date = require('../../shared/date');
        
        rows = date.formatUpdateAt(rows);
        console.log(rows);
        
        if (callback) {
            callback(rows);
        } else {
            res.json(rows);
        }
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

reply.save = function save (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    var now = date.sqlNow();
    var insane = require('insane');
    
    // clean up html to only allow a subset of html
    // see https://github.com/bevacqua/insane for documentation and defaults
    var content = insane(req.body.content);
    
    if (req.body.content && req.body.threadId && req.body.userId && req.body.id) {
        knex.transaction(function (trx) {
            knex('posts').insert({
                content: content,
                userId: req.body.userId,
                threadId: req.body.threadId,
                replyId: req.body.id, // id of the post the user is replying to
                created_at: now,
                updated_at: now
            })
            .transacting(trx)
            .then(function (results) {
                // update the original post with the reply id to connect them
                knex('posts').update({
                    replyId: req.body.id
                }).where({
                    id: req.body.id
                })
                .transacting(trx)
                .then(trx.commit)
                .catch(trx.rollback);
            }).catch(trx.rollback);
        }).then(function (rows) {
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

module.exports = reply;
*/