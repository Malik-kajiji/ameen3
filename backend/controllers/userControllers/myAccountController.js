const userModel = require('../../models/user')
const requestModel = require('../../models/stopRequests')
const subscriptionModel = require('../../models/subscriptions')
const attendanceModel = require('../../models/userAttendance')

const changeUserData = async (req,res) => {
    const { user_id } = req.user
    const { phone,email,password } = req.body
    try {
        const user = await userModel.changeUserData(user_id,email,phone,password)
        res.status(200).json({email:user.email,phone:user.phone})
    }catch(err){
        res.status(400).json({message:err.message});
    }
}

const getUserData = async (req,res) => {
    const { userNumber,username,phone,email,gender,city,status,currentPackageId,remainingDays,pauseBalance } = req.user
    try {
        res.status(200).json({userNumber,username,phone,email,gender,city,status,currentPackageId,remainingDays,pauseBalance})
    } catch(err){
        res.status(400).json({message:err.message});
    }

}

const sendPauseRequest = async (req,res) => {
    const { user_id } = req.user
    const { startDate,endDate,reason } = req.body
    try {
        const request = await requestModel.createRequest(user_id, startDate, endDate, reason)

        res.status(200).json({request})
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

const getSubscriptions = async (req,res) => {
    const { user_id,currentSubscriptionId } = req.user
    
    try {
        const subs = await subscriptionModel.getUserSusbs(user_id)
        const currentSubscription = subs.filter(e => e._id.toString() === currentSubscriptionId)[0] || null
        const userAttendance = await attendanceModel.getUserAttendance(user_id)

        res.status(200).json({subs,currentSubscription,userAttendance})
    } catch(err){
        res.status(400).json({message:err.message});
    }
}

module.exports = {
    changeUserData,
    getUserData,
    sendPauseRequest,
    getSubscriptions
}