const express = require('express');
const router = express.Router();
const userAttendance = require('../../models/userAttendance');
const userModel = require('../../models/user');
const packageModel = require('../../models/packages');
const subscriptionModel = require('../../models/subscriptions');

function getRandomStatus() {
  const statuses = ['present', 'absent', 'late'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function generateAttendanceData(days) {
  const today = new Date();
  const data = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      status: getRandomStatus(),
    });
  }

  return data.reverse(); // oldest first
}

// Existing endpoint for attendance
router.get('/fill-attendance', async (req, res) => {
  try {
    const numberOfUsers = 10;
    const daysOfData = 90; // 3 months

    let insertedData = [];

    for (let i = 1; i <= numberOfUsers; i++) {
      const userId = `test-user-${i}`;
      const attendanceData = generateAttendanceData(daysOfData);

      let record = await userAttendance.findOne({ userId });

      if (!record) {
        record = await userAttendance.create({
          userId,
          data: attendanceData,
        });
      } else {
        record.data = attendanceData;
        await record.save();
      }

      insertedData.push(record);
    }

    res.json({
      success: true,
      message: `${numberOfUsers} users' test attendance data inserted successfully`,
      data: insertedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to insert test data',
      error: error.message,
    });
  }
});

// New endpoint to generate 5 random users
router.get('/generate-random-users', async (req, res) => {
  try {
    // First, let's check if we have packages to assign to users
    let packages = await packageModel.find();
    
    // If no packages exist, create some default ones
    if (packages.length === 0) {
      packages = await packageModel.insertMany([
        {
          title: "Basic Plan",
          price: 100,
          period: 30,
          pauseDaysAllowed: 5,
          benefits: ["Access to gym", "1 personal training session"]
        },
        {
          title: "Premium Plan",
          price: 200,
          period: 30,
          pauseDaysAllowed: 10,
          benefits: ["Access to gym", "5 personal training sessions", "Sauna access"]
        },
        {
          title: "VIP Plan",
          price: 300,
          period: 30,
          pauseDaysAllowed: 15,
          benefits: ["Access to gym", "Unlimited personal training sessions", "Sauna access", "Nutritionist consultation"]
        }
      ]);
    }

    const randomUsers = [];
    const statuses = ['active', 'paused', 'inactive'];
    const genders = ['male', 'female'];
    const cities = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Tanta', 'Mansoura', 'Port Said', 'Suez', 'Damietta'];
    
    // Generate 5 random users
    for (let i = 1; i <= 5; i++) {
      const randomName = `User ${i}`;
      const randomPhone = `010${Math.floor(100000000 + Math.random() * 900000000)}`;
      const randomEmail = `user${i}@example.com`;
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Create user with a unique userNumber
      const latestUser = await userModel.findOne().sort({ userNumber: -1 });
      const userNumber = latestUser ? latestUser.userNumber + 1 : i;
      
      const user = await userModel.create({
        userNumber,
        username: randomName,
        phone: randomPhone,
        email: randomEmail,
        password: '$2b$10$examplehash', // Placeholder password
        gender: randomGender,
        city: randomCity,
        profilePicture: 'default.jpg',
        status: randomStatus
      });
      
      // Assign a random package to the user
      if (packages.length > 0) {
        const randomPackage = packages[Math.floor(Math.random() * packages.length)];
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + randomPackage.period);
        
        const subscription = await subscriptionModel.create({
          userId: user._id.toString(),
          packageId: randomPackage._id.toString(),
          packageName: randomPackage.title,
          packagePrice: randomPackage.price,
          packagePeriod: randomPackage.period,
          startData: startDate,
          endData: endDate,
          status: randomStatus === 'active' ? 'active' : 'paused',
          createdBy: 'admin'
        });
      }
      
      randomUsers.push(user);
    }

    res.json({
      success: true,
      message: '5 random users generated successfully',
      data: randomUsers,
      count: randomUsers.length
    });
  } catch (error) {
    console.error('Error generating random users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate random users',
      error: error.message,
    });
  }
});

// New endpoint to get packages without authentication (for testing)
router.get('/packages', async (req, res) => {
  try {
    console.log("Fetching all packages (test endpoint)");
    const packages = await packageModel.find();
    console.log("Fetched packages (test endpoint):", packages);
    res.status(200).json(packages);
  } catch (err) {
    console.error("Error in test getPackages:", err);
    res.status(400).json({ message: err.message });
  }
});

// New endpoint to generate sample financial data
router.get('/generate-financial-data', async (req, res) => {
  try {
    const profitModel = require('../../models/profits');
    const expenseModel = require('../../models/expense');
    
    // Clear existing financial data
    await profitModel.deleteMany({});
    await expenseModel.deleteMany({});
    
    // Generate sample profits (income)
    const profitSources = ['subscription', 'membership', 'personal_training', 'other'];
    const profits = [];
    
    // Generate profits for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 2-5 profits per day
      const profitsPerDay = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < profitsPerDay; j++) {
        profits.push({
          amount: Math.floor(Math.random() * 500) + 50, // 50-550
          source: profitSources[Math.floor(Math.random() * profitSources.length)],
          date: new Date(date),
          note: `Sample profit entry ${i}-${j}`
        });
      }
    }
    
    // Generate sample expenses
    const expenseCategories = ['rent', 'utilities', 'salaries', 'maintenance', 'marketing', 'insurance', 'other'];
    const expenses = [];
    
    // Generate expenses for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 1-3 expenses per day
      const expensesPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < expensesPerDay; j++) {
        const statusOptions = ['paid', 'pending', 'overdue'];
        const paymentMethods = ['cash', 'card', 'bank_transfer', 'other'];
        
        expenses.push({
          amount: Math.floor(Math.random() * 1000) + 50, // 50-1050
          category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
          description: `Sample expense ${i}-${j}`,
          date: new Date(date),
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          note: `Sample expense entry ${i}-${j}`
        });
      }
    }
    
    // Insert the data
    await profitModel.insertMany(profits);
    await expenseModel.insertMany(expenses);
    
    res.json({
      success: true,
      message: 'Sample financial data generated successfully',
      profitsGenerated: profits.length,
      expensesGenerated: expenses.length
    });
  } catch (error) {
    console.error('Error generating financial data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial data',
      error: error.message,
    });
  }
});

// New endpoint to generate sample asset data
router.get('/generate-asset-data', async (req, res) => {
  try {
    const assetModel = require('../../models/assets');
    const maintenanceLogModel = require('../../models/maintenanceLog');
    
    // Clear existing asset data
    await assetModel.deleteMany({});
    await maintenanceLogModel.deleteMany({});
    
    // Generate sample assets
    const assetNames = [
      'جهاز الجري #1', 'جهاز الجري #2', 'جهاز الجري #3',
      'جهاز الضغط', 'جهاز السحب', 'جهاز السكوات',
      'مجموعة الأثقال 10-50kg', 'مجموعة الأثقال 5-25kg',
      'جهاز البساط المطاطي', 'جهاز المشاية', 'جهاز الدراجة الثابتة'
    ];
    
    const assets = [];
    
    // Generate 10 sample assets
    for (let i = 0; i < 10; i++) {
      const purchaseDate = new Date();
      purchaseDate.setDate(purchaseDate.getDate() - Math.floor(Math.random() * 365));
      
      const warrantyExpire = new Date(purchaseDate);
      warrantyExpire.setFullYear(warrantyExpire.getFullYear() + 2);
      
      const categories = ['أجهزة كارديو', 'أجهزة القوة', 'أوزان حرة', 'أجهزة وظيفية'];
      const statuses = ['ممتاز', 'جيد', 'يحتاج صيانة', 'تالف'];
      
      assets.push({
        name: assetNames[i] || `جهاز #${i+1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 5000) + 500, // 500-5500
        purchaseDate: purchaseDate,
        warrantyExpire: warrantyExpire,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: `الطابق ${Math.floor(Math.random() * 3) + 1}`,
        supplier: `شركة ${String.fromCharCode(65 + Math.floor(Math.random() * 26))} للتجهيزات الرياضية`
      });
    }
    
    // Insert the assets
    const insertedAssets = await assetModel.insertMany(assets);
    
    // Generate sample maintenance logs for some assets
    const maintenanceLogs = [];
    const maintenanceTypes = ['صيانة دورية', 'إصلاح عطل', 'استبدال قطع', 'فحص شامل'];
    
    // Generate maintenance logs for first 5 assets
    for (let i = 0; i < 5; i++) {
      const asset = insertedAssets[i];
      if (asset) {
        // Generate 1-3 maintenance logs per asset
        const logsCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < logsCount; j++) {
          const maintenanceDate = new Date(asset.purchaseDate);
          maintenanceDate.setDate(maintenanceDate.getDate() + Math.floor(Math.random() * 180));
          
          maintenanceLogs.push({
            asset_id: asset._id.toString(),
            maintenanceType: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
            description: `وصف الصيانة #${j+1} للأصل ${asset.name}`,
            maintenanceDate: maintenanceDate,
            cost: Math.floor(Math.random() * 500) + 50 // 50-550
          });
        }
      }
    }
    
    // Insert the maintenance logs
    await maintenanceLogModel.insertMany(maintenanceLogs);
    
    res.json({
      success: true,
      message: 'Sample asset data generated successfully',
      assetsGenerated: insertedAssets.length,
      maintenanceLogsGenerated: maintenanceLogs.length
    });
  } catch (error) {
    console.error('Error generating asset data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate asset data',
      error: error.message,
    });
  }
});

module.exports = router;
