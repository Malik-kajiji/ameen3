const express = require('express')
const router = express.Router()
const userMiddleware = require('../../middlewares/userMiddleware')

const {
    changeUserData,
    getUserData,
    sendPauseRequest,
    getSubscriptions
} = require('../../controllers/userControllers/myAccountController')


router.use(userMiddleware)
router.get('/get-user-data',getUserData)
router.put('/chnage-user-data',changeUserData)
router.post('/send-pause-request',sendPauseRequest)
router.get('/get-subsriptions',getSubscriptions)

module.exports = router