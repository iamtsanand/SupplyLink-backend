const express = require('express');
const router = express.Router();
const Bid = require('../models/bid'); // Import the Bid model
const Requirement = require('../models/requirement'); // Import the Requirement model to validate it exists

// @route   POST api/bids
// @desc    Create a new bid for an aggregated item in a state
// @access  Public (should be protected in a real app)
router.post('/', async (req, res) => {
    const { item, state, clerkUserId, supplierName, price } = req.body;

    if (!item || !state || !clerkUserId || !supplierName || !price) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // --- Validation Logic ---

        // 1. Check if this supplier has already bid on this item in this state.
        const existingBid = await Bid.findOne({ item, state, clerkUserId });
        if (existingBid) {
            return res.status(409).json({ message: 'You have already placed a bid for this item.' });
        }

        // 2. Check if the new bid is lower than the current lowest bid.
        const lowestBid = await Bid.findOne({ item, state }).sort({ price: 1 });
        if (lowestBid && price >= lowestBid.price) {
            return res.status(400).json({ message: `Your bid must be lower than the current lowest bid of ₹${lowestBid.price}.` });
        }

        // --- Create New Bid ---
        const newBid = new Bid({
            item,
            state,
            clerkUserId,
            supplierName,
            price,
        });

        const savedBid = await newBid.save();
        res.status(201).json(savedBid);

    } catch (error) {
        console.error('Error creating bid:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/bids/state/:state
// @desc    Get all bids for a specific state
// @access  Public
router.get('/state/:state', async (req, res) => {
    try {
        // Find all bids that match the state parameter
        const bids = await Bid.find({ state: req.params.state });
        res.json(bids);
    } catch (error) {
        console.error('Error fetching bids by state:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
