const express = require('express');
const router = express.Router();
const Requirement = require('../models/requirement'); // Import the Requirement model

// @route   POST api/requirements
// @desc    Create a new requirement
// @access  Public (should be protected in a real app)
router.post('/', async (req, res) => {
    const { clerkUserId, item, quantity, unit, price, pincode, state } = req.body;

    // Basic validation
    if (!clerkUserId || !item || !quantity || !unit || !price || !pincode || !state) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const newRequirement = new Requirement({
            clerkUserId,
            item,
            quantity,
            unit,
            price,
            pincode,
            state,
        });

        const savedRequirement = await newRequirement.save();
        res.status(201).json(savedRequirement);

    } catch (error) {
        console.error('Error creating requirement:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/requirements/state/:state
// @desc    Get all requirements for a specific state
// @access  Public
router.get('/state/:state', async (req, res) => {
    try {
        const requirements = await Requirement.find({ state: req.params.state, status: 'open' });
        res.json(requirements);
    } catch (error) {
        console.error('Error fetching requirements by state:', error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
