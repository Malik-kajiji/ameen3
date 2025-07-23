const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const employeSchema = new schema({
    fullName: {
        type:String,
        required:true,
    },
    phone: {
        type:String,
        required:true,
        unique:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    jobTilte: {
        type:String,
        required:true,
    },
    role: {
        type:String,
        required:true,
    },
    profilePicture: {
        type:String,
        required:true,
    },
    salary: {
        type:Number,
        required:true,
    },
    hireData: {
        type:Date,
        required:true,
    },
    isActive: {
        type:Boolean,
        default:true
    }
},{timestamps:true})



employeSchema.statics.createEmploye = async function(fullName,phone,email,password,jobTilte,role,profilePicture,salary) {
    const exists = await this.findOne({phone})
    if(exists){
        throw Error('رقم الهاتف مستخدم بالفعل!')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt)
    const hireData = new Date()
    const user = await this.create({
        fullName,
        phone,
        email,
        password:hash,
        jobTilte,
        role,
        profilePicture,
        salary,
        hireData
    })
    return user
}

employeSchema.statics.deleteEmploye = async function(userId) {
    const exists = await this.findOne({_id:userId})
    if(!exists){
        throw Error('الستخدم غير موجود!')
    }

    await this.findOneAndDelete({_id:userId})
    
    return exists
}


employeSchema.statics.loginAsEmploye = async function(phoneNumber,password) {
    const user = await this.findOne({phoneNumber})
    if(!user){
        throw Error('رقم الهاتف غير موجود')
    }
    if(user.isBanned){
        throw Error('الحساب محظور')
    }

    const match = await bcrypt.compare(password,user.password)

    if(!match){
        throw Error('كلمة مرور غير صحيحة')
    }

    return user
}


employeSchema.statics.changePasswordById = async function(_id,password) {
    const user = await this.findOne({_id})
    if(!user){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    await this.findOneAndUpdate({_id},{password:hash})

    return {...user._doc,password:hash}
}


employeSchema.statics.getEmployees = async function(pageCount) {
    const limitCount = 100
    const skipCount = limitCount * (pageCount - 1)
    const users = await this.find()
    .limit(limitCount)
    .skip(skipCount)

    return users
}

employeSchema.statics.getEmployeByPhoneNumber = async function(phone) {
    const users = await this.find({phone: { $regex: new RegExp(phone, 'i') }})

    return users
}

employeSchema.statics.getSingleEmploye = async function(_id) {
    const user = await this.findOne({_id})

    return user
}

employeSchema.statics.setActive = async function(_id,isActive) {
    const user = await this.findOneAndUpdate({_id},{isActive})

    return user
}

employeSchema.statics.setSalary = async function(_id,salary) {
    const user = await this.findOneAndUpdate({_id},{salary})

    return user
}


module.exports = mongoose.model('employe',employeSchema)