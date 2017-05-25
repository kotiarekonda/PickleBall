'use strict';

var _ = require('lodash');
var Players = require('./players.model');

// Get list of playerss
exports.index = function(req, res) {
  Players.find(function (err, playerss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(playerss);
  });
};

// Get a single players
exports.show = function(req, res) {
  Players.findById(req.params.id, function (err, players) {
    if(err) { return handleError(res, err); }
    if(!players) { return res.status(404).send('Not Found'); }
    return res.json(players);
  });
};

// Creates a new players in the DB.
exports.create = function(req, res) {
  Players.create(req.body, function(err, players) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(players);
  });
};

// Updates an existing players in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Players.findById(req.params.id, function (err, players) {
    if (err) { return handleError(res, err); }
    if(!players) { return res.status(404).send('Not Found'); }
    var updated = _.merge(players, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(players);
    });
  });
};

// Deletes a players from the DB.
exports.destroy = function(req, res) {
  Players.findById(req.params.id, function (err, players) {
    if(err) { return handleError(res, err); }
    if(!players) { return res.status(404).send('Not Found'); }
    players.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

//event based players list
exports.playerslist = function(req, res){
  Players.find({EventId: req.params.EventId, Status: true}, function(err, playerslistobj){
    if(err){ return handleError(res, err); }
    if(playerslistobj.length > 0){
      res.status(200).send(playerslistobj);
    }else{
      res.status(200).send("players not found");
    }
  })
}