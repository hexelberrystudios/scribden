if (!process.env.SQL_HOST) {
  const env = require('./env');
}

var koa = require('koa'),
    app = koa();
const 
      sqlConfig        = require('./sqlConfig'),
      api              = require('./controllers/api'),
      routes           = require('./controllers/routes'),
      flash            = require('koa-flash'),
      knex             = require('knex')(sqlConfig),
      session          = require('koa-generic-session'),
      KnexSessionStore = require('connect-session-knex')(session),
      sessionStore     = new KnexSessionStore({ tablename: 'sessions', knex: knex }),
      env              = process.env;

let server = http.createServer(function (req, res) {
  let url = req.url;
  if (url == '/') {
    url += 'index.html';
  }

  // IMPORTANT: Your application HAS to respond to GET /health with status 200
  //            for OpenShift health monitoring

  if (url == '/health') {
    res.writeHead(200);
    res.end();
  } else if (url.indexOf('/info/') == 0) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
  } else {
    fs.readFile('./static' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        let ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
  }
});

server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
