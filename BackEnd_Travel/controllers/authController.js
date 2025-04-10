import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// user registration
export const register = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        photo: req.body.photo
      });

      await newUser.save();
      res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
  }
];

// user login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    //if user is found, check if password is correct
    const checkCorrectPassword = await bcrypt.compare(password, user.password);
    
    //if password is incorrect
    if (!checkCorrectPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    const { password: pwd, role, ...rest } = user._doc;

    //Create jwt token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '15d' });

    //send token in browser cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      expires: token.expiresIn,
    }).status(200).json({ token, data: { ...rest }, role });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to login. Try again' });
  }
};