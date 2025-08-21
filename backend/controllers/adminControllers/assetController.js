const assetModel = require('../../models/assets');
const maintenanceLogModel = require('../../models/maintenanceLog');

// Get all assets
const getAllAssets = async (req, res) => {
    try {
        // Get all assets
        const assets = await assetModel.find().sort({ purchaseDate: -1 });
        
        // Format assets data
        const formattedAssets = await Promise.all(assets.map(async asset => {
            // Calculate total maintenance cost for this asset
            const maintenanceLogs = await maintenanceLogModel.find({ asset_id: asset._id.toString() });
            const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
            
            return {
                id: asset._id.toString(),
                name: asset.name,
                category: asset.category,
                price: asset.price,
                purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString().split('T')[0] : '',
                warrantyExpire: asset.warrantyExpire ? asset.warrantyExpire.toISOString().split('T')[0] : '',
                status: asset.status,
                location: asset.location,
                supplier: asset.supplier,
                totalMaintenanceCost: totalMaintenanceCost,
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt
            };
        }));
        
        res.status(200).json(formattedAssets);
    } catch (err) {
        console.error("Error in getAllAssets:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get a single asset by ID
const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find asset by ID
        const asset = await assetModel.findById(id);
        
        if (!asset) {
            return res.status(404).json({ message: 'الأصل غير موجود' });
        }
        
        const formattedAsset = {
            id: asset._id.toString(),
            name: asset.name,
            category: asset.category,
            price: asset.price,
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString().split('T')[0] : '',
            warrantyExpire: asset.warrantyExpire ? asset.warrantyExpire.toISOString().split('T')[0] : '',
            status: asset.status,
            location: asset.location,
            supplier: asset.supplier,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt
        };
        
        res.status(200).json(formattedAsset);
    } catch (err) {
        console.error("Error in getAssetById:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create a new asset
const createAsset = async (req, res) => {
    try {
        const { name, price, purchaseDate, warrantyExpire, category, status, location, supplier } = req.body;
        
        // Validate required fields
        if (!name || !price) {
            return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
        }
        
        // Create new asset using the model's static method
        const asset = await assetModel.addAsset(
            name,
            price,
            purchaseDate,
            warrantyExpire,
            category,
            status,
            location,
            supplier
        );
        
        // Calculate total maintenance cost for this asset
        const maintenanceLogs = await maintenanceLogModel.find({ asset_id: asset._id.toString() });
        const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
        
        const formattedAsset = {
            id: asset._id.toString(),
            name: asset.name,
            category: asset.category,
            price: asset.price,
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString().split('T')[0] : '',
            warrantyExpire: asset.warrantyExpire ? asset.warrantyExpire.toISOString().split('T')[0] : '',
            status: asset.status,
            location: asset.location,
            supplier: asset.supplier,
            totalMaintenanceCost: totalMaintenanceCost,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt
        };
        
        res.status(201).json({ 
            message: 'تم إنشاء الأصل بنجاح',
            asset: formattedAsset
        });
    } catch (err) {
        console.error("Error in createAsset:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update an asset
const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, purchaseDate, warrantyExpire, status, location, supplier } = req.body;
        
        // Find and update the asset
        const asset = await assetModel.findByIdAndUpdate(
            id,
            { name, category, price, purchaseDate, warrantyExpire, status, location, supplier },
            { new: true }
        );
        
        if (!asset) {
            return res.status(404).json({ message: 'الأصل غير موجود' });
        }
        
        // Calculate total maintenance cost for this asset
        const maintenanceLogs = await maintenanceLogModel.find({ asset_id: asset._id.toString() });
        const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
        
        const formattedAsset = {
            id: asset._id.toString(),
            name: asset.name,
            category: asset.category,
            price: asset.price,
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.toISOString().split('T')[0] : '',
            warrantyExpire: asset.warrantyExpire ? asset.warrantyExpire.toISOString().split('T')[0] : '',
            status: asset.status,
            location: asset.location,
            supplier: asset.supplier,
            totalMaintenanceCost: totalMaintenanceCost,
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt
        };
        
        res.status(200).json({ 
            message: 'تم تحديث بيانات الأصل بنجاح',
            asset: formattedAsset
        });
    } catch (err) {
        console.error("Error in updateAsset:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete an asset
const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete the asset
        const asset = await assetModel.findByIdAndDelete(id);
        
        if (!asset) {
            return res.status(404).json({ message: 'الأصل غير موجود' });
        }
        
        res.status(200).json({ 
            message: 'تم حذف الأصل بنجاح',
            asset: {
                id: asset._id.toString(),
                name: asset.name
            }
        });
    } catch (err) {
        console.error("Error in deleteAsset:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get maintenance logs for an asset
const getMaintenanceLogs = async (req, res) => {
    try {
        const { assetId } = req.params;
        
        // Get maintenance logs for the asset
        const logs = await maintenanceLogModel.find({ asset_id: assetId }).sort({ maintenanceDate: -1 });
        
        const formattedLogs = logs.map(log => {
            return {
                id: log._id.toString(),
                assetId: log.asset_id,
                maintenanceType: log.maintenanceType,
                description: log.description,
                maintenanceDate: log.maintenanceDate ? log.maintenanceDate.toISOString().split('T')[0] : '',
                cost: log.cost,
                createdAt: log.createdAt,
                updatedAt: log.updatedAt
            };
        });
        
        res.status(200).json(formattedLogs);
    } catch (err) {
        console.error("Error in getMaintenanceLogs:", err);
        res.status(400).json({ message: err.message });
    }
};

// Add maintenance log for an asset
const addMaintenanceLog = async (req, res) => {
    try {
        const { assetId } = req.params;
        const { maintenanceType, description, maintenanceDate, cost } = req.body;
        
        // Validate required fields
        if (!maintenanceType || !description || !maintenanceDate) {
            return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
        }
        
        // Add maintenance log using the model's static method
        const log = await maintenanceLogModel.addLog(
            assetId,
            maintenanceType,
            description,
            maintenanceDate,
            cost || 0
        );
        
        const formattedLog = {
            id: log._id.toString(),
            assetId: log.asset_id,
            maintenanceType: log.maintenanceType,
            description: log.description,
            maintenanceDate: log.maintenanceDate ? log.maintenanceDate.toISOString().split('T')[0] : '',
            cost: log.cost,
            createdAt: log.createdAt,
            updatedAt: log.updatedAt
        };
        
        res.status(201).json({ 
            message: 'تم إضافة سجل الصيانة بنجاح',
            log: formattedLog
        });
    } catch (err) {
        console.error("Error in addMaintenanceLog:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get monthly maintenance costs
const getMonthlyMaintenanceCosts = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const logs = await maintenanceLogModel.find({
            maintenanceDate: {
                $gte: startOfMonth,
                $lte: now
            }
        });
        
        const totalCost = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
        
        res.status(200).json({
            totalCost,
            count: logs.length
        });
    } catch (err) {
        console.error("Error getting maintenance costs:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
    getMaintenanceLogs,
    addMaintenanceLog,
    getMonthlyMaintenanceCosts
};