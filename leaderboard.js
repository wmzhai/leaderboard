PlayersList = new Mongo.Collection('players');

if( Meteor.isClient){
  console.log("Hello Client");
  Meteor.subscribe('thePlayers');

  Template.leaderboard.helpers({
    'player' : function(){
      return PlayersList.find({},{sort:{score:-1}});
    },
    'selectedClass': function () {
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if( playerId == selectedPlayer){
        return "selected";
      }
    },
    'showSelectedPlayer' : function(){
      var selectedPlayer = Session.get('selectedPlayer');
      return PlayersList.findOne(selectedPlayer);
    }

  });

  Template.leaderboard.events({
    'click .player' : function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
    },
    'click .increment' : function () {
      var selectedPlayer = Session.get('selectedPlayer');
      console.log(selectedPlayer);

      PlayersList.update(selectedPlayer,{$inc :{score:5}});
    },
    'click .decrement' : function () {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer,{$inc:{score:-5}});
    },
    'click .remove': function () {
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.remove(selectedPlayer);
    }
  });



  Template.addPlayerForm.events({
    'submit form' : function (event) {
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var currrentUserId = Meteor.userId();

      console.log(playerNameVar);
      PlayersList.insert({
        name:playerNameVar,
        score:0,
        createdBy:currrentUserId
      });

    }
  });
}


if( Meteor.isServer){
  Meteor.publish('thePlayers', function () {
    var currentUserId = this.userId;

    return PlayersList.find({createdBy:currentUserId});
  });
}
