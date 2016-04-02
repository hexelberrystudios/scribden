'use strict';

module.exports = function (req, res, next) {
    var model;
    
    // post id
    if (!req.session.user) {
        res.redirect('/'); // @TODO: redirect to promotion page to encourage registration
        next(); 
    } else {
        model = {
                id: req.params.id,
                threadId: req.params.threadId,
                apiUrl: '/api/report',
                user: req.session.user,
                pageTitle: 'Report'
            };
            
        res.render('app/report', model);
    }
};
