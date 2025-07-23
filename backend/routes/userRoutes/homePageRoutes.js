const express = require('express')
const router = express.Router()

const {
    getHomePageData,
    loginAsUser
} = require('../../controllers/userControllers/homePageController')

router.get('/get-home-page-data',getHomePageData)
router.post('/login',loginAsUser)

module.exports = router