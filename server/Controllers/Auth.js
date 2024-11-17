const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config();


//signup route handler
exports.signup = async (req, res) => {
    try {
        //get data
        const { name, email, password, role } = req.body;
        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User Created Successfully',
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later',
        });
    }
}


//login
// const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Log the received data for debugging
    console.log("Received email:", email);
    // console.log("Received username:", username);
    console.log("Received password:", password);

    // Ensure that either email or username is provided
    if (!email && !username) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or username',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password',
      });
    }

    // Determine which field (email or username) to query with
    let user;
    if (email) {
      user = await User.findOne({ email: email });  // Find user by email
    } else if (username) {
      user = await User.findOne({
        username: { $regex: '^' + username + '$', $options: 'i' } // Case-insensitive username query
      });
    }

    // Log user object found in the database for debugging
    console.log("User found:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found with the provided email or username',
      });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(403).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Create a payload for the JWT token
    const payload = {
      username: user.username,
      id: user._id,
      role: user.role,
    };

    // Sign the JWT with a secret (ensure JWT_SECRET is set in environment variables)
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Convert the user document to a plain object (without methods)
    user = user.toObject();
    user.token = token;  // Add the token to the user object
    user.password = undefined; // Remove the password field from the response

    // Set JWT token as a cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Token expiration (3 days)
      httpOnly: true, // Prevent client-side access to cookie
    };

    res.cookie('token', token, options) // Set the token as a secure cookie
      .status(200) // Send the response with status 200 (OK)
      .json({
        success: true,
        token,
        user,
        message: 'User logged in successfully',
      });

  } catch (error) {
    console.error("Login error:", error); // Log any errors for debugging

    // Return a generic error response with status 500
    return res.status(500).json({
      success: false,
      message: 'Login failed, please try again',
    });
  }
};
