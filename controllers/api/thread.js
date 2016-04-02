'use strict';

var thread = {};

// callback: let the caller define what to do after data is retrieved, if defined
thread.index = function index (req, res, next, callback, page, filter) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    
    var query = knex('threads').select('id', 'description', 'updated_at');
    
    if (page && page > 0) {
        // get the next page of results
        query.limit(20).offset(page * 20);
    } else if (page && page === 'all') {
        // get all results; do not limit
    } else {
        // get the first page of results
        query.limit(20);
    }
    
    query.orderBy('updated_at', 'desc');
    
    if (filter) {
        // use search to find the most relevant results
        query.where('description', 'like', '%' + filter + '%');
    }
    
    query.then(function (rows) {
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
};

thread.get = function get (req, res, next, callback, id) {
    var query;
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    // retrieve the requested thread
    if (req.session.user && req.session.user.id) {
        // check to see if the thread is tracked by the current user.
        query = knex('threads').select('threads.id', 'threads.description', 'threads.ruleset', 'threads.updated_at', 'trackedThreads.userId')
        .where({
            id: id
        }).leftJoin('trackedThreads', function () {
            this.on('threads.id', '=', 'trackedThreads.threadId').on('trackedThreads.userId', '=', req.session.user.id);
        });
    } else {
        // can't check for tracked threads when there's no user logged in
        query = knex('threads').select('id', 'description', 'ruleset', 'updated_at')
        .where({
            id: id
        });
    }
    
    query.then(function (rows) {
        var result;
        var date = require('../../shared/date');
        
        rows = date.formatUpdateAt(rows);
        
        if (rows.length > 0) {
            result = rows[0];
        } else {
            req.flash('error', ['Thread not found.']);
        }
        
        if (callback) {
            callback(result);
        } else {
            res.json(result);
        }
    }).catch(function (error) {
        console.log(error);
        
        if (!callback) {
            req.flash('error', [error.code]);
            res.redirect('/thread/' + id);
        } else {
            callback(undefined, error.code);
        }
    });
};

thread.save = function save (req, res, next) {
    var sqlConfig = require('../../sqlConfig');
    var knex = require('knex')(sqlConfig);
    var date = require('../../shared/date');
    var now = date.sqlNow();
    
    if (req.body.description && req.body.ruleset) {
        knex('threads').insert({
            description: req.body.description,
            ruleset: req.body.ruleset,
            createdBy: req.body.createdBy,
            created_at: now,
            updated_at: now
        }).then(function (rows) {
            console.log(rows);
            res.redirect('/thread/' + rows[0]);
        }).catch(function (error) {
            console.log(error);
            req.flash('error', [error.code]);
            res.status(500).send();
        });
    } else {
        req.flash('error', ['Parameters are missing. Please fill out the form.']);
        res.status(500).send();
    }
};

module.exports = thread;