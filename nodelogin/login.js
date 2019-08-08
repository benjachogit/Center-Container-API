const mariadb = require('mariadb'); // เรียกใช้งาน Mariadb 
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const pool = mariadb.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'tan0895724323',
    database : 'testing'
})

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	pool.getConnection()
    	.then(conn => {
	if (username && password) {
		conn.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password])
		.then((rows) => {
			if (rows.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
	})
});


app.get('/home', (req, res) => {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.listen(3000);
