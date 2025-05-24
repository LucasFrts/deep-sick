import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: false,
    default: 'pt-BR'
  }
}, {
  timestamps: true
});

export default model('User', userSchema);
