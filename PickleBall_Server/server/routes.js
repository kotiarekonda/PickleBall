/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/locationss', require('./api/locations'));
  app.use('/api/EventPlayerLists', require('./api/EventPlayerList'));
  app.use('/api/TournamentDetailss', require('./api/TournamentDetails'));
  app.use('/api/playerss', require('./api/players'));
  app.use('/api/courtss', require('./api/courts'));
  app.use('/api/scoreboards', require('./api/scoreboard'));
  app.use('/api/formatess', require('./api/formates'));
  app.use('/api/eventss', require('./api/events'));
  app.use('/api/sheduledmatchess', require('./api/sheduledmatches'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  

};
