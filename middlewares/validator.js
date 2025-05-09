const Joi = require('joi');

exports.signupSchema = Joi.object({
   name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s'-]+$/)
      .messages({
         'string.empty': 'Name is REQUIRED',
         'string.min': 'Name must be at least 2 characters',
         'string.max': 'Name cannot exceed 50 characters',
         'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes'
      }),
   userName: Joi.string()
      .required()
      .trim()
      .min(5)
      .max(30)
      .lowercase()
      .pattern(/^[a-z0-9_]+$/)
      .messages({
         'string.empty': 'Username is REQUIRED',
         'string.min': 'Username must be at least 5 characters',
         'string.max': 'Username cannot exceed 30 characters',
         'string.pattern.base': 'Username can only contain lowercase letters, numbers, and underscores'
      }),
   phone: Joi.string()
      .required()
      .trim()
      .pattern(/^\+?\d{8,15}$/)
      .messages({
         'string.empty': 'Phone number is REQUIRED',
         'string.pattern.base': 'Must be 8-15 digits, optionally starting with +'
      }),
   email: Joi.string()
      .required()
      .min(5)
      .max(30)
      .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .email({
         tlds: { allow: ['com', 'net', 'org'] }
      })
      .messages({
         'string.empty': 'Email is REQUIRED',
         'string.email': 'Must be a valid email address'
      }),
   role: Joi.string()
      .required()
      .valid('user', 'admin', 'developer', 'moderator')
      .default('user')
      .messages({
         'any.only': 'Must be one of: user, admin, developer, moderator'
      }),

   password: Joi.string()
      .required()
      .min(8)
      .messages({
         'string.empty': 'Password is REQUIRED',
         'string.min': 'Password must be at least 8 characters',
         'string.pattern.base':
            'Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*()_+-=)'
      }),

   verifyPassword: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
         'any.only': 'Passwords do not match',
         'string.empty': 'Please confirm your password'
      })
})


exports.loginSchema = Joi.object({
   loginId: Joi.alternatives()
      .try(
         Joi.string().email(),
         Joi.string().min(5).max(30).pattern(/^[a-z0-9_]+$/)
      )
      .required()
      .messages({
         'alternatives.match': 'Please provide a valid email or username'
      }),
   password: Joi.string().required()
});
