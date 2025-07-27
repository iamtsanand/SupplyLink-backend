const mongoose = require('mongoose');
const { Schema } = mongoose;

const PastDealSchema = new Schema({
    item: {
        type: String,
        required: true,
        index: true,
    },
    state: {
        type: String,
        required: true,
        index: true,
    },
    winningSupplierId: {
        type: String, // Clerk User ID of the winning supplier
        required: true,
    },
    winningSupplierName: {
        type: String,
        required: true,
    },
    winningPrice: {
        type: Number,
        required: true,
    },
    totalQuantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    // An array of all vendor Clerk User IDs who were part of this deal
    vendorIds: {
        type: [String],
        required: true,
    },
    // An array of all the original requirement IDs that were fulfilled
    fulfilledRequirementIds: {
        type: [Schema.Types.ObjectId],
        ref: 'Requirement',
        required: true,
    },
    closedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('PastDeal', PastDealSchema);
