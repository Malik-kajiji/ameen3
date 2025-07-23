const mongoose = require('mongoose');

const schema = mongoose.Schema

const salarySchema = new schema({
    fullName: {
        type:String,
        required:true,
    },
    bio: {
        type:String,
        required:true,
    },
    profilePicture: {
        type:String,
        required:true,
    },
    schedual : {
        type:Array,
        required:true,
    }
})

salarySchema.statics.createTrainer = async function(fullName,bio,profilePicture,schedual) {
    const exists = await this.findOne({fullName})
    if(exists){
        throw Error('الإسم مستخدم بالفعل!')
    }

    const tainer = await this.create({
        fullName,bio,profilePicture,schedual
    });
    return tainer;
}


salarySchema.statics.editSchedual = async function(_id,schedual) {
    const tainer = await this.findOneAndUpdate({_id},{schedual});
    
    return tainer;
}

salarySchema.statics.deleteTrainer = async function(_id) {
    const tainer = await this.findOneAndDelete({_id});

    return tainer;
}

module.exports = mongoose.model('salary',salarySchema)