const mongoose = require('mongoose');

/**
 * Post Schema
 * Defines the structure and validation rules for blog posts/articles
 */
const postsSchema = mongoose.Schema({
   /**
    * Title of the post
    * - Required field
    * - Trimmed to remove whitespace
    * - Minimum and maximum length enforced
    */
   title: {
      type: String,
      required: [true, 'Title is REQUIRED'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true // Index for better query performance
   },

   /**
    * Main content/description of the post
    * - Required field
    * - Trimmed to remove whitespace
    * - Minimum length enforced
    */
   description: {
      type: String,
      required: [true, 'Description is REQUIRED'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters long']
   },

   /**
    * Reference to the User who created this post
    * - Required field
    * - References the User model
    * - Automatically indexed by Mongoose
    */
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is REQUIRED'],
      index: true
   },

   /**
    * Post status (active/draft/archived)
    * - Defaults to 'draft'
    * - Only allows specific values
    */
   status: {
      type: String,
      enum: {
         values: ['draft', 'published', 'archived'],
         message: '{VALUE} is not a valid post status'
      },
      default: 'draft'
   },

   /**
    * Array of tags/categories for the post
    * - Optional field
    * - Each tag is trimmed and converted to lowercase
    */
   tags: {
      type: [{
         type: String,
         trim: true,
         lowercase: true
      }],
      validate: {
         validator: function (v) {
            return v.length <= 10; // Maximum 10 tags per post
         },
         message: 'A post cannot have more than 10 tags'
      }
   },

   /**
    * Featured image URL
    * - Optional field
    * - Validated as URL format
    */
   featuredImage: {
      type: String,
      validate: {
         validator: function (v) {
            return /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
         },
         message: props => `${props.value} is not a valid image URL!`
      }
   },

   /**
    * SEO metadata
    * - Optional field
    * - Contains meta title and description
    */
   seo: {
      metaTitle: {
         type: String,
         trim: true,
         maxlength: [60, 'Meta title cannot exceed 60 characters']
      },
      metaDescription: {
         type: String,
         trim: true,
         maxlength: [160, 'Meta description cannot exceed 160 characters']
      }
   }

}, {
   // Enable automatic timestamps (createdAt, updatedAt)
   timestamps: true,

   // Include virtuals when converting to JSON/object
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});

/**
 * Virtual property for post URL
 * (Doesn't persist in database)
 */
postsSchema.virtual('url').get(function () {
   return `/posts/${this._id}`;
});

/**
 * Indexes for better query performance
 */
postsSchema.index({ title: 'text', description: 'text' }); // Text search index
postsSchema.index({ status: 1, createdAt: -1 }); // Compound index

// Export the Post model
module.exports = mongoose.model('Post', postsSchema);