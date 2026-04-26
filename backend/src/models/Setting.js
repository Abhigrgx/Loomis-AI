import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    preferredModel: {
      type: String,
      default: 'gpt-4o-mini'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.3
    },
    maxTokens: {
      type: Number,
      min: 128,
      max: 4096,
      default: 1024
    },
    voiceEnabled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
