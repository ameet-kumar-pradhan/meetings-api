const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rsvp: {
    type: String,
    enum: ['Yes', 'No', 'MayBe', 'Not Answered'],
    default: 'Not Answered'
  }
});

module.exports = mongoose.model('Participant', participantSchema);
