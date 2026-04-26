import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'New Conversation'
    },
    mode: {
      type: String,
      enum: ['chat', 'agent', 'code', 'image', 'video'],
      default: 'chat'
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
