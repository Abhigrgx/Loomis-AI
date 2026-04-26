import mongoose from 'mongoose';

const aiOutputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    outputType: {
      type: String,
      enum: ['text', 'code', 'image', 'video'],
      default: 'text'
    },
    content: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      default: ''
    },
    exportFormat: {
      type: String,
      enum: ['txt', 'md', 'json', 'png', 'mp4'],
      default: 'md'
    }
  },
  { timestamps: true }
);

export const AiOutput = mongoose.model('AiOutput', aiOutputSchema);
