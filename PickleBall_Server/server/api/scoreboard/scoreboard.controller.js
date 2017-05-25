'use strict';

var _ = require('lodash');
var Scoreboard = require('./scoreboard.model');

// Get list of scoreboards
exports.index = function(req, res) {
  Scoreboard.find(function (err, scoreboards) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(scoreboards);
  });
};

// Get a single scoreboard
exports.show = function(req, res) {
  Scoreboard.findById(req.params.id, function (err, scoreboard) {
    if(err) { return handleError(res, err); }
    if(!scoreboard) { return res.status(404).send('Not Found'); }
    return res.json(scoreboard);
  });
};

// Creates a new scoreboard in the DB.
exports.create = function(req, res) {
  Scoreboard.create(req.body, function(err, scoreboard) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(scoreboard);
  });
};

// Updates an existing scoreboard in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Scoreboard.findById(req.params.id, function (err, scoreboard) {
    if (err) { return handleError(res, err); }
    if(!scoreboard) { return res.status(404).send('Not Found'); }
    var updated = _.merge(scoreboard, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(scoreboard);
    });
  });
};

// Deletes a scoreboard from the DB.
exports.destroy = function(req, res) {
  Scoreboard.findById(req.params.id, function (err, scoreboard) {
    if(err) { return handleError(res, err); }
    if(!scoreboard) { return res.status(404).send('Not Found'); }
    scoreboard.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}