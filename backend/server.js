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
    origin:'*',
    methods:'GET,POST,PUT,DELETE',
    credentials:true
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

app.use('/owner',ownerLoginRoutes)
app.use('/dashboard', dashboardHomePageRoutes);

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`listening to port ${process.env.PORT} & connected to mongodb`)
    })
})
.catch((err)=>{
    console.log(err)
})