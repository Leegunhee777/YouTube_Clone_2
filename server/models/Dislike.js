const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema({
    //싫어요를 누른사람의 _id저장, 동영상에싫어요, 댓글에싫어요 기록!!
   userId:{                                 
       type: Schema.Types.ObjectId,
       ref:'User'
   },
   commentId:{
       type:Schema.Types.ObjectId,
       ref:'Comment'
   },
   videoId:{
       type:Schema.Types.ObjectId,
       ref: 'Video'
   }
 
},{timestamps:true}) //timestamps를통해 생성시간과 업데이트시간에 대한 기록을 남길수있음(해당필드가 자동으로추가됨)



const Dislike = mongoose.model('Dislike', dislikeSchema);
   
module.exports = { Dislike }