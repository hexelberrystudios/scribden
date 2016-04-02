'use strict';

module.exports = function (req, res, next) {
    var model;
    
    if (!req.session.user) {
        res.redirect('/'); // @TODO: redirect to promotion page to encourage registration
        next(); 
    } else {
        model = {
                id: req.params.id,
                threadId: req.params.id,
                apiUrl: '/api/post',
                user: req.session.user,
                pageTitle: 'Compose'
            };
            
        res.render('app/compose', model);
    }
};
