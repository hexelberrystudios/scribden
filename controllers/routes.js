'use strict';

var homeRoutes = {
    index: require('./home/index'),
    register: require('./home/register'),
    about: require('./home/about'),
    tos: require('./home/tos'),
    privacy: require('./home/privacy')
};
var appRoutes = {
    recent: require('./app/recent'),
    tracked: require('./app/tracked'),
    notifications: require('./app/notifications'),
    settings: require('./app/settings'),
    thread: require('./app/thread'),
    compose: require('./app/compose'),
    report: require('./app/report'),
    ruleset: require('./app/ruleset')
};

module.exports = function (app) {
    app.get('/', homeRoutes.index);
    app.get('/register', homeRoutes.register);
    app.get('/about', homeRoutes.about);
    app.get('/tos', homeRoutes.tos);
    app.get('/privacy', homeRoutes.privacy);
    app.get('/recent', appRoutes.recent);
    app.get('/recent/:page', appRoutes.recent);
    app.get('/tracked', appRoutes.tracked);
    app.get('/notifications', appRoutes.notifications);
    app.get('/settings', appRoutes.settings);
    app.get('/thread', appRoutes.thread);
    app.get('/thread/:id', appRoutes.thread);
    app.get('/thread/:id/:page', appRoutes.thread);
    app.get('/compose/:id', appRoutes.compose);
    app.get('/report/:threadId/:id', appRoutes.report);
    app.get('/ruleset', appRoutes.ruleset);
};
