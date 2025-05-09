const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Name is REQUIRED'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      match: [/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes']
   },
   userName: {
      type: String,
      required: [true, 'Username is REQUIRED'],
      trim: true,
      unique: [true, 'Username must be UNIQUE'],
      minlength: [5, 'Username must be at least 5 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      lowercase: true,
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores']
   },
   phone: {
      type: String,
      required: [true, 'Phone number is REQUIRED'],
      trim: true,
      validate: {
         validator: function (v) {
            // Supports  international phone numbers with optional + prefix
            return /^\+?\d{8,15}$/.test(v);
         },
         message: props => `${props.value} is not a valid phone number! Must be 8-15 digits, optionally starting with +`
      }
   },
   email: {
      type: String,
      required: [true, 'Email is REQUIRED'],
      trim: true,
      unique: [true, 'Email must be UNIQUE'],
      lowercase: true,
      validate: {
         validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
         },
         message: props => `${props.value} is not a valid email address!`
      }
   },
   role: {
      type: String,
      required: [true, 'Role is REQUIRED'],
      enum: {
         values: ['user', 'admin', 'developer', 'moderator'],
         message: '{VALUE} is not a valid role. Must be one of: user, admin,developer, moderator'
      },
      default: 'user'
   },
   status: {
      type: String,
      required: [true, 'Status is REQUIRED'],
      enum: {
         values: ['active', 'inactive', 'suspended', 'pending'],
         message: '{VALUE} is not a valid status. Must be one of: active, inactive, suspended, pending'
      },
      default: 'pending'
   },
   password: {
      type: String,
      required: [true, 'Password is REQUIRED'],
      trim: true,
      select: false,
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
         validator: function (v) {
            // At least one uppercase, one lowercase, one number, one special character
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(v);
         },
         message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
   },
   verifyPassword: {
      type: String,
      required: [true, 'Password confirmation is REQUIRED'],
      validate: {
         validator: function (v) {
            return v === this.password;
         },
         message: 'Passwords do not match'
      },
      trim: true,
      select: false
   },
   verified: {
      type: Boolean,
      default: false
   },
   verificationCode: {
      type: String,
      select: false
   },
   verificationCodeExpiry: {
      type: Date,
      select: false
   },
   forgotPasswordCode: {
      type: String,
      select: false
   },
   forgotPasswordCodeExpiry: {
      type: Date,
      select: false
   },
   lastLogin: {
      type: Date
   },
   loginAttempts: {
      type: Number,
      default: 0,
      select: false
   },
   accountLockedUntil: {
      type: Date,
      select: false
   }
}, {
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userName: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);