'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventPlayerListSchema = new Schema({
  EventId:{
  	type: Schema.Types.ObjectId,
  	ref: 'Events'
  },
  TournamentId:{
  	type: Schema.Types.ObjectId,
  	ref: 'User'
  },
  Player1Id:{
  	type: Schema.Types.ObjectId,
  	ref: 'User'
  },
  Player2Id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  Selected:{
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('EventPlayerList', EventPlayerListSchema);