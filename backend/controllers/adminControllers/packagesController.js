const Package = require('../../models/packages');

const getPackages = async (req, res) => {
    try {
        const packages = await Package.getAllPackages();
        res.status(200).json(packages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePackages = async (req, res) => {
    try {
        const { packages } = req.body;
        
        // Delete all existing packages
        await Package.deleteMany({});
        
        // Create new packages
        const updatedPackages = await Promise.all(
            packages.map(async (pkg) => {
                return await Package.create({
                    title: pkg.title,
                    price: pkg.price,
                    period: pkg.period,
                    pauseDaysAllowed: pkg.pauseDaysAllowed || 0,
                    benefits: pkg.benefits
                });
            })
        );

        res.status(200).json(updatedPackages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPackages,
    updatePackages
};