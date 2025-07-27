const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// @route   POST api/users
// @desc    Create a new user in the database after Clerk sign-up
// @access  Public (should be protected in a real app, e.g., with Clerk webhooks)
router.post('/', async (req, res) => {
    const {
        clerkUserId,
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        state,
        pincode,
        role
    } = req.body;

    try {
        // Check if a user with this Clerk ID already exists
        let user = await User.findOne({ clerkUserId });

        if (user) {
            // If user exists, you might want to update them or just return the existing user
            return res.status(400).json({ message: 'User already exists in the database.' });
        }

        // If user doesn't exist, create a new one
        user = new User({
            clerkUserId,
            firstName,
            lastName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            role
        });

        // Save the new user to the database
        await user.save();

        // Respond with the newly created user object
        res.status(201).json(user);

    } catch (error) {
        console.error('Error creating user in DB:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
