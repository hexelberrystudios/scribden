module.exports = {
				  client: 'mysql',
				  connection: {
				    host     : process.env.SQL_HOST,
				    user     : process.env.SQL_USER,
				    password : process.env.SQL_PASSWORD,
				    database : process.env.SQL_DATABASE,
				    timezone : 'UTC'
				  }
				};