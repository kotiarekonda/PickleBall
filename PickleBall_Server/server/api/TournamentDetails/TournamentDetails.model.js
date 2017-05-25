'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TournamentDetailsSchema = new Schema({
  TournamentName:{
  	type: String
  },
  Logo:{
  	type: String
  },
  StartDate:{
  	type: Date
  },
  EndDate:{
  	type: Date
  },
  RegistrationStartDate:{
  	type: Date
  },
  RegistrationEndDate:{
  	type: Date
  },
  TournamentEvents:{
  	type: Array
  },
  TournamentFormates:{
  	type: Array
  },
  Description:{
  	type: String
  },
  AddressLine1:{
  	type: String
  },
  AddressLine2:{
  	type: String
  },
  City:{
  	type: String
  },
  State:{
  	type: String
  },
  Country:{
  	type: String
  },
  ZipCode:{
  	type: Number
  }

});

module.exports = mongoose.model('TournamentDetails', TournamentDetailsSchema);