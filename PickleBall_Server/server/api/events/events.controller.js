'use strict';

var _ = require('lodash');
var Events = require('./events.model');

// Get list of eventss
exports.index = function(req, res) {
  Events.find(function (err, eventss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(eventss);
  });
};

// Get a single events
exports.show = function(req, res) {
  Events.findById(req.params.id, function (err, events) {
    if(err) { return handleError(res, err); }
    if(!events) { return res.status(404).send('Not Found'); }
    return res.json(events);
  });
};

// Creates a new events in the DB.
exports.create = function(req, res) {
  Events.create(req.body, function(err, events) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(events);
  });
};

// Updates an existing events in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Events.findById(req.params.id, function (err, events) {
    if (err) { return handleError(res, err); }
    if(!events) { return res.status(404).send('Not Found'); }
    var updated = _.merge(events, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(events);
    });
  });
};

// Deletes a events from the DB.
exports.destroy = function(req, res) {
  Events.findById(req.params.id, function (err, events) {
    if(err) { return handleError(res, err); }
    if(!events) { return res.status(404).send('Not Found'); }
    events.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}