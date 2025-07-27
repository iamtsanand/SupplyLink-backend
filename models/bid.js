const mongoose = require('mongoose');
const { Schema } = mongoose;

const BidSchema = new Schema({
    // The item being bid on (e.g., "Steel Rods (TMT)").
    item: {
        type: String,
        required: true,
        index: true,
    },
    // The state where the aggregated demand exists.
    state: {
        type: String,
        required: true,
        index: true,
    },
    // The Clerk User ID of the supplier who placed the bid.
    clerkUserId: {
        type: String,
        required: true,
    },
    // The name of the supplier (for easy display).
    supplierName: {
        type: String,
        required: true,
    },
    // The price offered in the bid.
    price: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index to ensure a supplier can only bid once per item per state.
BidSchema.index({ item: 1, state: 1, clerkUserId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', BidSchema);
