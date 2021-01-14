const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    
    videoId:{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    writer:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type:String
    },
    chainResponseId:{ //대댓글을위한필드임, 내가 달려는 댓글이 , 어느 comment에 달리는 댓글인지 흔적을 남기기위한것임//부모댓글의_id를저장
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    
 
},{timestamps:true}) //timestamps를통해 생성시간과 업데이트시간에 대한 기록을 남길수있음(해당필드가 자동으로추가됨)



const Comment = mongoose.model('Comment', commentSchema);
   
module.exports = { Comment }