const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    //좋아요를 누른사람의 _id저장, 동영상에좋아요, 댓글에좋아요 기록!!
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



const Like = mongoose.model('Like', likeSchema);
   
module.exports = { Like }