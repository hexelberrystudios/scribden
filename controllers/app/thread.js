'use strict';

module.exports = function (req, res, next) {
    var id = req.params.id;
    
    if (id) {
        var thread = require('../api/thread');
        var post = require('../api/post');
        
        thread.get(req, res, next, function (row, err) {
            var model = {
                    thread: row
                };
            
            if (req.session.user) {
                model.userId = req.session.user.id;
            }
            
            // get the next page number of results,
            // used for results greater than 20
            if (req.params.page) {
                model.nextPage = parseInt(req.params.page) + 1;
            } else {
                // first page of results
                model.nextPage = 1;
            }
            
            if (err) {
                req.flash('error', [err]);
                next();
            } else if (!row) {
                req.flash('error', ['Thread not found.']);
                next();
            } else {
                post.index(req, res, next, function (result, err) {
                    if (result) {
                        model.thread.posts = result.data;
                        model.pageCount = result.count / 20;
                    }
                    
                    if (err) {
                        req.flash('error', [err]);
                    }
                    
                    res.render('app/thread', model);
                }, req.params.id, req.params.page);
            }
        }, req.params.id);
    } else {
        throw new Error('thread id is undefined');
        res.render('app/thread');
    }
};
