const mongoose = require('mongoose');

const schema = mongoose.Schema

const salarySchema = new schema({
    employeeId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    month: {
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
        default: 'مدفوع'
    },
    notes: {
        type: String,
    }
}, { timestamps: true })

salarySchema.statics.createSalary = async function(employeeId, amount, month, date, notes) {
    const payment = await this.create({
        employeeId,
        amount,
        month,
        date: new Date(date),
        notes
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