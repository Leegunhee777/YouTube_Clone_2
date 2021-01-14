import React ,{useEffect, useState} from 'react';
import SingleComment from './SingleComment';

function ReplyComment({commentLists, refreshFunction, videoId, parentCommentId}){

    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(()=>{

        let commentNumber = 0;

        commentLists.map((comment)=> {
            if(comment.chainResponseId === parentCommentId){
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber);

    },[commentLists]) //대댓글들도, 댓글DB추가에 따라 맞춰 반응시키기위함



    let renderReplyComment = (parentCommentId) =>
    commentLists.map((comment, index) => (
        <div key={index}> 
            {comment.chainResponseId === parentCommentId && //대댓글이 어느 댓글에 달려있는 대댓글인지 찾기위함임,대댓글의 chainResponseId는 자기가달려있는 부모댓글의 _id를 가지고있기때문
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    
                    <SingleComment key={index} refreshFunction={refreshFunction} comment={comment} videoId={videoId}/>
                    <hr/>
                    <ReplyComment   key={comment._id} parentCommentId={comment._id} commentLists={commentLists}  refreshFunction={refreshFunction} videoId={videoId}/>
                    <br/>
                    <br/>
                
                </div>
            }
        </div>
    ))

    const onHandleChange = () =>{
        
        setOpenReplyComments(!OpenReplyComments);
    }


    return(
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin:0, color: 'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)

                </p>
            }
            {OpenReplyComments &&
                renderReplyComment(parentCommentId)
            }
        </div>
    )
}

export default ReplyComment;