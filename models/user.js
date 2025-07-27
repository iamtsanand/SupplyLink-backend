const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // This is the unique ID from Clerk which links this user to your auth system.
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
        index: true,
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
        enum: ['vendor', 'supplier'],
    },
    hasCompletedOnboarding: {
        type: Boolean,
        default: false,
    },
    // --- NEW FIELDS FOR VERIFICATION ---
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified',
    },
    gstDocumentUrl: {
        type: String, // Will store the URL to the uploaded document
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
