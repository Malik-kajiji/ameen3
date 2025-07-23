const mongoose = require('mongoose');

const schema = mongoose.Schema

const assetsSchema = new schema({
    name: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    purchaseDate: {
        type:Date,
        required:true,
    },
    warrantyExpire: {
        type:Date,
        required:true,
    },
})

assetsSchema.statics.addAsset = async function(name,price,warrantyExpire) {
    const asset = await this.create({
        name,price,purchaseDate:new Date(),warrantyExpire
    });
    return asset;
}



module.exports = mongoose.model('asset',assetsSchema)