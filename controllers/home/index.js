'use strict';

/*
 * This is the controller action for home/index. By default it'll render the home/index view
 *   when `next` is called. You could change that by setting model.action to some other view
 * Everything that's on the model will be passed to every view.
 * http://taunus.bevacqua.io/api#server-side-controllers
 */
module.exports = function (req, res, next) {
  var model = {};
  
  if (req.query.referred_from) {
    req.flash('error', ['You are currently logged out. Either log in, or register.'])
  }
  
  res.render('home/index', model);
};
