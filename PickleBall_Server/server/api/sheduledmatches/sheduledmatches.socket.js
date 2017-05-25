/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sheduledmatches = require('./sheduledmatches.model');

exports.register = function(socket) {
  Sheduledmatches.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sheduledmatches.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sheduledmatches:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sheduledmatches:remove', doc);
}