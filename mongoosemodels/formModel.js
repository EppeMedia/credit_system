
const mongoose = require('mongoose');

// event Schema (subdocs)
const event = new mongoose.Schema({
  teacher_code: String,
  timestamp: Date,
  text: String
});

// on save event this will add current date stamp to event(Server Time!)
event.pre('save', function (next) {
  this.timestamp = Date.now();
  next();
});

const availability_config = new mongoose.Schema({
  columns: [String],
  timeslots: [String]
});

const availability_timeslot = new mongoose.Schema({
  value: String //The value of the timeslot, i.e. 'u', 'e', 'a', or 'd'.
});

const availability_column = new mongoose.Schema({
  name: String,                   //The name of a column in an availability form, usually a 'day'.
  rows: [availability_timeslot]   //An array of the rows belonging to this column, which may be called the timeslots of this 'day'.
});

// version schema (subdocs)
const version = new mongoose.Schema({
  counter: Number,
  locked: Boolean,
  date: Number,                       //An unique identifier, which counts up from 0, adding 1 for every subsequent version (0, 1, 2, 3, ...). Also used for ordering versions in order of submitting.
  teacherLink: String,                //A URL, linking to a Zynyo signing web page, where a teacher can sign this version.
  supervisorLink: String,             //A URL, linking to a Zynyo signing web page, where a supervisor can sign this version AFTER a teacherLink has been signed.
  contentBase64: String,              //The base64-encoded contents of a human-readable pdf document, which is updated after each succesfull signature.
  availability: [availability_column],//An array of columns, which represent a 'day' of an availability form; each colum contains (multiple) timeslots.
  config: availability_config
});



// the form schema (parent docs)
const formSchema = new mongoose.Schema({
  id: String,           //Takes the form of: teacher_code.study_year.quartile; which acts as a unique identifier.
  teacher_code: String, //The teacher's code. The same as with which the teacher will also log in.
  quartile: Number,     //The number of the relevant quartile (1, 2, 3, 4).
  study_year: String,   //Description of an academic year, i.e. "2017-2018".
  //locked: Boolean,       //Determines if the form (1) has expired editability timewise, or (b) the most recent version has been signed by the teacher AND the supervisor.
  versions: [version],  //An array of submitted versions of an availability form. All versions are stored here: both signed and unsigned versions.
  events: [event]       //The events that consist of remarks that have been added to this form by a teacher or supervisor.
});

// The exports
module.exports = mongoose.model('Forms', formSchema);
module.exports = mongoose.model('Events', event);
module.exports = mongoose.model('Versions', version);
