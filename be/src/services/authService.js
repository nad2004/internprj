import User from '../models/User.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

export async function register({ username, password, name, email }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: passwordHash, name, email });
  await user.save();
  return user;
}

export async function login({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  return { user, token };
}