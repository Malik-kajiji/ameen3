const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const adminSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['مدير عام', 'مدير', 'دعم فني'],
        required: true
    },
    status: {
        type: String,
        enum: ['نشط', 'غير نشط'],
        default: 'نشط'
    },
    access: {
        type: Array,
        default: [],
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true })

adminSchema.statics.createAdmin = async function(username, password, name, email, role, access) {
    const exists = await this.findOne({ $or: [{ username }, { email }] })
    if (exists) {
        throw Error('اسم المستخدم أو البريد الإلكتروني موجود بالفعل')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)
    const admin = await this.create({
        username,
        password: hash,
        name,
        email,
        role,
        access
    })
    return admin
}

adminSchema.statics.deleteAdmin = async function(id){
    const exists = await this.findOne({_id:id})
    if(!exists){
        throw Error('المسؤول غير موجود')
    }else {
        const product = await this.findOneAndDelete({_id:id});
        return product
    }
}

adminSchema.statics.loginAsAdmin = async function(username, password) {
    // Check if it's the super admin
    if (username === process.env.OWNER_EMAIL && password === process.env.OWNER_PASS) {
        return {
            _id: process.env.OWNER_ID,
            username: process.env.OWNER_EMAIL,
            name: 'Super Admin',
            email: process.env.OWNER_EMAIL,
            role: 'مدير عام',
            access: ['الكل'],
            status: 'نشط',
            lastLogin: new Date()
        };
    }

    // If not super admin, check regular admins
    const admin = await this.findOne({ username })
    if (!admin) {
        throw Error('اسم المستخدم غير موجود')
    }

    if (admin.status === 'غير نشط') {
        throw Error('هذا الحساب غير نشط')
    }

    const match = await bcrypt.compare(password, admin.password)
    if (!match) {
        throw Error('كلمة مرور غير صحيحة')
    }

    // Update last login time
    await this.findOneAndUpdate({ _id: admin._id }, { lastLogin: new Date() })

    return admin
}

adminSchema.statics.checkPassword = async function(_id,password){
    const admin = await this.findOne({_id})
    if(!admin){
        throw Error('الحساب غير موجود')
    }

    const match = await bcrypt.compare(password,admin.password)

    if(!match){
        throw Error('كلمة مرور غير صحيحة')
    }

    return true
}

adminSchema.statics.editAccess = async function(_id,access) {
    const admin = await this.findOne({_id})
    if(!admin){
        throw Error('الاسم غير موجود')
    }

    await this.findOneAndUpdate({_id},{access})

    return {...admin._doc,access}
}

adminSchema.statics.changePassword = async function(_id,password) {
    const virus = await this.findOne({_id})
    if(!virus){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    await this.findOneAndUpdate({_id},{password:hash})

    return {...virus._doc,password:hash}
}

adminSchema.statics.getAllAdmins = async function() {
    const admins = await this.find()

    return admins
}

module.exports = mongoose.model('admin',adminSchema)