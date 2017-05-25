'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FormatesSchema = new Schema({
  FormateName: String,
  ScoreCard: Object,
  twopointse:{ 
  	type: Boolean, 
  	default: false
  },
  Status: {
  	type: Boolean,
  	default: true
  }
});

module.exports = mongoose.model('Formates', FormatesSchema);