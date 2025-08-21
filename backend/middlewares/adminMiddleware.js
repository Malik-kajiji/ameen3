const JWT = require('jsonwebtoken');
const Admin = require('../models/admin')


const adminMiddleware = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'] || req.headers['Authorization'];

        if (!authorization) {
            console.log('No authorization header found:', req.headers);
            return res.status(401).json({ error: 'لم تتم عملية التحقق بنجاح' });
        }

        const token = authorization.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : authorization;

        if (!token) {
            return res.status(401).json({ error: 'لم تتم عملية التحقق بنجاح' });
        }
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
        console.error('Auth error:', err);
        return res.status(401).json({ error: err.message });
    }
}

module.exports = adminMiddleware