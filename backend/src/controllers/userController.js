import { Setting } from '../models/Setting.js';

export async function getSettings(req, res, next) {
  try {
    const settings = await Setting.findOne({ userId: req.auth.sub }).lean();
    return res.json({ settings });
  } catch (err) {
    return next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const allowedFields = ['preferredModel', 'temperature', 'maxTokens', 'voiceEnabled'];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const settings = await Setting.findOneAndUpdate(
      { userId: req.auth.sub },
      { $set: updates },
      { upsert: true, new: true }
    ).lean();

    return res.json({ settings });
  } catch (err) {
    return next(err);
  }
}
