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

const cacheService = require('./components/cache-service');
cacheService.loadCoreg39CoursesToMap().then(() => {
  log.info('Loaded coreg 39 courses data to memory');
}).catch((e) => {
  log.error('Error loading coreg 39 courses during boot .', e);
});

cacheService.loadGenderCodes().then(() => {
  log.info('Loaded gender codes data to memory');
}).catch((e) => {
  log.error('Error loading gender codes during boot .', e);
});

cacheService.loadStudentGradeCodes().then(() => {
  log.info('Loaded student grade codes to memory');
}).catch((e) => {
  log.error('Error loading student grade codes during boot.', e);
});

cacheService.loadAssessmentTypeCodes().then(() => {
  log.info('Loaded assessment type codes to memory');
}).catch((e) => {
  log.error('Error loading assessment type codes during boot.', e);
});

cacheService.loadGradProgramCodes().then(() => {
  log.info('Loaded graduation program codes to memory');
}).catch((e) => {
  log.error('Error loading graduation program codes during boot.', e);
});

cacheService.loadOptionalProgramCodes().then(() => {
  log.info('Loaded optional program codes to memory');
}).catch((e) => {
  log.error('Error loading optional program codes during boot.', e);
});

cacheService.loadLetterGradeCodes().then(() => {
  log.info('Loaded letter grade codes to memory');
}).catch((e) => {
  log.error('Error loading letter grade codes during boot.', e);
});

cacheService.loadCareerProgramCodes().then(() => {
  log.info('Loaded career program codes to memory');
}).catch((e) => {
  log.error('Error loading career program codes during boot.', e);
});

cacheService.loadCitizenshipCodes().then(() => {
  log.info('Loaded citizenship codes to memory');
}).catch((e) => {
  log.error('Error loading citizenship codes during boot.', e);
});

cacheService.loadCountryCodes().then(() => {
  log.info('Loaded country codes to memory');
}).catch((e) => {
  log.error('Error loading country codes during boot.', e);
});

cacheService.loadProvinceCodes().then(() => {
  log.info('Loaded province codes to memory');
}).catch((e) => {
  log.error('Error loading province codes during boot.', e);
});

cacheService.loadExaminableCourses().then(() => {
  log.info('Loaded examinable courses to memory');
}).catch((e) => {
  log.error('Error loading examinable courses during boot.', e);
});

cacheService.loadInstituteSchools().then(() => {
  log.info('Loaded institute schools to memory');
}).catch((e) => {
  log.error('Error loading institute schools during boot.', e);
});

cacheService.loadInstituteDistricts().then(() => {
  log.info('Loaded institute districts to memory');
}).catch((e) => {
  log.error('Error loading institute districts during boot.', e);
});

// Start the cache reload scheduler (runs nightly at 12:15 AM)
require('./components/scheduler');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(config.get('server:port'));
app.set('port', port);
const server = http.createServer(app);

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
