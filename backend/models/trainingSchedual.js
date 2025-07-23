const mongoose = require('mongoose');

const schema = mongoose.Schema

const trainingSchema = new schema({
    day:{
        type:String,
        required:true,
    },
    firstShift:{
        type:String,
        required:true,
    },
    secondShift:{
        type:String,
        required:true,
    },
    thirdShift:{
        type:String,
        required:true,
    }
})

trainingSchema.statics.addDay = async function(day,firstShift,secondShift,thirdShift) {
    const exists = await this.findOne({day})
    if(exists){
        throw Error('اليوم موجود بالفعل!')
    }

    const trainingDay = await this.create({
        day,firstShift,secondShift,thirdShift
    });
    return trainingDay;
}


trainingSchema.statics.editDay = async function(_id,firstShift,secondShift,thirdShift) {
    const trainingDay = await this.findOneAndUpdate({_id},{firstShift,secondShift,thirdShift});
    
    return trainingDay;
}

trainingSchema.statics.getAllDays = async function() {
    const trainingDays = await this.find();

    return trainingDays;
}

module.exports = mongoose.model('training',trainingSchema)