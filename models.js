
var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: String,
  isAthlete: { type: Boolean, required: true},
  isCoach: Boolean,
  password: { type: String, required: true },
  joined: { type : Date, default: Date.now }
});

exports.User = Mongoose.model('User', UserSchema);

var InviteSchema = new Mongoose.Schema({
  aid: { type: String, ref: 'User' }, // We need to allow coaches to invite
  cid: { type: String, ref: 'User' }, // other coaches to join their team.
  tid: { type: Number, required: true },
  created: { type : Date, default: Date.now }
});

exports.Invite = Mongoose.model('Invite', InviteSchema);

var MessageSchema = new Mongoose.Schema({
  text: { type: String, required: true },
  fromid: { type: String, ref: 'User', required: true },
  toid: { type: String, ref: 'User', required: true },
  created: { type : Date, default: Date.now }
});

exports.Invite = Mongoose.model('Invite', InviteSchema);

var TeamSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  created: { type : Date, default: Date.now }
});

exports.Team = Mongoose.model('Team', TeamSchema);

var TeamAthleteSchema = new Mongoose.Schema({
  tid: { type: Number, ref: 'Team', required: true },
  aid: { type: String, ref: 'User', required: true }
});

exports.TeamAthlete = Mongoose.model('TeamAthlete', TeamAthleteSchema);

var TeamCoachSchema = new Mongoose.Schema({
  tid: { type: Number, ref: 'Team', required: true },
  cid: { type: String, ref: 'User', required: true }
});

exports.TeamCoach = Mongoose.model('TeamCoach', TeamCoachSchema);

var ExerciseTemplateSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    weight: Number,
    set: Number,
    rep: Number,
    distance: String,
    time: String
});

exports.ExerciseTemplate = Mongoose.model('ExerciseTemplate', ExerciseTemplateSchema);

var WorkoutTemplateSchema = new Mongoose.Schema({
  creatorid: { type: String, ref: 'User', required: true },
  created: { type : Date, default: Date.now },
  title: { type: String, required: true },
  description: String,
  exercises: [ExerciseTemplateSchema]
});

exports.WorkoutTemplate = Mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);

