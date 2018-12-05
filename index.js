/*
* Primary file for API
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

//create server
const server = http.createServer((req, res) => {
  //parse req url
  const parsedUrl = url.parse(req.url, true);

  //path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //get query string as an object
  const queryStringObject = parsedUrl.query;

  //get http method
  const method = req.method.toLowerCase();

  //get headers
  const headers = req.headers;

  //get payload
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  })

  req.on('end', () => {
    buffer += decoder.end();

    //choose handler
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //data object for handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }

    //route request to handler
    chosenHandler(data, (statusCode, payload) => {
      //use the status code
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      payload = typeof (payload) == 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString)
    })
  })
});

//Start server on designated port
server.listen(config.httpPort, () => {
  console.log(`servers listening on port ${config.httpPort}`);
});

//Define the handlers
let handlers = {};

handlers.hello = (data, callback) => {
  callback(200, { 'message': 'Hello World' });
}

handlers.notFound = (data, callback) => {
  callback(404);
}

//Define router
const router = {
  'hello': handlers.hello
}
