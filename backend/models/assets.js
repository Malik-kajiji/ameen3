const mongoose = require('mongoose');

const schema = mongoose.Schema

const assetsSchema = new schema({
    name: {
        type:String,
        required:true,
    },
    category: {
        type:String,
        default:'غير محدد',
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
    status: {
        type:String,
        default:'جيد',
    },
    location: {
        type:String,
        default:'غير محدد',
    },
    supplier: {
        type:String,
        default:'غير محدد',
    },
})

assetsSchema.statics.addAsset = async function(name, price, purchaseDate, warrantyExpire, category, status, location, supplier) {
    const asset = await this.create({
        name,
        category: category || 'غير محدد',
        price,
        purchaseDate: purchaseDate || new Date(),
        warrantyExpire,
        status: status || 'جيد',
        location: location || 'غير محدد',
        supplier: supplier || 'غير محدد'
    });
    return asset;
}



module.exports = mongoose.model('asset',assetsSchema)