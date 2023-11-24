const mongoose=require('mongoose')
const { Schema } = mongoose;

const notesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //It make sure that one user cannot see others notes i.e user that logedin can only see his notes
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    default:'Personal'
  },
  date: {
    type: String,
    default: new Date()
  }

});
module.exports = mongoose.model('Notes', notesSchema)