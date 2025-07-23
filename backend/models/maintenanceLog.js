const mongoose = require('mongoose');

const schema = mongoose.Schema

const maintenanceLogSchema = new schema({
    asset_id: {
        type:String,
        required:true,
    },
    maintenanceType: {
        type:String,
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    maintenanceDate: {
        type:Date,
        required:true,
    },
    cost: {
        type:Number,
        required:true,
    },
})

maintenanceLogSchema.statics.addLog = async function(asset_id,maintenanceType,description,maintenanceDate,cost) {
    const log = await this.create({
        asset_id,maintenanceType,description,maintenanceDate,cost
    });
    return log;
}



module.exports = mongoose.model('maintenanceLog',maintenanceLogSchema)