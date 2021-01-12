const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const mongoose = require('mongoose');


const multer = require("multer");
//파일저장을위해 npm install multer --save 설치

//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    destination:(req, res, cb) =>{ //파일이 저장되는 위치
        cb(null, "uploads/");
    },
    filname:(req, file, cb)=>{ //저장되는이름을 정할수있음
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, res, cb) =>{ //파일의 형식제한
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);

        }
        cb(null, true);
    }
});
//storage 옵션을 정하여 파일을 저장할수있다.
const upload = multer({storage : storage}).single("file");


router.post("/uploadfiles", (req, res) => {

    upload(req, res, err => { //upload함수가 호출되는 순간 파일이 uploads폴더에 저장됨
                            //upload폴더에 파일이 저장된 후에, req.file을 이용하여 upload폴더내의 파일 경로를 불러올수있다.
        if (err) {
            console.log('111111111111');
            return res.json({ success: false, err })
        }
       
        return res.json({ success: true, filePath: req.file.path, fileName: req.file.filename })
            //저장된후에 req.file통해서 uploads폴더에있는 파일에 접근하여 그 정보를 res.해주는것임
    })

});



router.post("/uploadVideo", (req, res) => {
    
    const video = new Video(req.body);
    video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
            success: true 
        })
    })
});



router.get("/getVideos", (req, res) => {
    //비디오 정보를 DB에서 가져온다.
    Video.find().populate('writer')
    .exec((err, videos)=>{//위의 쿼리를 execution(실행)시키면 , err OR videos정보가 넘어온다.
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, videos})
    }) 

    
});


router.post("/getVideoDetail", (req, res) => {
    
    Video.findOne({"_id": req.body.videoId}).populate('writer')
    .exec((err, videoDetail)=>{ //위의 쿼리를 실행시키고 그 결과를 가져옴
        if(err) return res.status(400).send(err)
        
        return res.status(200).json({success:true, videoDetail})
    })
});






module.exports = router;
