const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// @route   POST api/users
// @desc    Create a new user in the database after Clerk sign-up
// @access  Public
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
        let user = await User.findOne({ clerkUserId });

        if (user) {
            return res.status(400).json({ message: 'User already exists in the database.' });
        }

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
            // hasCompletedOnboarding will default to false
        });

        await user.save();
        // Return the full user object, including the new flag
        res.status(201).json(user);

    } catch (error) {
        console.error('Error creating user in DB:', error.message);
        res.status(500).send('Server Error');
    }
});

// --- NEW ROUTE ---
// @route   PUT api/users/complete-onboarding
// @desc    Mark a user's onboarding as complete
// @access  Private (should be protected)
router.put('/complete-onboarding', async (req, res) => {
    const { clerkUserId } = req.body;

    if (!clerkUserId) {
        return res.status(400).json({ message: 'Clerk User ID is required.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { clerkUserId: clerkUserId },
            { $set: { hasCompletedOnboarding: true } },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'Onboarding completed successfully.', user });

    } catch (error) {
        console.error('Error completing onboarding:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
