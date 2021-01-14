import axios from 'axios';
import React, {useState} from 'react'
import {useSelector} from 'react-redux'; //리덕스 스토어의 state를 손쉽게 가져올수있는 방법임
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment({videoId,commentLists,refreshFunction}){

    const user = useSelector(state=> state.user);//1. 스토어의 state값을 손쉽게 가져온다.
                                                 //2.{localStorage.getItem('userId')} 사용하여 localStrage에 있는 로그인된 user_id를 가져온다.
                                                 //<LoginPage.js>부분에서 로그인후에 서버로부터 ,로그인된사용자에 대한 정보를받아 로컬스토리지에 저장하는부분이있음, 이를활용할수도있다는말
    const [commentValue, setcommentValue] = useState("");

    const handleClick = (event)=>{
        setcommentValue(event.currentTarget.value);
    }

    const onSubmit = (event)=>{
        event.preventDefault();


        const variables={
            content: commentValue,              //작성내용
            writer: user.userData._id,               //작성자 id
            videoId: videoId                 //동영상 id 를전달해줌

        }

        axios.post('/api/comment/saveComment',variables)
        .then(response =>{
            if(response.data.success){
                //console.log(response.data.result);
                refreshFunction(response.data.result);
                setcommentValue("");
            }else{
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }
    return(
        <div>
            <br/>
            <p>Replies</p>
            <hr/>

            {/* Comment Lists 댓글보는부분*/}
            {commentLists && commentLists.map(( comment, index)=> (
            
                (!comment.chainResponseId && //처음엔 대댓글까지는 안보여주게하려고, 이런조건을 건거임
                <div key={index}>
                    <SingleComment key={index} refreshFunction={refreshFunction} comment={comment} videoId={videoId}/>
                    <hr/>
                    <ReplyComment  key={comment._id} parentCommentId={comment._id} commentLists={commentLists}  refreshFunction={refreshFunction} videoId={videoId}/>
                    <br/><br/>
                </div>
                )
            ))}
        
            <br/>
            <hr/>
            <hr/>
            {/*Root Comment Form Root댓글쓰는부분*/}
            <form style = {{display:'flex'}} onSubmit= {onSubmit}>
                <textarea
                    style={{ width: '90%', borderRadius:'5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성해주세요"


                />
                <br/>
                <button style={{width:'10%', height: '52px'}} onClick= {onSubmit} >Submit</button>
            </form>
            <div>
                
                로그인테스트 리덕스:{user.userData && user.userData._id},로컬스토리지{localStorage.getItem('userId')}
            </div>
        </div>
    )
}

export default Comment;