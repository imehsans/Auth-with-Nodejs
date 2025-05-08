// const User = require('./userModel'); // Assuming your user model is in userModel.js
// const bcrypt = require('bcryptjs');
// const { generateVerificationCode } = require('../utils/authHelpers');

exports.signup = async (req, res) => {
   try {
      const { name, userName, phone, email, password, verifyPassword } = req.body;

   } catch (error) {
      console.log("Error in signup", error)
   }
   // try {
   // Destructure only the required fields from request body
   // const { name, userName, phone, email, password, verifyPassword } = req.body;

   // Basic validation - check if all required fields are present
   // if (!name || !userName || !phone || !email || !password || !verifyPassword) {
   //    return res.status(400).json({
   //       status: 'fail',
   //       message: 'Please provide all required fields: name, userName, phone, email, password, verifyPassword'
   //    });
   // }

   // Check if passwords match
   // if (password !== verifyPassword) {
   //    return res.status(400).json({
   //       status: 'fail',
   //       message: 'Passwords do not match'
   //    });
   // }

   // Check if user already exists with email or username
   // const existingUser = await User.findOne({
   //    $or: [{ email }, { userName }]
   // });

   // if (existingUser) {
   //    return res.status(409).json({
   //       status: 'fail',
   //       message: 'User already exists with this email or username'
   //    });
   // }

   // Hash the password
   // const hashedPassword = await bcrypt.hash(password, 12);

   // Generate verification code and expiry (1 hour from now)
   // const verificationCode = generateVerificationCode();
   // const verificationCodeExpiry = Date.now() + 3600000; // 1 hour in milliseconds

   // Create new user with only the required fields
   // const newUser = await User.create({
   //    name,
   //    userName,
   //    phone,
   //    email,
   //    password: hashedPassword,
   //    verifyPassword: hashedPassword, // Store hashed password here as well
   //    verificationCode,
   //    verificationCodeExpiry,
   //    role: 'user', // Default role
   //    status: 'pending' // Default status
   // });

   // Remove sensitive data from response
   // newUser.password = undefined;
   // newUser.verifyPassword = undefined;
   // newUser.verificationCode = undefined;
   // newUser.verificationCodeExpiry = undefined;

   // TODO: Send verification email with the verificationCode

   // res.status(201).json({
   //    status: 'success',
   //    message: 'User registered successfully. Please check your email for verification.',
   //    data: {
   //       user: newUser
   //    }
   // });

   // } catch (err) {
   // Handle Mongoose validation errors
   // if (err.name === 'ValidationError') {
   //    const errors = Object.values(err.errors).map(el => el.message);
   //    return res.status(400).json({
   //       status: 'fail',
   //       message: 'Validation error',
   //       errors
   //    });
   // }

   // Handle duplicate key errors
   // if (err.code === 11000) {
   //    return res.status(400).json({
   //       status: 'fail',
   //       message: 'User already exists with this email or username'
   //    });
   // }

   // Handle other errors
   // res.status(500).json({
   //    status: 'error',
   //    message: 'Something went wrong during registration',
   //    error: err.message
   // });
   // }
};