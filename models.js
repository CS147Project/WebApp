var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;


var UserSchema = new Mongoose.Schema({
  //I think this is automatic. I don't think we need it here
  // _id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nickname: String,
  isAthlete: { type: Boolean, required: true},
  isCoach: { type: Boolean, default: false },
  password: { type: String, required: true },
  joined: { type : Date, default: Date.now },
  email: {type: String, required: true}
});

exports.User = Mongoose.model('User', UserSchema);

var InviteSchema = new Mongoose.Schema({
  aid: { type: Schema.ObjectId, ref: 'User' }, // We need to allow coaches to invite
  cid: { type: Schema.ObjectId, ref: 'User' }, // other coaches to join their team.
  tid: { type: Schema.ObjectId, required: true },
  created: { type : Date, default: Date.now }
});

exports.Invite = Mongoose.model('Invite', InviteSchema);

var MessageSchema = new Mongoose.Schema({
  text: { type: String, required: true },
  fromid: { type: Schema.ObjectId, ref: 'User', required: true },
  toid: { type: Schema.ObjectId, ref: 'User', required: true },
  created: { type : Date, default: Date.now },
  fromName: { type: String, required: true },
  toName: { type: String, required: true }

});

exports.Message = Mongoose.model('Message', MessageSchema);

var TeamSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: String, required: true },
  created: { type : Date, default: Date.now }
});

exports.Team = Mongoose.model('Team', TeamSchema);

var TeamAthleteSchema = new Mongoose.Schema({
  tid: { type: Schema.ObjectId, ref: 'Team', required: true },
  aid: { type: Schema.ObjectId, ref: 'User', required: true }
});

exports.TeamAthlete = Mongoose.model('TeamAthlete', TeamAthleteSchema);

var TeamCoachSchema = new Mongoose.Schema({
  tid: { type: Schema.ObjectId, ref: 'Team', required: true },
  cid: { type: Schema.ObjectId, ref: 'User', required: true }
});

exports.TeamCoach = Mongoose.model('TeamCoach', TeamCoachSchema);

var ExerciseTemplateSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    sets: Number,
    reps: Number,
    weight: Boolean,
    distance: Boolean,
    speed: Boolean,
    time: Boolean
});

exports.ExerciseTemplate = Mongoose.model('ExerciseTemplate', ExerciseTemplateSchema);

var WorkoutTemplateSchema = new Mongoose.Schema({
  creatorid: { type: Schema.ObjectId, ref: 'User', required: true },
  created: { type : Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: false},
  exercises: [ExerciseTemplateSchema]
});

exports.WorkoutTemplate = Mongoose.model('WorkoutTemplate', WorkoutTemplateSchema);

var CompletedExerciseSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    sets: Number,
    reps: Number,
    weight: String,
    distance: String,
    speed: String,
    time: String
});

exports.CompletedExercise = Mongoose.model('CompletedExercise', CompletedExerciseSchema);

var CompletedWorkoutSchema = new Mongoose.Schema({
  finisherid: { type: Schema.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true},
  finished: { type : Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: false},
  exercises: [CompletedExerciseSchema]
});

exports.CompletedWorkout = Mongoose.model('CompletedWorkout', CompletedWorkoutSchema);

var AssignedWorkoutSchema = new Mongoose.Schema({
  aid: { type: Schema.ObjectId, ref: 'User', required: true },
  wid: { type: Schema.ObjectId, ref: 'WorkoutTemplate', required: true },
  name: { type: String, required: true},
  assigned: { type : Date, default: Date.now }
});

exports.AssignedWorkout = Mongoose.model('AssignedWorkout', AssignedWorkoutSchema);

