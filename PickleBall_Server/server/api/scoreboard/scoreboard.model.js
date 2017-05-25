'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScoreboardSchema = new Schema({
  MatchId:{
  	type: Schema.Types.ObjectId,
  	ref: 'Sheduledmatches'
  },
  TeamAPlayer1:{
    type: String
  },
  TeamAPlayer2:{
    type: String
  },
  TeamBPlayer1:{
    type: String
  },
  TeamBPlayer2:{
    type: String
  },
  TeamAFirstServer:{
  	type: Boolean
  },
  TeamBFirstServer:{
  	type: Boolean
  },
  ServingTeamActivePlayerName:{
    type: String
  },
  ReceivingTeamActivePlayerName:{
    type: String
  },
  ServingPlayerName:{
    type: String
  },
  ReceivingPlayerName:{
    type: String
  },
  FirstServeTeam:{
  	type: String
  },
  TeamACourtSide:{
  	type: String
  },
  TeamBCourtSide:{
  	type: String
  },
  ServingTeamScore:{
  	type: Number
  },
  ReceivingTeamScore:{
  	type: Number
  },
  ServeCount:{
  	type: Number
  },
  ServingTeamDetails:{
  	type: String
  },
  RecivingTeamDetails:{
  	type: String
  },
  WinningDetails:{
  	type: String
  },
  MatchStartTime:{
  	type: Date
  },
  MatchEndTime:{
  	type: Date
  },
  ServingTeamWristBandInfo:{
  	type: String
  },
  ReceivingTeamWristBandInfo:{
  	type: String
  },
  getcurrentscore:{
  	type: Number
  },
  ScoreBoard:{
    type: Object
  }
});

module.exports = mongoose.model('Scoreboard', ScoreboardSchema);