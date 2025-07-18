import * as authService from '../services/authService.js'; 

export async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Register success', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}