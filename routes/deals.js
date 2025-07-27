const express = require('express');
const router = express.Router();
const PastDeal = require('../models/pastDeal'); // Your PastDeal model
const User = require('../models/user'); // Your User model

// @route   GET api/deals
// @desc    Get all past deals with populated user names
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch the last 10 deals, sorted by most recent
        const deals = await PastDeal.find().sort({ closedAt: -1 }).limit(10);

        // Create a detailed response with user names
        const detailedDeals = await Promise.all(deals.map(async (deal) => {
            // Find the winning supplier's details
            const supplier = await User.findOne({ clerkUserId: deal.winningSupplierId });
            
            // Find all vendors' details
            const vendors = await User.find({ clerkUserId: { $in: deal.vendorIds } });

            return {
                _id: deal._id,
                item: deal.item,
                state: deal.state,
                winningPrice: deal.winningPrice,
                totalQuantity: deal.totalQuantity,
                unit: deal.unit,
                closedAt: deal.closedAt,
                // Add the names to the response object
                winningSupplierName: supplier ? supplier.firstName + ' ' + supplier.lastName : 'N/A',
                vendorNames: vendors.map(v => v.firstName + ' ' + v.lastName),
            };
        }));

        res.json(detailedDeals);

    } catch (error) {
        console.error('Error fetching past deals:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
