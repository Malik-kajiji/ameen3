const userModel = require('./models/user');
const profitModel = require('./models/profits');
const subscriptionModel = require('./models/subscriptions');
const userAttendanceModel = require('./models/userAttendance');
const packageModel = require('./models/packages');

/**
 * Function to fill sample data into the models used in homePageRoutes
 */
const fillHomePageData = async () => {
  try {
    // Clear existing data first
    await userModel.deleteMany({});
    await profitModel.deleteMany({});
    await subscriptionModel.deleteMany({});
    await userAttendanceModel.deleteMany({});
    await packageModel.deleteMany({});

    // Sample packages data
    const packages = await packageModel.insertMany([
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

    // Sample users data
    const users = await userModel.insertMany([
      {
        userNumber: 1,
        username: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        password: "hashedpassword1",
        gender: "male",
        city: "New York",
        profilePicture: "profile1.jpg",
        status: "active"
      },
      {
        userNumber: 2,
        username: "Jane Smith",
        phone: "0987654321",
        email: "jane@example.com",
        password: "hashedpassword2",
        gender: "female",
        city: "Los Angeles",
        profilePicture: "profile2.jpg",
        status: "active"
      },
      {
        userNumber: 3,
        username: "Bob Johnson",
        phone: "1122334455",
        email: "bob@example.com",
        password: "hashedpassword3",
        gender: "male",
        city: "Chicago",
        profilePicture: "profile3.jpg",
        status: "paused"
      }
    ]);

    // Sample profits data for the current week
    const now = new Date();
    const profits = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - now.getDay() + i);
      profits.push({
        amount: Math.floor(Math.random() * 500) + 100,
        source: "subscription",
        date: date,
        note: `Profit for ${date.toDateString()}`
      });
    }
    await profitModel.insertMany(profits);

    // Sample subscriptions data
    const subscriptions = await subscriptionModel.insertMany([
      {
        userId: users[0]._id.toString(),
        packageId: packages[0]._id.toString(),
        packageName: packages[0].title,
        packagePrice: packages[0].price,
        packagePeriod: packages[0].period,
        startData: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
        endData: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20),
        status: "active",
        createdBy: "admin"
      },
      {
        userId: users[1]._id.toString(),
        packageId: packages[1]._id.toString(),
        packageName: packages[1].title,
        packagePrice: packages[1].price,
        packagePeriod: packages[1].period,
        startData: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15),
        endData: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
        status: "active",
        createdBy: "admin"
      },
      {
        userId: users[2]._id.toString(),
        packageId: packages[2]._id.toString(),
        packageName: packages[2].title,
        packagePrice: packages[2].price,
        packagePeriod: packages[2].period,
        startData: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 20),
        endData: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        status: "paused",
        createdBy: "admin"
      }
    ]);

    // Sample user attendance data
    const attendanceRecords = [];
    for (const user of users) {
      const attendanceData = [];
      // Add attendance for the past week
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - now.getDay() + i);
        // Randomly decide if user attended on this day (70% chance)
        if (Math.random() > 0.3) {
          attendanceData.push({
            date: date.toISOString()
          });
        }
      }
      attendanceRecords.push({
        userId: user._id.toString(),
        data: attendanceData
      });
    }
    await userAttendanceModel.insertMany(attendanceRecords);

    console.log("Sample data filled successfully!");
    return {
      success: true,
      message: "Sample data filled successfully!",
      data: {
        users: users.length,
        packages: packages.length,
        profits: profits.length,
        subscriptions: subscriptions.length,
        attendanceRecords: attendanceRecords.length
      }
    };
  } catch (error) {
    console.error("Error filling sample data:", error);
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = { fillHomePageData };