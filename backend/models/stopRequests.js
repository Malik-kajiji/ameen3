const mongoose = require('mongoose');

const schema = mongoose.Schema

const stopRequestSchema = new schema({
    userId: {
        type:String,
        required:true,
    },
    startDate: {
        type:Date,
        required:true,
    },
    endData: {
        type:Date,
        required:true,
    },
    reason: {
        type:String,
    },
    status: {
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
},{timestamps:true})

stopRequestSchema.statics.createRequest = async function(userId, startDate, endData, reason) {
    const request = await this.create({
        userId,
        startDate,
        endData,
        reason
    });
    return request;
}

stopRequestSchema.statics.getPending = async function() {
    const requests = await this.find({status:'pending'})

    return requests
}

stopRequestSchema.statics.getAccepted = async function() {
    const requests = await this.find({status:'accepted'})

    return requests
}

stopRequestSchema.statics.getRejected = async function() {
    const requests = await this.find({status:'rejected'})

    return requests
}

stopRequestSchema.statics.acceptRequest = async function(_id) {
    const request = await this.findOneAndUpdate({_id},{status:'accepted'})

    return request
}

stopRequestSchema.statics.rejectRequest = async function(_id) {
    const request = await this.findOneAndUpdate({_id},{status:'rejected'})

    return request
}

module.exports = mongoose.model('stopRequest',stopRequestSchema)