// DEPRECATED
/*
'use strict';

module.exports = function (req, res, next) {
    var reply = require('../api/reply');
    var threadId = req.params.threadId;
    
    if (req.params.id && req.params.threadId) {
        reply.index(req, res, next, function (rows, err) {
            if (err) {
                req.flash('error', [err]);
            } else {
                res.viewModel = {
                    model: {
                        thread: {
                            id: threadId,
                            posts: rows,
                            replyId: rows[0].replyId
                        }
                    }
                };
            }
            console.log(res.viewModel);
            
            next();
        }, req.params.threadId, req.params.id);
    } else {
        req.flash('error', ['thread id/reply id is undefined']);
        next();
    }
};
*/