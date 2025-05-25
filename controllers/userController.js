const User = require("../models/usersModels");

exports.getUserById = async (req, res) => {
   try {
      const { userId } = req.params;

      // Validate ID format (optional but recommended)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json({
            status: 'fail',
            message: 'Invalid user ID format'
         });
      }

      // Fetch user and exclude sensitive fields
      const user = await User.findById(userId).select('-password -verifyPassword');

      // Handle case where user doesn't exist
      if (!user) {
         return res.status(404).json({
            status: 'fail',
            message: 'User not found'
         });
      }

      res.status(200).json({
         status: 'success',
         data: { user },
         message: 'User fetched successfully'
      });

   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Failed to fetch user'  
      });
   }
};

exports.getAllUsers = async (req, res) => {
   try {
      const users = await User.find().select('-password -verifyPassword');

      res.status(200).json({
         status: 'success',
         results: users.length,
         data: users,
         message: 'User data fetched successfully',
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Failed to fetch users',
      });
   }
};