import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Setting } from '../models/Setting.js';
import { signAccessToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, name });
    await Setting.create({ userId: user._id });

    const token = signAccessToken({ sub: user._id, role: user.role, email: user.email });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signAccessToken({ sub: user._id, role: user.role, email: user.email });

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub).select('-passwordHash').lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}
