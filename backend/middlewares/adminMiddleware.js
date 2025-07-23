const JWT = require('jsonwebtoken');
const Admin = require('../models/admin')


const adimMiddleware = async (req,res,next)=>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({error:'لم تتم عملية التحقق بنجاح'});
    }

    try {
        const token = authorization.split(' ')[1];
        const {_id} = JWT.verify(token,process.env.SECRET)
        if(_id === process.env.OWNER_ID) {
            req.admin = {admin_id:_id,access:['owner'],username:process.env.OWNER_EMAIL}
        }else {
            const exists = await Admin.findOne({_id});
            if(exists){
                const { access,username } = exists
                req.admin = {admin_id:_id,access,username}
            }else {
                throw Error('الحساب غير موجود')
            }
        }
        next()
    }catch (err){
        return res.status(401).json({error:err.message});
    }
}

module.exports = adimMiddleware