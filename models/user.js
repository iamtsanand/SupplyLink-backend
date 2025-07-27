const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // This is the unique ID from Clerk which links this user to your auth system.
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
        index: true, // Add an index for faster lookups
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['vendor', 'supplier'], // Ensures the role is one of these two values
    },
    // --- NEW FIELD ---
    // This flag will track if the user has completed the onboarding flow.
    hasCompletedOnboarding: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
