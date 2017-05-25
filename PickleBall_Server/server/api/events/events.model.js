'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventsSchema = new Schema({
  EventName: String,
  Status: {
  	type: Boolean,
  	default: true
  }
});

module.exports = mongoose.model('Events', EventsSchema);