const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike"); 

router.post("/getLikes", (req,res)=>{
    let variable = {}
    
    //들어오는 정보가 video에 대한 좋아요일수도있고, 댓글에 대한 좋아요일수도있다.
    //if으로 그 둘을 구분시켜야함
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
    .exec((err, likes)=>{
        if(err) return res.status(400).send(err)
        
        res.status(200).json({ success: true, likes})
    })
});


router.post("/getDislikes", (req,res)=>{
    let variable = {}
    
    //들어오는 정보가 video에 대한 좋아요일수도있고, 댓글에 대한 좋아요일수도있다.
    //if으로 그 둘을 구분시켜야함
    if(req.body.videoId){//req.body에 videoId값이 있다면, 비디오에 대한것임
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
    .exec((err, dislikes)=>{
        if(err) return res.status(400).send(err)
        
        res.status(200).json({ success: true, dislikes})
    })
});



router.post("/upLike", (req, res) => {

    let variable = {}
    //들어오는 정보가 video에 대한 좋아요일수도있고, 댓글에 대한 좋아요일수도있다.
    //if으로 그 둘을 구분시켜야함
    if (req.body.videoId) {//req.body에 videoId값이 있다면, 비디오에 대한것임
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }
    //Like collection에다가  정보를 넣어준다.
    const like = new Like(variable)//디비의 인스턴스를 생성하여 인스턴스로 DB컨트롤가능

    
    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err });
          //Like를 추가할때 만약 Dislike가 이미 클릭되어있다면 , Dislike를 하나빼줘야함 why?싫어요와 좋아요가 동시에 눌릴수없으니까
        Dislike.findOneAndDelete(variable)
            .exec((err, disLikeResult) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true })
            })
    })

})




router.post("/unLike", (req, res) => {

    let variable = {}
    //들어오는 정보가 video에 대한 좋아요일수도있고, 댓글에 대한 좋아요일수도있다.
    //if으로 그 둘을 구분시켜야함
    if (req.body.videoId) {//req.body에 videoId값이 있다면, 비디오에 대한것임
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })

})





router.post("/upDisLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    const disLike = new Dislike(variable)
    //save the like information data in MongoDB
    disLike.save((err, dislikeResult) => {
        if (err) return res.json({ success: false, err });
        //In case Like Button is already clicked, we need to decrease the like by 1 
        Like.findOneAndDelete(variable)
            .exec((err, likeResult) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true })
            })
    })


})




router.post("/unDisLike", (req, res) => {

    let variable = {}
    if (req.body.videoId) {
        variable = { videoId: req.body.videoId, userId: req.body.userId }
    } else {
        variable = { commentId: req.body.commentId , userId: req.body.userId }
    }

    Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err })
        res.status(200).json({ success: true })
    })


})


module.exports = router;
