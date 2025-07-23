const mongoose = require('mongoose');

const schema = mongoose.Schema

const packageSchema = new schema({
    title: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    period: {
        type:Number,
        required:true,
    },
    pauseDaysAllowed: {
        type:Number,
        required:true,
    },
    benefits: {
        type:Array,
        required:true,
    }
},{timestamps:true})

packageSchema.statics.getAllPackages = async function() {
    const packages = await this.find()
    
    return packages
}

packageSchema.statics.createPackage = async function(title,price,period,pauseDaysAllowed,benefits) {
    const exists = await this.findOne({title})
    if(exists){
        throw Error('الإسم مستخدم بالفعل!')
    }
    const package = await this.create({
        title,
        price,
        period,
        pauseDaysAllowed,
        benefits
    })
    return package
}

packageSchema.statics.deletePackage = async function(_id) {
    const exists = await this.findOne({_id})
    if(!exists){
        throw Error('الإسم غير موجود!')
    }

    await this.findOneAndDelete({_id})
    
    return exists
}


module.exports = mongoose.model('package',packageSchema)