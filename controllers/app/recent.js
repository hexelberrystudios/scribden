'use strict';

module.exports = function (req, res, next) {
    // if (req.query && req.query.search) { // filter thread list results }
    //console.log(req.query);
    var thread = require('../api/thread');
    thread.index(req, res, next, function (rows, err) {
        var model = {
                threads: rows
            };
        
        // get the next page number of results,
        // used for results greater than 20
        if (req.params.page) {
            model.nextPage = parseInt(req.params.page) + 1;
        } else {
            // first page of results
            model.nextPage = 1;
        }
        
        if (req.session.user) {
            model.userId = req.session.user.id;
        }
        
        if (err) {
            req.flash('error', [err]);
        }
        
        res.render('app/recent', model);
    }, req.params.page, req.query.search);
};
