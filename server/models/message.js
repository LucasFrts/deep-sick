import { Schema, model } from 'mongoose';

const Message = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role:    { type: String, enum: ['user','assistant'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export default model('Message', Message);