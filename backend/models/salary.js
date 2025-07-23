const mongoose = require('mongoose');

const schema = mongoose.Schema

const salarySchema = new schema({
    employeeId: {
        type:String,
        required:true,
    },
    amount: {
        type:Number,
        required:true,
    },
    notes: {
        type:String,
    }
},{timestamps:true})

salarySchema.statics.createSalary = async function(employeeId,amount,notes) {
    const payment = await this.create({
        employeeId,amount,notes
    });
    return payment;
}


salarySchema.statics.getEmployeePayments = async function(employeeId) {
    const payments = await this.find({
        employeeId,
    });
    return payments;
}

module.exports = mongoose.model('salary',salarySchema)