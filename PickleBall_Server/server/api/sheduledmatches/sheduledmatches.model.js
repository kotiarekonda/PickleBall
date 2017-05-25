'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SheduledmatchesSchema = new Schema({
  Date:{
    type: Date,
    default: Date.now
  },
  Time: {
    type: String
  },
  RefereeName:{
    type: String,
    lowercase: true
  },
  TournamentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  CourtId: {
    type: Schema.Types.ObjectId,
    ref: 'Courts'
  },
  EventId: {
  	type: Schema.Types.ObjectId,
  	ref: 'Events'
  },
  FormatId: {
  	type: Schema.Types.ObjectId,
  	ref: 'Formates'
  },
  TeamAPlayer1Id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  TeamAPlayer2Id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  TeamBPlayer1Id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  TeamBPlayer2Id:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  Status:{
  	type: Boolean,
  	default: true
  },
  RefereeId:{
  	type: Schema.Types.ObjectId,
    ref: 'User'
  },
  MatchStatus:{
    type: String,
    default: "InActive"
  },
  RefereePassword:{
    type: String,
    lowercase: true
  }

});

module.exports = mongoose.model('Sheduledmatches', SheduledmatchesSchema);