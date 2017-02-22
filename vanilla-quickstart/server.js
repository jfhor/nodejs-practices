var http = require('http');
var url = require('url');
var querystring = require('querystring');
var EventEmitter = require('events').EventEmitter;
var var1 = require('./mypackages/mymodule'); // custom package

var control = new EventEmitter();

var func1 = function(req, res) {
	var page = url.parse(req.url).pathname;
	var params = querystring.parse(url.parse(req.url).query);

	console.log(page);

	res.writeHead(200, {"Content-Type": "text/html"});

	if (page == '/') {
		var1.logHomepage('Argument.');
		res.write('homepage');

	} else if (page == '/name') {
		if ('firstname' in params && 'lastname' in params) {
	        res.write('Your name is ' + params['firstname'] + ' ' + params['lastname']);
	    }
	    else {
	        res.write('You do have a first name and a last name, don\'t you?');
	    }
	} else if (page == '/shutdown') {
		control.emit('shutdown', 'Shutdown server.');
	} else {
		res.write('request not found');
	}

	res.end();
}

var server = http.createServer(func1);

server.on('close', function() {
	console.log('server closed');
});

control.on('shutdown', function(message) {
	console.log(message);
	server.close(); // not working
})

server.listen(8080);
