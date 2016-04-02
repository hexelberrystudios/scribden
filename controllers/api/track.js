'use strict';

var track = {};

track.index = function index (req, res, next, callback) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    if (req.session.user) {
        // @TODO: param for next 20 threads
        knex('threads').select('threads.id', 'threads.description', 'threads.updated_at', 'trackedThreads.userId')
        .limit(20).orderBy('updated_at', 'desc')
        .leftJoin('trackedThreads', function () {
            this.on('threads.id', '=', 'trackedThreads.threadId').on('trackedThreads.userId', '=', req.session.user.id);
        })
        .where({
            userId: req.session.user.id
        }).then(function (rows) {
            var date = require('../../shared/date');
            
            rows = date.formatUpdateAt(rows);
            
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
    } else {
        req.flash('error', ['You are not logged in. Please log in and try again.']);
        res.status(403).send();
    }
};

track.save = function save (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    var now = date.sqlNow();
    
    if (req.params.id && req.session.user) {
        knex('trackedThreads').insert({
            threadId: req.params.id,
            userId: req.session.user.id,
            created_at: now,
            updated_at: now
        }).then(function (rows) {
            console.log(rows);
            res.redirect('/thread/' + req.params.id);
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.status(500).send();
        });
    } else {
        req.flash('error', ['Failed to track thread. Please try again later.']);
        res.status(500).send();
    }
};

track.remove = function remove (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    if (req.params.id && req.session.user) {
        // make sure that the user removing the follow is the right one
        knex('trackedThreads').where({
            threadId: req.params.id,
            userId: req.session.user.id
        }).del().then(function (rows) {
            res.redirect('/thread/' + req.params.id);
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.status(500).send();
        });
    } else {
        req.flash('error', ['Failed to remove track. Please try again later.']);
        res.status(500).send();
    }
};

module.exports = track;