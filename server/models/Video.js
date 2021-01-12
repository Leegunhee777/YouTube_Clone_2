const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        maxlength: 50
    },
    description:{
        type: String
    },
    privacy:{
        type:String
    },
    filePath:{
        type:String
    },
    category:{
        type:String
    },
    views:{
        type: Number,
        default: 0
    }
 
},{timestamps:true}) //timestamps를통해 생성시간과 업데이트시간에 대한 기록을 남길수있음



const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }