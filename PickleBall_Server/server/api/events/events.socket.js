/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Events = require('./events.model');

exports.register = function(socket) {
  Events.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Events.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('events:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('events:remove', doc);
}