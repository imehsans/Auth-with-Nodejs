const jwt = require('jsonwebtoken');
const { signupSchema, loginSchema } = require("../middlewares/validator");
const User = require("../models/usersModels");
const { doHash, doHashValidation } = require("../utils/hashing");

exports.signup = async (req, res) => {
   try {
      // 1. Validate the input using Joi schema (validate the entire req.body)
      const { error, value } = signupSchema.validate(req.body, {
         abortEarly: false // Return all errors not just the first one
      });

      // 2. Handle validation errors
      if (error) {
         const errorMessages = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message.replace(/['"]/g, '')
         }));

         return res.status(400).json({ // Changed from 401 to 400 (Bad Request)
            status: 'fail',
            message: 'Validation error',
            errors: errorMessages
         });
      }

      // 3. Check for existing user
      const existingUser = await User.findOne({
         $or: [
            { email: value.email.toLowerCase().trim() },
            { userName: value.userName.toLowerCase().trim() }
         ]
      });

      if (existingUser) {
         const conflictField = existingUser.email === value.email.toLowerCase().trim()
            ? 'email'
            : 'username';

         return res.status(409).json({
            status: 'fail',
            message: `${conflictField} already exists`,
            field: conflictField
         });
      }

      // 4. Hash the password
      const hashedPassword = await doHash(value.password, 12);

      // 5. Create new user with ALL required fields
      const newUser = await User.create({
         name: value.name,
         userName: value.userName,
         phone: value.phone,
         email: value.email,
         role: value.role || 'user', // Default role if not provided
         password: hashedPassword,
         verifyPassword: hashedPassword, // Must match password
         status: 'pending' // Default status
      });

      // 6. Remove sensitive data before sending response
      newUser.password = undefined;
      newUser.verifyPassword = undefined;

      // 6. Create JWT token
      const token = jwt.sign(
         {
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role
         },
         process.env.TOKEN_SECRET,
         { expiresIn: '7d' }
      );

      // 7. Send success response
      res
         .cookie('Authorization', `Bearer ${token}`, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
         })
         .status(201)
         .json({
            status: 'success',
            message: 'Registerd in successfully',
            data: { newUser, token }
         });
   } catch (error) {
      console.error("Error in signup:", error);

      // Handle Mongoose validation errors separately
      if (error.name === 'ValidationError') {
         const errors = Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
         }));

         return res.status(400).json({
            status: 'fail',
            message: 'Validation error',
            errors
         });
      }

      res.status(500).json({
         status: 'error',
         message: 'Internal server error during registration'
      });
   }
};

exports.login = async (req, res) => {
   try {
      // 1. Destructure login credentials
      const { loginId, password } = req.body;

      const { error, value } = loginSchema.validate(req.body, {
         abortEarly: false // Return all errors not just the first one
      });

      if (error) {
         const errorMessages = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message.replace(/['"]/g, '')
         }));

         return res.status(401).json({ // Changed from 401 to 400 (Bad Request)
            status: 'fail',
            message: 'Validation error',
            errors: errorMessages
         });
      }

      // 2. Find user by email or username
      const user = await User.findOne({
         $or: [
            { email: loginId.toLowerCase().trim() },
            { userName: loginId.toLowerCase().trim() }
         ]
      }).select('+password +verified');

      // 3. User not found
      if (!user) {
         return res.status(401).json({
            status: 'fail',
            message: 'Invalid credentials'
         });
      }

      // 4. Verify password
      const isPasswordValid = await doHashValidation(password, user.password);
      if (!isPasswordValid) {
         return res.status(401).json({
            status: 'fail',
            message: 'Invalid credentials'
         });
      }

      // 5. Check if account is verified
      if (!user.verified) {
         return res.status(403).json({
            status: 'fail',
            message: 'Account not verified. Please check your email.'
         });
      }

      // 6. Create JWT token
      const token = jwt.sign(
         {
            userId: user._id,
            email: user.email,
            role: user.role
         },
         process.env.TOKEN_SECRET,
         { expiresIn: '7d' }
      );

      // 7. Remove sensitive data
      user.password = undefined;
      user.verifyPassword = undefined;

      // 8. Send response with cookie
      res
         .cookie('Authorization', `Bearer ${token}`, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
         })
         .status(200)
         .json({
            status: 'success',
            message: 'Logged in successfully',
            data: { user, token }
         });

   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
         status: 'error',
         message: 'An error occurred during login',
         error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
   }
};

exports.logout = async (req, res) => {
   try {
      res.clearCookie('Authorization');
      res.status(200).json({
         status: 'success',
         message: 'Logged out successfully'
      });
   } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
         status: 'error',
         message: 'An error occurred during logout',
         error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
   }
}

exports.sendVerificationCode = async (req, res) => {
   const { email } = req.body;
   try {
      // 1 get find user by email
      const existingUser = await User.findOne({ email })

      // 2 check if user exist
      if (!existingUser) {
         return res.status(404).json({
            status: 'fail',
            message: 'User Does not exist'
         })
      }

      // 3 check if user is already verified
      if (existingUser.verified) {
         return res.status(400).json({
            status: 'fail',
            message: 'User is already verified'
         })
      }

      const codeValue = Math.floor(Math.random() * (999999 - 100000) + 100000);
      const codeExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now
      existingUser.verificationCode = codeValue;
      existingUser.verificationCodeExpiry = codeExpiry;
      await existingUser.save();

      const transporter = nodemailer.createTransport({
         service: process.env.EMAIL_SERVICE,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
         }
      });

      const mailOptions = {
         from: process.env.EMAIL_FROM,
         to: email,
         subject: 'Verification Code',
         text: `Your verification code is ${codeValue}`
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
         status: 'success',
         message: 'Verification code sent successfully'
      });

   } catch (error) {
      console.log(error)
   }

}