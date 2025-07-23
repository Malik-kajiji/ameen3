const mongoose = require('mongoose');

const schema = mongoose.Schema

const employeeAttendanceSchema = new schema({
    employeeId: {
        type:String,
        required:true,
    },
    checkOut: {
        type:Date,
    }
},{timestamps:true})

employeeAttendanceSchema.statics.createAttend = async function(employeeId) {
    const attend = await this.create({
        employeeId,
    });
    return attend;
}

employeeAttendanceSchema.statics.checkOutAttend = async function(employeeId) {
    const attend = await this.findOneAndUpdate({employeeId},{checkOut:new Date()});
    return attend;
}


employeeAttendanceSchema.statics.getEmployeeAttendance = async function(employeeId) {
    const attend = await this.find({
        employeeId,
    });
    return attend;
}

module.exports = mongoose.model('employeeAttendance',employeeAttendanceSchema)