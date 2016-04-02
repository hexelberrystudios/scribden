// DEPRECATED
/*
'use strict';

module.exports = function (req, res, next) {
    // reply id
    if (!req.session.user) {
        res.redirect('/'); // @TODO: redirect to promotion page to encourage registration
        next(); 
    } else {
        res.viewModel = {
            model: {
                id: req.params.id,
                threadId: req.params.threadId,
                apiUrl: '/api/reply',
                user: req.session.user
            }
        };
        next();
    }
};
*/