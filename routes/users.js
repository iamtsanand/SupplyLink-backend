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

// @route   POST api/users/submit-verification
// @desc    Allows a supplier to submit their verification document URL
// @access  Private
router.post('/submit-verification', async (req, res) => {
    const { clerkUserId, documentUrl } = req.body;

    if (!clerkUserId || !documentUrl) {
        return res.status(400).json({ message: 'User ID and document URL are required.' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { clerkUserId: clerkUserId, role: 'supplier' },
            { 
                $set: { 
                    gstDocumentUrl: documentUrl,
                    verificationStatus: 'pending' // Set status to pending for admin review
                } 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        res.json({ message: 'Verification document submitted successfully. It is now pending review.', user });

    } catch (error) {
        console.error('Error submitting verification:', error.message);
        res.status(500).send('Server Error');
    }
});


// --- NEW ADMIN ROUTE TO VERIFY A SUPPLIER ---
// @route   PUT api/users/verify-supplier/:clerkUserId
// @desc    (Admin) Mark a supplier as verified
// @access  Admin Only (should be protected by an admin check)
router.put('/verify-supplier/:clerkUserId', async (req, res) => {
    const { clerkUserId } = req.params;

    try {
        const user = await User.findOneAndUpdate(
            { clerkUserId: clerkUserId, role: 'supplier' },
            { $set: { verificationStatus: 'verified' } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }

        res.json({ message: 'Supplier has been verified successfully.', user });

    } catch (error) {
        console.error('Error verifying supplier:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
