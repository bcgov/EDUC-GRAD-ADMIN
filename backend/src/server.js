'use strict';

const config = require('./config/index');
const http = require('http');
const log = require('./components/logger');
const localDateTime = require('@js-joda/core').LocalDateTime;
//Add timestamp to log
Object.defineProperty(log, 'heading', { get: () => { return localDateTime.now().toString(); } });

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(config.get('server:port'));
app.set('port', port);
const server = http.createServer(app);

//Create Cache for schools
const cacheService = require('./components/cache-service');
cacheService.loadStudentStatusCodes().then(() => {
  log.info('Loaded studentstatus code data to memory');
}).catch((e) => {
  log.error('Error loading student status code during boot .', e);
});
cacheService.loadProgramCodes().then(() => {
  log.info('Loaded program code data to memory');
}).catch((e) => {
  log.error('Error loading program code during boot .', e);
});
cacheService.loadAllSchoolsToMap().then(() => {
  log.info('Loaded school data to memory');
}).catch((e) => {
  log.error('Error loading schoolsMap during boot .', e);
});
//Create Cache for districts
cacheService.loadAllDistrictsToMap().then(() => {
  log.info('Loaded district data to memory');
}).catch((e) => {
  log.error('Error loading districtssMap during boot .', e);
});
//Create Cache for program codes.


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const portNum = parseInt(val, 10);

  if (isNaN(portNum)) {
    // named pipe
    return val;
  }

  if (portNum >= 0) {
    // port number
    return portNum;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    log.error(bind + ' requires elevated privileges');
    break;
  case 'EADDRINUSE':
    log.error(bind + ' is already in use');
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  log.info('Listening on ' + bind);
}

process.on('SIGINT',() => {
  server.close(() => {
    log.info('process terminated');
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    log.info('process terminated');
  });
});

//exports are purely for testing
module.exports = {
  normalizePort,
  onError,
  onListening,
  server
};
