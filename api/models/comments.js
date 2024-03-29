var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    unique: false,
    required: true
  },
  time: {
    type: Date,
    unique: false,
    required: true
  },
  url: {
    type: String,
    unique: false,
    required: false
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  }
});

module.exports = mongoose.model('Comment', commentSchema);
