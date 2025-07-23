const packageModel = require('../../models/packages')
const trainingSchedualModel = require('../../models/trainingSchedual')
const userModel = require('../../models/user')
const JWT = require('jsonwebtoken');

const getHomePageData = async (req, res) => {
    try {
        const [packages, trainingSchedual] = await Promise.all([
            packageModel.getAllPackages(),
            trainingSchedualModel.getAllDays()
        ]);

        res.status(200).json({ packages, trainingSchedual });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


const createToken =  (_id)=>{
    return JWT.sign({_id},process.env.SECRET,{expiresIn:'30d'})
}

const loginAsUser = async (req,res) => {
    const { email,password } = req.body
    try {
        if(email === '' || password === ''){
            res.status(400).json({message:'الرجاء ملئ الحقول'})
        }
        const user = await userModel.loginAsUser(email,password)
        const token = createToken(user._id)
        res.status(200).json({
            username:user.username,
            token,
            phoneNumber:user.phone,
            email:user.email,
            userNumber:user.userNumber,
            status:user.status,
        })
    }catch(err){
        res.status(400).json({message:err.message});
    }
}


module.exports = {
    getHomePageData,
    loginAsUser
}