const mongoose = require('mongoose');

const schema = mongoose.Schema

const subscriptionSchema = new schema({
    userId: {
        type:String,
        required:true,
    },
    packageId: {
        type:String,
        required:true,
    },
    packageName: {
        type:String,
        required:true,
    },
    packagePrice: {
        type:Number,
        required:true,
    },
    packagePeriod: {
        type:Number,
        required:true,
    },
    startData: {
        type:Date,
        required:true,
    },
    endData: {
        type:Date,
        required:true,
    },
    pausedDays: {
        type:Number,
        default:0
    },
    status: {
        type:String,
        enum:['active','paused','ended'],
        default:'active'
    },
    createdBy: {
        type:String,
        required:true,
    },
    allowedPauseDays: {
        type:Number,
        default:0
    },
    usedPausedDays: {
        type:Number,
        default:0
    }
},{timestamps:true})



subscriptionSchema.statics.createSubscription = async function(userId, packageId, packageName, packagePrice, createdBy, durationDays) {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const subscription = await this.create({
        userId,
        packageId,
        packageName, 
        packagePrice,
        startDate,
        endDate,
        createdBy,
    });
    return subscription;
}

subscriptionSchema.statics.getUserSusbs = async function(userId) {
    const subs = await this.find({userId})
    return subs;
}

subscriptionSchema.statics.pauseSubsription = async function(_id) {
    await this.findOneAndUpdate({_id},{status:'paused'})

    return {message:'paused successfully'}
}

subscriptionSchema.statics.activeSubsription = async function(_id) {
    await this.findOneAndUpdate({_id},{status:'active'})

    return {message:'activated successfully'}
}


module.exports = mongoose.model('subscription',subscriptionSchema)