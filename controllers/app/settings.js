'use strict';

module.exports = function (req, res, next) {
    var model = {};
    
    if (req.session.user) {
        model.userId = req.session.user.id;
    }
    
    res.render('app/settings', model);
};
