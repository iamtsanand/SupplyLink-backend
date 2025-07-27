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


// @route   PUT api/requirements/:id
// @desc    Update a requirement
// @access  Private (should be protected)
router.put('/:id', async (req, res) => {
    const { item, quantity, unit, price } = req.body;

    try {
        // In a real app, you'd also verify that the clerkUserId from the request
        // matches the clerkUserId on the requirement to ensure ownership.
        const updatedRequirement = await Requirement.findByIdAndUpdate(
            req.params.id,
            { item, quantity, unit, price },
            { new: true } // This option returns the document after it has been updated
        );

        if (!updatedRequirement) {
            return res.status(404).json({ message: 'Requirement not found.' });
        }

        res.json(updatedRequirement);
    } catch (error) {
        console.error('Error updating requirement:', error.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/requirements/:id
// @desc    Delete a requirement
// @access  Private (should be protected)
router.delete('/:id', async (req, res) => {
    try {
        // Again, you would verify ownership here in a real app.
        const deletedRequirement = await Requirement.findByIdAndDelete(req.params.id);

        if (!deletedRequirement) {
            return res.status(404).json({ message: 'Requirement not found.' });
        }

        res.json({ message: 'Requirement deleted successfully.' });
    } catch (error) {
        console.error('Error deleting requirement:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
