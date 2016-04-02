'use strict';

module.exports = function (req, res, next) {
    var model = {};
    
    res.render('app/ruleset', model);
};
