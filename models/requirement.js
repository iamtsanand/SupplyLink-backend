const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequirementSchema = new Schema({
    // The Clerk User ID of the vendor who posted the requirement.
    clerkUserId: {
        type: String,
        required: true,
        index: true,
    },
    item: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'open', // Can be 'open', 'closed', 'in-progress'
        enum: ['open', 'closed', 'in-progress'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Requirement', RequirementSchema);
