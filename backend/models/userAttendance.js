const mongoose = require('mongoose');

const schema = mongoose.Schema

const userAttendanceSchema = new schema({
    userId: {
        type:String,
        required:true,
    },
    data: {
        type:Array,
        default:[]
    }
})

userAttendanceSchema.statics.createAttend = async function(userId) {
    const attend = await this.create({
        userId,
    });
    return attend;
}

userAttendanceSchema.statics.getUserAttendance = async function(userId) {
    const attend = await this.findOne({
        userId,
    });
    return attend;
}

module.exports = mongoose.model('userAttendance',userAttendanceSchema)