/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Players = require('./players.model');

exports.register = function(socket) {
  Players.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Players.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('players:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('players:remove', doc);
}