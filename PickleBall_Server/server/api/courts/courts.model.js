'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CourtsSchema = new Schema({
  CourtName:{
  	type: String
  },
  CourtNo:{
  	type: Number
  },
  Selected:{
  	type: Boolean,
  	default: false
  },
  Status:{
  	type: Boolean,
  	default: true
  },
});

module.exports = mongoose.model('Courts', CourtsSchema);