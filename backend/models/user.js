const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = mongoose.Schema

const userSchema = new schema({
    userNumber:{
        type:Number,
        required:true,
        unique:true
    },
    username: {
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
    gender: {
        type:String,
        required:true,
        enum:['male','female']
    },
    city: {
        type:String,
        required:true,
    },
    profilePicture: {
        type:String,
        required:true,
    },
    status: {
        type:String,
        required:true,
    },
    currentSubscriptionId: {
        type:String,
    },
    remainingDays: {
        type:Number,
    },
    pauseBalance: {
        type:Number,
    },
},{timestamps:true})



userSchema.statics.createUser = async function(username,phone,email,password,gender,city,profilePicture,status) {
    const exists = await this.findOne({phone})
    if(exists){
        throw Error('رقم الهاتف مستخدم بالفعل الرجاء تسجيل الدخول!')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt)
    const latestUser = await this.findOne().sort({ userNumber: -1 });

    let userNumber = 1;
    if (latestUser) {
        userNumber = latestUser.userNumber + 1;
    }
    const user = await this.create({
        userNumber,
        username,
        phone,
        email,
        password:hash,
        gender,
        city,
        profilePicture,
        status
    })
    return user
}

userSchema.statics.deleteUser = async function(userId) {
    const exists = await this.findOne({_id:userId})
    if(!exists){
        throw Error('الستخدم غير موجود!')
    }

    await this.findOneAndDelete({_id:userId})
    
    return exists
}

userSchema.statics.changeUserData = async function(_id,email,phone,password) {
    const user = await this.findOne({_id})
    const match = await bcrypt.compare(password,user.password)

    if(!match){
        throw Error('كلمة مرور غير صحيحة')
    }

    if(email !== '' && phone !== ''){
        const user = await this.findOneAndUpdate({_id},{email,phone})
        return {...user._doc,email,phone}
    } else if(email === '' && phone !== ''){
        const user = await this.findOneAndUpdate({_id},{phone})
        return {...user._doc,phone}
    } else if(email !== '' && phone === ''){
        const user = await this.findOneAndUpdate({_id},{email})
        return {...user._doc,email}
    }else {
        return user
    }
}


userSchema.statics.loginAsUser = async function(email,password) {
    const user = await this.findOne({email})
    if(!user){
        throw Error('البريد الالكتروني غير موجود')
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


userSchema.statics.changePasswordById = async function(_id,password) {
    const user = await this.findOne({_id})
    if(!user){
        throw Error('الحساب غير موجود يرجى انشاء حساب')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    await this.findOneAndUpdate({_id},{password:hash})

    return {...user._doc,password:hash}
}


userSchema.statics.getUsers = async function(pageCount) {
    const limitCount = 100
    const skipCount = limitCount * (pageCount - 1)
    const users = await this.find()
    .limit(limitCount)
    .skip(skipCount)

    return users
}

userSchema.statics.getUserByPhoneNumber = async function(phone) {
    const users = await this.find({phone: { $regex: new RegExp(phone, 'i') }})

    return users
}

userSchema.statics.getSingleUser = async function(_id) {
    const user = await this.findOne({_id})

    return user
}


module.exports = mongoose.model('user',userSchema)