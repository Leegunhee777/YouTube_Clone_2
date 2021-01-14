const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Comment } = require("../models/Comment");

router.post("/saveComment", (req,res)=>{
    
    const comment = new Comment(req.body)

    comment.save((err, doc)=>{ //객체를 DB에 저장한뒤에 document가 반환됨
        if(err) return res.json({success: false, err})

        Comment.find({'_id': doc._id}) //방금위에서 저장한 객체(document)를 찾는행위임
        .populate('writer')
        .exec((err, result)=>{
            if(err) return res.json({success:false, err})
            res.status(200).json({success: true, result})
        })
    })
})


//해당 비디오에 관련된 모든 댓글 다가져옴
router.post("/getComments", (req,res)=>{
    
    Comment.find({ "videoId" : req.body.videoId})
    .populate('writer')
    .exec(( err, comments)=>{
        if(err) return res.status(400).send(err)

        res.status(200).json({success: true, comments});
    })
   
})


module.exports = router;
