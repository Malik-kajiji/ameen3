const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express()
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: false,
    exposedHeaders: ['Content-Disposition'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// // owner routes
// const ownerLoginRoutes = require('./routes/ownerRoutes/ownerLoginRoutes')
// const ownerAdminRoutes = require('./routes/ownerRoutes/ownerAdminRoutes')
// // owner end points
// app.use('/owner',ownerLoginRoutes)
// app.use('/owner-admin',ownerAdminRoutes)


// user routes
const userHomePageRoutes = require('./routes/userRoutes/homePageRoutes')
const myAccountRoutes = require('./routes/userRoutes/myAccountRoutes')

app.use('/user',userHomePageRoutes) 
app.use('/my-account',myAccountRoutes) 


// dashboard routes
const dashboardHomePageRoutes = require('./routes/adminRoutes/homePageRoutes');
const ownerLoginRoutes = require('./routes/ownerRoutes/ownerLoginRoutes')
const memberRoutes = require('./routes/adminRoutes/memberRoutes');
const websiteRoutes = require('./routes/adminRoutes/websiteRoutes');
const pauseRequestsRoutes = require('./routes/adminRoutes/pauseRequestsRoutes');
const employeeRoutes = require('./routes/adminRoutes/employeeRoutes');
const employeeAttendanceRoutes = require('./routes/adminRoutes/employeeAttendanceRoutes');
const financialRoutes = require('./routes/adminRoutes/financialRoutes');
const assetRoutes = require('./routes/adminRoutes/assetRoutes');
const dashboardStatsRoutes = require('./routes/adminRoutes/dashboardStatsRoutes');
const reportDownloadRoutes = require('./routes/adminRoutes/reportDownloadRoutes');
const reportRoutes = require('./routes/adminRoutes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes/adminRoutes');
const settingsRoutes = require('./routes/adminRoutes/settingsRoutes');
const notificationRoutes = require('./routes/adminRoutes/notificationRoutes');

app.use('/owner',ownerLoginRoutes)
app.use('/admin/notifications', notificationRoutes)
app.use('/admin/settings', settingsRoutes)
app.use('/dashboard', dashboardHomePageRoutes);
app.use('/members', memberRoutes);
app.use('/admin/website', websiteRoutes);
app.use('/admin', adminRoutes);
app.use('/pause-requests', pauseRequestsRoutes);
app.use('/employees', employeeRoutes);
app.use('/employees', employeeAttendanceRoutes);
app.use('/financial', financialRoutes);
app.use('/assets', assetRoutes);
app.use('/dashboard-stats', dashboardStatsRoutes);
app.use('/reports/download', reportDownloadRoutes);
app.use('/reports', reportRoutes);

// test routes
const testRoutes = require('./routes/test/test');
app.use('/test', testRoutes);


mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening to port ${process.env.PORT} & connected to mongodb`)
    })
})
.catch((err)=>{
    console.log(err)
})