'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayersSchema = new Schema({
  FirstPlayer:{
  	type: String
  },
  SecondPlayer:{
  	type: String
  },
  EventId:{
  	type: Schema.Types.ObjectId,
  	ref: 'Events'
  },
  Selected:{
  	type: Boolean,
  	default: false
  },
  Status:{
  	type: Boolean,
  	default: true
  }
});

module.exports = mongoose.model('Players', PlayersSchema);