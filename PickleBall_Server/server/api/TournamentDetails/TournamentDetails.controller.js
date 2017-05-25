'use strict';

var _ = require('lodash');
var TournamentDetails = require('./TournamentDetails.model');

// Get list of TournamentDetailss
exports.index = function(req, res) {
  TournamentDetails.find(function (err, TournamentDetailss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(TournamentDetailss);
  });
};

// Get a single TournamentDetails
exports.show = function(req, res) {
  TournamentDetails.findById(req.params.id, function (err, TournamentDetails) {
    if(err) { return handleError(res, err); }
    if(!TournamentDetails) { return res.status(404).send('Not Found'); }
    return res.json(TournamentDetails);
  });
};

// Creates a new TournamentDetails in the DB.
exports.create = function(req, res) {
  TournamentDetails.create(req.body, function(err, TournamentDetails) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(TournamentDetails);
  });
};

// Updates an existing TournamentDetails in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  TournamentDetails.findById(req.params.id, function (err, TournamentDetails) {
    if (err) { return handleError(res, err); }
    if(!TournamentDetails) { return res.status(404).send('Not Found'); }
    var updated = _.merge(TournamentDetails, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(TournamentDetails);
    });
  });
};

// Deletes a TournamentDetails from the DB.
exports.destroy = function(req, res) {
  TournamentDetails.findById(req.params.id, function (err, TournamentDetails) {
    if(err) { return handleError(res, err); }
    if(!TournamentDetails) { return res.status(404).send('Not Found'); }
    TournamentDetails.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}