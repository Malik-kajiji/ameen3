const WebsiteContent = require('../../models/websiteContent');
const asyncHandler = require('express-async-handler');

// Get website content
const getWebsiteContent = asyncHandler(async (req, res) => {
    const content = await WebsiteContent.findOne();
    if (!content) {
        // Create default content if none exists
        const defaultContent = await WebsiteContent.create({});
        res.json(defaultContent);
    } else {
        res.json(content);
    }
});

// Update about section
const updateAbout = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        res.status(400);
        throw new Error('Please provide both title and content');
    }

    const websiteContent = await WebsiteContent.findOne();
    if (!websiteContent) {
        res.status(404);
        throw new Error('Website content not found');
    }

    websiteContent.about.title = title;
    websiteContent.about.content = content;
    await websiteContent.save();

    res.json(websiteContent);
});

// Update features
const updateFeatures = asyncHandler(async (req, res) => {
    const { features } = req.body;
    if (!features || !Array.isArray(features)) {
        res.status(400);
        throw new Error('Please provide features array');
    }

    const websiteContent = await WebsiteContent.findOne();
    if (!websiteContent) {
        res.status(404);
        throw new Error('Website content not found');
    }

    websiteContent.features = features;
    await websiteContent.save();

    res.json(websiteContent);
});

// Update training days
const updateTrainingDays = asyncHandler(async (req, res) => {
    const { trainingDays } = req.body;
    if (!trainingDays || !Array.isArray(trainingDays)) {
        res.status(400);
        throw new Error('Please provide training days array');
    }

    const websiteContent = await WebsiteContent.findOne();
    if (!websiteContent) {
        res.status(404);
        throw new Error('Website content not found');
    }

    websiteContent.trainingDays = trainingDays;
    await websiteContent.save();

    res.json(websiteContent);
});

// Update packages
const updatePackages = asyncHandler(async (req, res) => {
    const { packages } = req.body;
    if (!packages || !Array.isArray(packages)) {
        res.status(400);
        throw new Error('Please provide packages array');
    }

    const websiteContent = await WebsiteContent.findOne();
    if (!websiteContent) {
        res.status(404);
        throw new Error('Website content not found');
    }

    websiteContent.packages = packages;
    await websiteContent.save();

    res.json(websiteContent);
});

// Update contact information
const updateContact = asyncHandler(async (req, res) => {
    const { contact } = req.body;
    if (!contact) {
        res.status(400);
        throw new Error('Please provide contact information');
    }

    const websiteContent = await WebsiteContent.findOne();
    if (!websiteContent) {
        res.status(404);
        throw new Error('Website content not found');
    }

    websiteContent.contact = contact;
    await websiteContent.save();

    res.json(websiteContent);
});

module.exports = {
    getWebsiteContent,
    updateAbout,
    updateFeatures,
    updateTrainingDays,
    updatePackages,
    updateContact
};