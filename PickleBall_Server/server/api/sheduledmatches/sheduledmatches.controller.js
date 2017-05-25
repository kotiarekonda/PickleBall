'use strict';

var _ = require('lodash');
var Sheduledmatches = require('./sheduledmatches.model');
var Players = require('../players/players.model');
var Events = require('../events/events.model');
var Courts = require('../courts/courts.model');
var Formates = require('../formates/formates.model');
var Scoreboard = require('../scoreboard/scoreboard.model');
var User = require('../user/user.model');
var EventPlayerList = require('../EventPlayerList/EventPlayerList.model');
var auth = require('../../auth/auth.service');

// Get list of sheduledmatchess
exports.index = function(req, res) {
  Sheduledmatches.find(function (err, sheduledmatchess) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(sheduledmatchess);
  });
};

// Get a single sheduledmatches
exports.show = function(req, res) {
  Sheduledmatches.findById(req.params.id, function (err, sheduledmatches) {
    if(err) { return handleError(res, err); }
    if(!sheduledmatches) { return res.status(404).send('Not Found'); }
    return res.json(sheduledmatches);
  });
};

// Creates a new sheduledmatches in the DB.
exports.create = function(req, res) {
  req.body.AdminId = req.user._id;
  req.body.TournamentId = req.user._id;  
  req.body.RefereeName = req.body.RefereeName.split(" ").join('');
  //rand key for referee name
  req.body.RefereePassword = req.body.RefereeName.split(' ').join('')+req.body.CourtNo;
  Sheduledmatches.create(req.body, function(err, sheduledmatches) {
    if(err) { return handleError(res, err); }
    Sheduledmatches.find({_id: sheduledmatches._id, Status: true})
    .populate({path:'CourtId', select:"_id CourtName CourtNo"})
    .populate({path:'EventId', select:'EventName EventType'})
    .populate({path:'FormatId', select:'FormateName twopointse'})
    .populate({path:'TeamAPlayer1Id', select:'FirstName _id'})
    .populate({path:'TeamAPlayer2Id', select:'FirstName _id'})
    .populate({path:'TeamBPlayer1Id', select:'FirstName _id'})
    .populate({path:'TeamBPlayer2Id', select:'FirstName _id'})
    .populate({path:'RefereeId', select:'FirstName _id'})
    .lean()
    .exec(function(err, sheduledobj){
      if(err){ return handleError(res, err); }
      if(sheduledobj.length > 0){
        //court update
        Courts.update({_id: req.body.CourtId, Selected: false},{$set:{Selected: true}}).exec();
        //refress update
        User.update({_id: req.body.RefereeId, Selected: false},{$set:{Selected: true}}).exec();
        var ids = req.body.TeamIds;
        ids.forEach(function(element, index){
          //update player based on events
          EventPlayerList.update({_id: element, Selected: false},{$set:{Selected: true}}).exec();
        })
        var temp = {};
        sheduledobj.forEach(function(element, index){
          temp._id = element._id;
          temp.Time = element.Time;
          temp.courtId = element.CourtId['_id'];
          temp.court = element.CourtId['CourtName'];
          temp.courtNumber = element.CourtId['CourtNo'];
          temp.EventId= element.EventId['_id'];
          temp.EventName = element.EventId['EventName'];
          temp.Event = element.EventId['EventType'];
          temp.GameFormat = element.FormatId['FormateName'];
          temp.GameFormatId = element.FormatId['_id'];
          temp.twopointse = element.FormatId['twopointse'];
          temp.Referee = element.RefereeId['FirstName'];
          temp.RefereeId = element.RefereeId['_id'];
          temp.MatchStatus = element.MatchStatus;
          var t1 = [];
          var t2 = [];
          var taobj1 = {};
          taobj1.Name = element.TeamAPlayer1Id['FirstName'];
          taobj1.id = element.TeamAPlayer1Id['_id'];
          var tbobj1 = {};
          tbobj1.Name = element.TeamBPlayer1Id['FirstName'];
          tbobj1.id = element.TeamBPlayer1Id['_id'];
          t1.push(taobj1);
          t2.push(tbobj1);
          var taobj2 = {};
          var tbobj2 = {};
          if(element.TeamAPlayer2Id !== undefined){
            taobj2.Name = element.TeamAPlayer2Id['FirstName'];
            taobj2.id = element.TeamAPlayer2Id['_id'];
            t1.push(taobj2);
          }
          if(element.TeamBPlayer2Id !== undefined){
            tbobj2.Name = element.TeamBPlayer2Id['FirstName'];
            tbobj2.id = element.TeamBPlayer2Id['_id'];
            t2.push(tbobj2);
          }          
          temp.Team1 = {};
          temp.Team1.Players = t1;
          temp.Team2 = {};
          temp.Team2.Players = t2;
          //arr.push(temp);
        })
        return res.status(201).json(temp);
      }else{
        res.status(200).send("no match's are scheduled at !");
      }
    })
  });
};

// Updates an existing sheduledmatches in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sheduledmatches.findById(req.params.id, function (err, sheduledmatches) {
    if (err) { return handleError(res, err); }
    if(!sheduledmatches) { return res.status(404).send('Not Found'); }
    var updated = _.merge(sheduledmatches, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(sheduledmatches);
    });
  });
};

// Deletes a sheduledmatches from the DB.
exports.destroy = function(req, res) {
  Sheduledmatches.findById(req.params.id, function (err, sheduledmatches) {
    if(err) { return handleError(res, err); }
    if(!sheduledmatches) { return res.status(404).send('Not Found'); }
    sheduledmatches.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

//shedule match service
exports.matchsheduledfields = function(req, res){
  Courts.find({Selected: false})
  .lean()
  .exec(function(err, courtsobj){
    if(err){ return handleError(res, err); }
    if(courtsobj.length > 0){
      Formates.find({},{ScoreCard: 0, Status: 0, __v: 0},function(err, formatesobj){
        if(err){ return handleError(res, err); }
        if(formatesobj.length > 0){
          Events.find().lean().exec(function(err, eventsobj){
            if(err){ return handleError(res, err); }
            User.find({role:'Referee', Selected: false}, {_id: 1, FirstName: 1, Selected: 1}, function(err, refereeobj){
              if(err){ return handleError(res, err); }
              var arr = [];
              refereeobj.forEach(function(element, index){
                var refobj = {};
                refobj.RefereeId = element._id;
                refobj.RefereeName = element.FirstName;
                refobj.Selected = element.Selected;
                arr.push(refobj);
              })
              Sheduledmatches.find({TournamentId: req.user._id, Status: true})
              .populate({path:'CourtId', select:"_id CourtName CourtNo"})
              .populate({path:'EventId', select:'EventName EventType'})
              .populate({path:'FormatId', select:'FormateName twopointse'})
              .populate({path:'TeamAPlayer1Id', select:'FirstName _id'})
              .populate({path:'TeamAPlayer2Id', select:'FirstName _id'})
              .populate({path:'TeamBPlayer1Id', select:'FirstName _id'})
              .populate({path:'TeamBPlayer2Id', select:'FirstName _id'})
              .populate({path:'RefereeId', select:'FirstName _id'})
              .lean()
              .exec(function(err, sheduledmatchobj){
                if(err){ return handleError(res, err); }
                if(sheduledmatchobj.length > 0){
                  var matchsarr = [];
                  sheduledmatchobj.forEach(function(element, index){
                    var temp = {};
                    temp._id = element._id;
                    temp.Time = element.Time;
                    temp.courtId = element.CourtId['_id'];
                    temp.court = element.CourtId['CourtName'];
                    temp.courtNumber = element.CourtId['CourtNo'];
                    temp.EventId= element.EventId['_id'];
                    temp.EventName = element.EventId['EventName'];
                    temp.Event = element.EventId['EventType'];
                    temp.GameFormat = element.FormatId['FormateName'];
                    temp.GameFormatId = element.FormatId['_id'];
                    temp.twopointse = element.FormatId['twopointse'];
                    temp.Referee = element.RefereeId['FirstName'];
                    temp.RefereeId = element.RefereeId['_id'];
                    temp.MatchStatus = element.MatchStatus;
                    var t1 = [];
                    var t2 = [];
                    var taobj1 = {};
                    taobj1.Name = element.TeamAPlayer1Id['FirstName'];
                    taobj1.id = element.TeamAPlayer1Id['_id'];
                    var tbobj1 = {};
                    tbobj1.Name = element.TeamBPlayer1Id['FirstName'];
                    tbobj1.id = element.TeamBPlayer1Id['_id'];
                    t1.push(taobj1);
                    t2.push(tbobj1);
                    var taobj2 = {};
                    var tbobj2 = {};
                    if(element.TeamAPlayer2Id !== undefined){
                      taobj2.Name = element.TeamAPlayer2Id['FirstName'];
                      taobj2.id = element.TeamAPlayer2Id['_id'];
                      t1.push(taobj2);
                    }
                    if(element.TeamBPlayer2Id !== undefined){
                      tbobj2.Name = element.TeamBPlayer2Id['FirstName'];
                      tbobj2.id = element.TeamBPlayer2Id['_id'];
                      t2.push(tbobj2);
                    }          
                    temp.Team1 = {};
                    temp.Team1.Players = t1;
                    temp.Team2 = {};
                    temp.Team2.Players = t2;
                    matchsarr.push(temp);
                  })
                  var tempobj = {};
                  tempobj.Courts = courtsobj;
                  tempobj.Events = eventsobj;
                  tempobj.Formates = formatesobj;
                  tempobj.Referes = arr;
                  tempobj.Matchs = matchsarr;
                  res.status(200).send(tempobj);
                }else{
                  var obj = {};
                  obj.Courts = courtsobj;
                  obj.Events = eventsobj;
                  obj.Formates = formatesobj;
                  obj.Referes = arr;
                  obj.Matchs = [];
                  res.status(200).send(obj);
                }
              })
            })
          })
        }else{
          res.status(200).send("formates not found");
        }
      })
    }else{
      res.status(200).send("court not found");
    }
  })
}

//refree login
exports.refreelogin = function(req, res){
  Sheduledmatches.find({RefereeName: req.body.RefereeName, RefereePassword: req.body.RefereePassword})
  .populate({path:'CourtId', select:"_id CourtName CourtNo"})
  .populate({path:'EventId', select:'EventName EventType'})
  .populate({path:'FormatId', select:'FormateName ScoreCard twopointse'})
  .populate({path:'TeamAPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamAPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'RefereeId', select:'FirstName _id'})
  .lean()
  .exec(function(err, matchobj){
    if(err){ return handleError(res, err); }
    if(matchobj.length > 0){
      var temp = {};
      temp._id = matchobj[0]._id;
      temp.Time = matchobj[0].Time;
      temp.courtId = matchobj[0].CourtId['_id'];
      temp.court = matchobj[0].CourtId['CourtName'];
      temp.courtNumber = matchobj[0].CourtId['CourtNo'];
      temp.EventId= matchobj[0].EventId['_id'];
      temp.EventName = matchobj[0].EventId['EventName'];
      temp.Event = matchobj[0].EventId['EventType'];
      temp.GameFormat = matchobj[0].FormatId['FormateName'];
      temp.GameFormatId = matchobj[0].FormatId['_id'];
      temp.twopointse = matchobj[0].FormatId['twopointse'];
      temp.ScoreCard = matchobj[0].FormatId['ScoreCard'];
      temp.Referee = matchobj[0].RefereeId['FirstName'];
      temp.RefereeId = matchobj[0].RefereeId['_id'];
      temp.MatchStatus = matchobj[0].MatchStatus;
      var t1 = [];
      var t2 = [];
      var taobj1 = {};
      taobj1.Name = matchobj[0].TeamAPlayer1Id['FirstName'];
      taobj1.id = matchobj[0].TeamAPlayer1Id['_id'];
      taobj1.Served = matchobj[0].TeamAPlayer1Id['Served'];
      var tbobj1 = {};
      tbobj1.Name = matchobj[0].TeamBPlayer1Id['FirstName'];
      tbobj1.id = matchobj[0].TeamBPlayer1Id['_id'];
      tbobj1.Served = matchobj[0].TeamBPlayer1Id['Served'];
      t1.push(taobj1);
      t2.push(tbobj1);
      var taobj2 = {};
      var tbobj2 = {};
      if(matchobj[0].TeamAPlayer2Id !== undefined){
        taobj2.Name = matchobj[0].TeamAPlayer2Id['FirstName'];
        taobj2.id = matchobj[0].TeamAPlayer2Id['_id'];
        taobj2.Served = matchobj[0].TeamAPlayer2Id['Served'];
        t1.push(taobj2);
      }
      if(matchobj[0].TeamBPlayer2Id !== undefined){
        tbobj2.Name = matchobj[0].TeamBPlayer2Id['FirstName'];
        tbobj2.id = matchobj[0].TeamBPlayer2Id['_id'];
        tbobj2.Served = matchobj[0].TeamBPlayer1Id['Served'];
        t2.push(tbobj2);
      }          
      temp.Team1 = {};
      temp.Team1.Players = t1;
      temp.Team2 = {};
      temp.Team2.Players = t2;
      var token = auth.signToken(matchobj[0].RefereeId, "Referee");
      res.status(200).send({"Matchs": temp, "Token": token, role: "Referee"});
    }else{
      res.status(200).send('no matches found');
    }
  })
}

//spectator showing matches
exports.spectatormatchs = function(req, res){
  Sheduledmatches.find()
  .populate({path:'CourtId', select:"_id CourtName CourtNo"})
  .populate({path:'EventId', select:'EventName EventType'})
  .populate({path:'FormatId', select:'FormateName ScoreCard twopointse'})
  .populate({path:'TeamAPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamAPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'RefereeId', select:'FirstName _id'})
  .lean()
  .exec(function(err, sheduledmatchobj){
    if(err){ return handleError(res, err); }
    if(sheduledmatchobj.length > 0){
      var matchsarr = [];
      sheduledmatchobj.forEach(function(element, index){
        var temp = {};
        temp._id = element._id;
        temp.Time = element.Time;
        temp.courtId = element.CourtId['_id'];
        temp.court = element.CourtId['CourtName'];
        temp.courtNumber = element.CourtId['CourtNo'];
        temp.EventId= element.EventId['_id'];
        temp.EventName = element.EventId['EventName'];
        temp.Event = element.EventId['EventType'];
        temp.GameFormat = element.FormatId['FormateName'];
        temp.GameFormatId = element.FormatId['_id'];
        temp.twopointse = element.FormatId['twopointse'];
        temp.Referee = element.RefereeId['FirstName'];
        temp.RefereeId = element.RefereeId['_id'];
        temp.MatchStatus = element.MatchStatus;
        var t1 = [];
        var t2 = [];
        var taobj1 = {};
        taobj1.Name = element.TeamAPlayer1Id['FirstName'];
        taobj1.id = element.TeamAPlayer1Id['_id'];
        var tbobj1 = {};
        tbobj1.Name = element.TeamBPlayer1Id['FirstName'];
        tbobj1.id = element.TeamBPlayer1Id['_id'];
        t1.push(taobj1);
        t2.push(tbobj1);
        var taobj2 = {};
        var tbobj2 = {};
        if(element.TeamAPlayer2Id !== undefined){
          taobj2.Name = element.TeamAPlayer2Id['FirstName'];
          taobj2.id = element.TeamAPlayer2Id['_id'];
          t1.push(taobj2);
        }
        if(element.TeamBPlayer2Id !== undefined){
          tbobj2.Name = element.TeamBPlayer2Id['FirstName'];
          tbobj2.id = element.TeamBPlayer2Id['_id'];
          t2.push(tbobj2);
        }          
        temp.Team1 = {};
        temp.Team1.Players = t1;
        temp.Team2 = {};
        temp.Team2.Players = t2;
        matchsarr.push(temp);
      })
      res.status(200).send({"Matchs": matchsarr});
    }else{
      res.status(200).send("no matches found");
    }
  })
}

//reloading match service
exports.reloadrefereelogin = function(req, res){
  Sheduledmatches.find({RefereeId: req.user._id})
  .populate({path:'CourtId', select:"_id CourtName CourtNo"})
  .populate({path:'EventId', select:'EventName EventType'})
  .populate({path:'FormatId', select:'FormateName ScoreCard twopointse'})
  .populate({path:'TeamAPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamAPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer1Id', select:'Served FirstName _id'})
  .populate({path:'TeamBPlayer2Id', select:'Served FirstName _id'})
  .populate({path:'RefereeId', select:'FirstName _id'})
  .lean()
  .exec(function(err, matchobj){
    if(err){ return handleError(res, err); }
    if(matchobj.length > 0){
      var temp = {};
      temp._id = matchobj[0]._id;
      temp.Time = matchobj[0].Time;
      temp.courtId = matchobj[0].CourtId['_id'];
      temp.court = matchobj[0].CourtId['CourtName'];
      temp.courtNumber = matchobj[0].CourtId['CourtNo'];
      temp.EventId= matchobj[0].EventId['_id'];
      temp.EventName = matchobj[0].EventId['EventName'];
      temp.Event = matchobj[0].EventId['EventType'];
      temp.GameFormat = matchobj[0].FormatId['FormateName'];
      temp.GameFormatId = matchobj[0].FormatId['_id'];
      temp.twopointse = matchobj[0].FormatId['twopointse'];
      temp.ScoreCard = matchobj[0].FormatId['ScoreCard'];
      temp.Referee = matchobj[0].RefereeId['FirstName'];
      temp.RefereeId = matchobj[0].RefereeId['_id'];
      temp.MatchStatus = matchobj[0].MatchStatus;
      var t1 = [];
      var t2 = [];
      var taobj1 = {};
      taobj1.Name = matchobj[0].TeamAPlayer1Id['FirstName'];
      taobj1.id = matchobj[0].TeamAPlayer1Id['_id'];
      taobj1.Served = matchobj[0].TeamAPlayer1Id['Served'];
      var tbobj1 = {};
      tbobj1.Name = matchobj[0].TeamBPlayer1Id['FirstName'];
      tbobj1.id = matchobj[0].TeamBPlayer1Id['_id'];
      tbobj1.Served = matchobj[0].TeamBPlayer1Id['Served'];
      t1.push(taobj1);
      t2.push(tbobj1);
      var taobj2 = {};
      var tbobj2 = {};
      if(matchobj[0].TeamAPlayer2Id !== undefined){
        taobj2.Name = matchobj[0].TeamAPlayer2Id['FirstName'];
        taobj2.id = matchobj[0].TeamAPlayer2Id['_id'];
        taobj2.Served = matchobj[0].TeamAPlayer2Id['Served'];
        t1.push(taobj2);
      }
      if(matchobj[0].TeamBPlayer2Id !== undefined){
        tbobj2.Name = matchobj[0].TeamBPlayer2Id['FirstName'];
        tbobj2.id = matchobj[0].TeamBPlayer2Id['_id'];
        tbobj2.Served = matchobj[0].TeamBPlayer1Id['Served'];
        t2.push(tbobj2);
      }          
      temp.Team1 = {};
      temp.Team1.Players = t1;
      temp.Team2 = {};
      temp.Team2.Players = t2;
      //var token = auth.signToken(matchobj[0].RefereeId, "Referee");
      res.status(200).send({"Matchs": temp});
    }else{
      res.status(200).send('no matches found');
    }
  })
}