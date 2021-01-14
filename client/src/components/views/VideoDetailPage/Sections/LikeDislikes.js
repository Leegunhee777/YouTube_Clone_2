import React, { useEffect, useState } from 'react';
import {Tooltip, Icon} from 'antd';
import axios from 'axios';


function LikeDislikes({video,userId,videoId,commentId}) {


    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);

    const [Dislikes, setDislikes] = useState(0);
    const [DislikeAction, setDislikeAction] = useState(null);


    let variable = {}

    if(video){
       if(localStorage.getItem('userId'))
        variable = {videoId:videoId, userId :localStorage.getItem('userId')}
    }else{
        if(localStorage.getItem('userId'))
        variable = {commentId:commentId , userId:localStorage.getItem('userId')}
    }


    useEffect(()=>{

        if(variable){
        axios.post('/api/like/getLikes', variable)
        .then(response =>{
            if(response.data.success){
                
                //얼마나 많은 좋아요를 받았는지( Video Or 댓글이)
                setLikes(response.data.likes.length);

                //내가 이미 그 좋아요를 눌렀는지
                response.data.likes.map(item =>{
                    if(item.userId == localStorage.getItem('userId')) //Like DB의 좋아요를 기록한 유저가, 현재 로그인한 유저과 id가 같다면 (이미내가 좋아요눌렀었다는말)
                    setLikeAction('liked')
                })
            }else{
                alert('Likes 정보를 가져오지 못했습니다.')
            }
        })
        }

        if(variable){
            axios.post('/api/like/getDislikes', variable)
            .then(response =>{
                if(response.data.success){
                    
                    //얼마나 많은 싫어요를 받았는지( Video Or 댓글이)
                    setDislikes(response.data.dislikes.length);
    
                    //내가 이미 그 싫어요를 눌렀는지
                    response.data.dislikes.map(item =>{
                        if(item.userId == localStorage.getItem('userId')) //Dislike DB의 싫어요를 기록한 유저가, 현재 로그인한 유저과 id가 같다면 (이미내가 싫어요를눌렀었다는말)
                        setDislikeAction('disliked')
                    })
                }else{
                    alert('DisLikes 정보를 가져오지 못했습니다.')
                }
            })
            }
    },[])


    const onLike = () =>{ //좋아요버튼 클릭

        if(LikeAction === null) //좋아요가 눌러있는 상태가 아니라면
        {
            axios.post('/api/like/upLike', variable)//좋아요 처리해야함
            .then(response =>{
                if(response.data.success){
                    setLikes(Likes + 1)
                    setLikeAction('liked')

                    if(DislikeAction !== null){// 싫어요가 클릭되어있는 상태라면
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)
                    }
                }else{
                    alert('좋아요를 올리지 못하였습니다')
                }
            })
        }else{ //좋아요가 이미 눌러있는 상태라면
            axios.post('/api/like/unLike', variable) //좋아요를 취소처리해야함
            .then(response =>{
                if(response.data.success){
                    setLikes(Likes - 1)
                    setLikeAction(null)
                }else{
                    alert('좋아요를 내리지 못하였습니다')
                }
            })
        }
    }


    const onDislike= () =>{
        if(DislikeAction === null) //싫어요가 눌러있는 상태가 아니라면
        {
            axios.post('/api/like/upDisLike', variable)//싫어요 처리해야함
            .then(response =>{
                if(response.data.success){
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null){// 좋아요가 클릭되어있는 상태라면
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }

                }else{
                    alert('싫어요를 올리지 못하였습니다')
                }
            })

        }else{ //싫어요가 이미 눌러있는 상태라면
            axios.post('/api/like/unDisLike', variable) //싫어요를 취소처리해야함
            .then(response =>{
                if(response.data.success){
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null)
                }else{
                    alert('싫어요를 내리지 못하였습니다')
                }
            })
        }
    }
    return(
        <div>
            <span key="comment-basic-like">
                <Tooltip title = "Like">
                    <Icon type= "like"
                        theme={LikeAction === 'liked'? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Likes}</span>
            </span>


            <span key="comment-basic-dislike">
                <Tooltip title = "Dislike">
                    <Icon type= "dislike"
                        theme={DislikeAction === 'disliked'? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Dislikes}</span>
            </span>



        </div>
    )
}

export default LikeDislikes;