import React ,{useState} from 'react';
import {Comment, Avatar, Button, Input} from 'antd';
import axios from 'axios';
import {useSelector} from 'react-redux'; //리덕스 스토어의 state를 손쉽게 가져올수있는 방법임
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment({videoId,comment,refreshFunction}){

    const user = useSelector(state=> state.user);//1.스토어의 state값을 손쉽게 가져온다. 
                                                //2.{localStorage.getItem('userId')} 사용하여 localStrage에 있는 로그인된 user_id를 가져온다.
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
   
    const onClickReplayOpen = () =>{
        setOpenReply(!OpenReply);
    }
    
    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event)=>{
        event.preventDefault();

        //이놈은 댓글의 댓글을 다는 기능이므로, chaninResonseId가 필요함, 누구의 댓글인지에 대한정보
        const variables={
            content: CommentValue,              //작성내용
            writer: user.userData._id,               //작성자 id
            videoId: videoId,                //동영상 id 를전달해줌
            chainResponseId: comment._id      //댓글 DB내의 document의 고유 _id를 대댓글구현에 활용함
        }

        axios.post('/api/comment/saveComment',variables)
        .then(response =>{
            if(response.data.success){
                console.log(response.data.result);
                refreshFunction(response.data.result);
                setCommentValue("");
            }else{
                alert('커멘트를 저장하지 못했습니다.')
            }
        })
    }
    


    const actions = [
        <LikeDislikes userId={user} commentId={comment._id}/>
        ,<span onClick={onClickReplayOpen} key="comment-basic-reply-to">댓글작성하기</span>
    ]

    return(
        <div>
            
            
            <Comment
                actions={actions}
                author={<p>{comment.writer.name}</p>}
                avatar= {<Avatar src={comment.writer.image}/>}
                content={<p>{comment.content}</p>}
            />

            {OpenReply &&
            <form style = {{display:'flex'}} onSubmit= {onSubmit}>
            <textarea
                style={{ width: '90%', borderRadius:'5px' }}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder="코멘트를 작성해주세요"


            />
            <br/>
            <button style={{width:'10%', height: '52px'}} onClick= {onSubmit} >Submit</button>
            </form>
            
            }
        
        </div>
    )
}

export default SingleComment;