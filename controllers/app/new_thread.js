'use strict';

module.exports = function (req, res, next) {
    var model;
    
    if (!req.session.user) {
        res.redirect('/'); // @TODO: redirect to promotion page to encourage registration
        next(); 
    } else {
        model = {
                user: req.session.user
            };
            
        res.render('app/new_thread', model);
    }
};
