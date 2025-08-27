const mongoose = require('mongoose');

const schema = mongoose.Schema;

const employeeAttendanceSchema = new schema({
    employeeId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['حضر', 'غائب']
    },
    hours: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

// Static method to create attendance record
employeeAttendanceSchema.statics.createAttendance = async function(employeeId, date, status, hours) {
    const attendance = await this.create({
        employeeId,
        date: new Date(date),
        status,
        hours
    });
    return attendance;
};

// Static method to get employee attendance records
employeeAttendanceSchema.statics.getEmployeeAttendance = async function(employeeId) {
    const records = await this.find({
        employeeId
    }).sort({ date: -1 });
    return records;
};

// Static method to update attendance record
employeeAttendanceSchema.statics.updateAttendance = async function(id, status, hours) {
    const attendance = await this.findByIdAndUpdate(
        id,
        { status, hours },
        { new: true }
    );
    return attendance;
};

module.exports = mongoose.model('employeeAttendance', employeeAttendanceSchema);